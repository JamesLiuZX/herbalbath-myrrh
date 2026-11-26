// Run with `pnpm test`. /gifts/corporate must stay claim-free and price-free.
import { test } from "node:test"
import assert from "node:assert/strict"
import { CORPORATE_GIFTS } from "./corporate-gifts.ts"
import { copyProblems } from "../../scripts/content/promotions.mjs"

const strings = (v) => (typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : Object.values(v).flatMap(strings))

test("every line on the corporate gifting page passes the promotion-copy rules", () => {
  for (const lang of ["zh", "en"]) {
    for (const text of strings(CORPORATE_GIFTS[lang])) assert.deepEqual(copyProblems(text, lang), [], `${lang}: ${text}`)
  }
})

test("the corporate gifting page shows no price, discount tier or spray wording", () => {
  for (const text of strings(CORPORATE_GIFTS)) {
    assert.doesNotMatch(text, /S\$|\d\s*%\s*(off|折)|折扣|discount|喷|spray/i, text)
  }
})

test("both languages carry the same sections", () => {
  assert.deepEqual(Object.keys(CORPORATE_GIFTS.zh), Object.keys(CORPORATE_GIFTS.en))
  assert.equal(CORPORATE_GIFTS.zh.steps.length, CORPORATE_GIFTS.en.steps.length)
})
