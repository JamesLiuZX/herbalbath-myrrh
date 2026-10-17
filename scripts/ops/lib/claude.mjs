// The agent loop: Claude works through a job by calling tools until it's done.
// Streaming with finalMessage(), eager input streaming on our own tools (so
// every input is validated here before it runs), server-side web search and
// fetch for research, pause_turn resumption, refusal fallbacks, and hard caps
// on turns so a confused run can't spin.

import { validate } from "./schema.mjs"

const DEFAULT_MODEL = "claude-opus-5-5"
// Server-side refusal fallbacks exist on these models only; elsewhere the parameter is a 400.
const FALLBACK_MODELS = new Set(["claude-fable-5-1", "claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5"])

export class AgentError extends Error {}

let sdk
export async function loadClaude() {
  sdk ??= (await import("@anthropic-ai/sdk")).default
  return sdk
}

export const SERVER_TOOLS = {
  web_search: {
    type: "web_search_20260209",
    name: "web_search",
    max_uses: 12,
    user_location: { type: "approximate", city: "Singapore", country: "SG", timezone: "Asia/Singapore" },
  },
  web_fetch: { type: "web_fetch_20260209", name: "web_fetch", max_uses: 12, max_content_tokens: 20000 },
}

export const textOf = (message) =>
  message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim()

/**
 * After a mid-output fallback, blocks the declined model produced before the
 * fallback marker can't be echoed back: keep its text and its completed
 * server-tool pairs, drop its thinking and its unfinished tool calls.
 */
export function echoable(content) {
  const last = content.map((b) => b.type).lastIndexOf("fallback")
  if (last < 0) return content
  const before = content.slice(0, last)
  const answered = new Set(before.filter((b) => b.type?.endsWith("_tool_result") && b.type !== "tool_result").map((b) => b.tool_use_id))
  const kept = before.filter(
    (b) => b.type === "text" || (b.type === "server_tool_use" && answered.has(b.id)) || (b.type?.endsWith("_tool_result") && b.type !== "tool_result"),
  )
  return [...kept, ...content.slice(last + 1)]
}

function describe(e, Anthropic) {
  if (e instanceof Anthropic.AuthenticationError) return "Claude rejected ANTHROPIC_API_KEY."
  if (e instanceof Anthropic.PermissionDeniedError) return "This API key can't use the configured model."
  if (e instanceof Anthropic.NotFoundError) return "Claude doesn't know the configured model."
  if (e instanceof Anthropic.RateLimitError) return "Claude is rate limiting this key; the next scheduled run will try again."
  if (e instanceof Anthropic.APIError) return `Claude returned an error (${e.status ?? "network"}).`
  return null
}

/**
 * Runs one agent job. `tools` are { name, description, input_schema, run(input) };
 * `server` lists server tool names (web_search, web_fetch). Returns
 * { status, text, turns, usage } where status is done | refused | truncated | turn-limit.
 */
export async function runLoop({
  client,
  Anthropic,
  model = DEFAULT_MODEL,
  system,
  prompt,
  tools,
  server = [],
  effort = "medium",
  maxTurns = 30,
  maxTokens = 16000,
  onTool = () => {},
}) {
  const byName = new Map(tools.map((t) => [t.name, t]))
  const params = {
    model,
    max_tokens: maxTokens,
    // The system prompt (knowledge base, playbook, role) is the same on every
    // turn of a run: cache it, together with the tool definitions before it.
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    tools: [
      ...tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema, eager_input_streaming: true })),
      ...server.map((name) => SERVER_TOOLS[name]),
    ],
    output_config: { effort },
  }
  if (FALLBACK_MODELS.has(model)) {
    params.betas = ["server-side-fallback-2026-07-01"]
    params.fallbacks = "default"
  }

  const messages = [{ role: "user", content: prompt }]
  const usage = { input: 0, output: 0, cacheRead: 0, searches: 0, fetches: 0 }
  let jsonRetries = 0
  let last = null

  for (let turn = 1; turn <= maxTurns; turn++) {
    let message
    try {
      message = await client.beta.messages.stream({ ...params, messages }).finalMessage()
      jsonRetries = 0
    } catch (e) {
      const known = describe(e, Anthropic)
      if (known) throw new AgentError(known)
      // A tool input that couldn't be parsed at all rejects finalMessage(): re-issue the turn.
      if (jsonRetries++ >= 2) throw e
      continue
    }
    last = message
    usage.input += (message.usage?.input_tokens ?? 0) + (message.usage?.cache_creation_input_tokens ?? 0)
    usage.cacheRead += message.usage?.cache_read_input_tokens ?? 0
    usage.output += message.usage?.output_tokens ?? 0
    usage.searches += message.usage?.server_tool_use?.web_search_requests ?? 0
    usage.fetches += message.usage?.server_tool_use?.web_fetch_requests ?? 0

    const content = echoable(message.content)
    if (message.stop_reason === "refusal") return { status: "refused", text: textOf({ content }), turns: turn, usage }
    if (message.stop_reason === "pause_turn") {
      // The server-side tool loop hit its limit; sending the turn back resumes it.
      messages.push({ role: "assistant", content })
      continue
    }
    const calls = content.filter((b) => b.type === "tool_use")
    if (!calls.length) return { status: message.stop_reason === "max_tokens" ? "truncated" : "done", text: textOf({ content }), turns: turn, usage }
    // A tool input cut off at max_tokens can parse as a valid partial object: don't run it.
    if (message.stop_reason === "max_tokens") return { status: "truncated", text: textOf({ content }), turns: turn, usage }

    messages.push({ role: "assistant", content })
    const results = []
    for (const call of calls) {
      const tool = byName.get(call.name)
      if (!tool) {
        results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: `There is no tool called ${call.name}.` })
        continue
      }
      const problems = validate(call.input, tool.input_schema)
      if (problems.length) {
        results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: JSON.stringify({ INVALID_INPUT: problems, received: call.input }) })
        continue
      }
      try {
        const out = await tool.run(call.input)
        onTool(call.name, true)
        results.push({ type: "tool_result", tool_use_id: call.id, content: typeof out === "string" ? out : JSON.stringify(out) })
      } catch (e) {
        onTool(call.name, false)
        results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: String(e.message ?? e) })
      }
    }
    messages.push({ role: "user", content: results })
  }
  return { status: "turn-limit", text: last ? textOf({ content: echoable(last.content) }) : "", turns: maxTurns, usage }
}
