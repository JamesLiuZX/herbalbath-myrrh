// A small JSON Schema checker for tool inputs. With eager input streaming the
// API no longer validates tool inputs, and the SDK's tolerant parser can hand
// back a silently truncated object, so every input is checked against its
// schema before the tool runs. Covers what the tool schemas use: type,
// required, properties, additionalProperties: false, items, enum.

const TYPES = {
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number" && Number.isFinite(v),
  integer: (v) => Number.isInteger(v),
  boolean: (v) => typeof v === "boolean",
  array: Array.isArray,
  object: (v) => v !== null && typeof v === "object" && !Array.isArray(v),
  null: (v) => v === null,
}

export function validate(value, schema, at = "input") {
  const errors = []
  if (!schema) return errors
  const types = schema.type ? [].concat(schema.type) : null
  if (types && !types.some((t) => TYPES[t]?.(value))) {
    errors.push(`${at} should be ${types.join(" or ")}`)
    return errors
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${at} should be one of ${schema.enum.map((e) => JSON.stringify(e)).join(", ")}`)
  if (TYPES.object(value) && (schema.properties || schema.required)) {
    for (const key of schema.required ?? []) if (value[key] === undefined) errors.push(`${at}.${key} is required`)
    for (const [key, sub] of Object.entries(schema.properties ?? {})) {
      if (value[key] !== undefined) errors.push(...validate(value[key], sub, `${at}.${key}`))
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) if (!schema.properties?.[key]) errors.push(`${at}.${key} isn't a known field`)
    }
  }
  if (Array.isArray(value) && schema.items) value.forEach((item, i) => errors.push(...validate(item, schema.items, `${at}[${i}]`)))
  return errors
}
