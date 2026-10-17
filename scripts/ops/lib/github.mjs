// Starting other Autopilot workflows from a run (the media renderer after the
// creative agent queues work, any agent from Telegram's /run). workflow_dispatch
// is the one event GitHub lets the workflow token trigger.

export async function dispatchWorkflow(workflow, inputs = {}, { repo = process.env.GITHUB_REPOSITORY, token = process.env.GITHUB_TOKEN } = {}) {
  if (!repo || !token) return false
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" },
    body: JSON.stringify({ ref: "main", inputs }),
  })
  if (!res.ok) throw new Error(`Couldn't start ${workflow} (${res.status}).`)
  return true
}
