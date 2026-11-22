// Run with `pnpm test`. content/promotions.json is the one price list; these
// are the guards that keep a bad edit from reaching customers.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { findPackage, formatPrice, permitValid, resolvePromotions, sgDate, sgDayStartMs, validatePromotions } from "./promotions.ts"
import { copyProblems, promotionProblems } from "../../scripts/content/promotions.mjs"

const live = JSON.parse(readFileSync(new URL("../../content/promotions.json", import.meta.url), "utf8"))
const at = (iso) => Date.parse(iso)

const base = () => ({
  permit: { number: "", validUntil: "" },
  floorPerBottle: 29,
  maxDiscountPct: 25,
  evergreen: {
    listPrice: 49,
    packages: [
      { id: "single", bottles: 1, price: 39, label: { zh: "单瓶装", en: "1 bottle" } },
      { id: "pair", bottles: 2, price: 72, label: { zh: "2瓶装", en: "2 bottles" }, requiresPermit: true },
      { id: "bundle", bottles: 4, price: 117, label: { zh: "4瓶装", en: "4 bottles" }, default: true },
    ],
  },
  campaigns: [],
})
const withPermit = (d) => ({ ...d, permit: { number: "SP-TEST-1", validUntil: "2027-11-30" } })
const cny = { id: "cny-2027", kind: "content-only", start: "2026-12-28", end: "2027-02-03", banner: { zh: "新年孝心礼", en: "Chinese New Year gifts" } }
const sale = { id: "sale", kind: "price", start: "2027-03-01", end: "2027-03-07", banner: { zh: "三月套装价", en: "March set price" }, packages: [{ id: "trio", bottles: 3, price: 99, label: { zh: "3瓶装", en: "3 bottles" } }] }

test("the live file is valid and sells today's two packages at today's prices", () => {
  assert.deepEqual(promotionProblems(live), [])
  const now = resolvePromotions({ ...live, permit: { number: "", validUntil: "" }, campaigns: [] }, Date.now())
  assert.deepEqual(now.packages.map((p) => [p.id, p.bottles, p.price]), [["single", 1, 39], ["bundle", 4, 117]])
  assert.equal(now.defaultId, "bundle")
  assert.equal(now.singlePrice, 39)
  assert.equal(now.listPrice, null, "no struck-through price without a permit")
  assert.equal(formatPrice(117 / 4), "S$29.25")
  assert.equal(formatPrice(39), "S$39")
})

test("a Singapore day starts at 16:00 UTC the day before, whatever the machine's timezone", () => {
  const tz = process.env.TZ
  for (const zone of ["UTC", "America/Los_Angeles", "Asia/Tokyo"]) {
    process.env.TZ = zone
    assert.equal(sgDayStartMs("2026-12-15"), at("2026-12-14T16:00:00Z"))
    assert.equal(sgDate(at("2026-12-14T15:59:59Z")), "2026-12-14")
    assert.equal(sgDate(at("2026-12-14T16:00:00Z")), "2026-12-15")
  }
  if (tz === undefined) delete process.env.TZ
  else process.env.TZ = tz
  assert.ok(Number.isNaN(sgDayStartMs("2027-02-31")))
  assert.ok(Number.isNaN(sgDayStartMs("15/12/2026")))
})

test("a content-only campaign runs for whole Singapore days and never changes a price", () => {
  const data = { ...base(), campaigns: [cny] }
  assert.equal(resolvePromotions(data, at("2026-12-27T15:59:59Z")).campaign, null)
  assert.equal(resolvePromotions(data, at("2026-12-27T16:00:00Z")).campaign.id, "cny-2027")
  assert.equal(resolvePromotions(data, at("2027-02-03T15:59:59Z")).campaign.id, "cny-2027")
  assert.equal(resolvePromotions(data, at("2027-02-03T16:00:00Z")).campaign, null)
  const during = resolvePromotions(data, at("2027-01-10T04:00:00Z"))
  assert.deepEqual(during.packages.map((p) => p.price), [39, 117])
})

test("price campaigns, permit-only packages and the list price wait for a permit that is in date", () => {
  const data = { ...base(), campaigns: [sale] }
  const mid = at("2027-03-03T04:00:00Z")
  const without = resolvePromotions(data, mid)
  assert.equal(without.campaign, null)
  assert.deepEqual(without.packages.map((p) => p.id), ["single", "bundle"])

  const allowed = resolvePromotions(withPermit(data), mid)
  assert.equal(allowed.campaign.id, "sale")
  assert.deepEqual(allowed.packages.map((p) => [p.id, p.price]), [["single", 39], ["pair", 72], ["bundle", 117], ["trio", 99]])
  assert.equal(allowed.listPrice, 49)

  const lapsed = { ...data, permit: { number: "SP-TEST-1", validUntil: "2027-03-02" } }
  assert.equal(permitValid(lapsed, at("2027-03-02T15:59:59Z")), true)
  assert.equal(permitValid(lapsed, at("2027-03-02T16:00:00Z")), false)
  assert.equal(resolvePromotions(lapsed, mid).campaign, null)
})

test("a link to a package that isn't on offer falls back to the default", () => {
  const snap = resolvePromotions(base(), Date.now())
  assert.equal(findPackage(snap, "pair").id, "bundle")
  assert.equal(findPackage(snap, "nonsense").id, "bundle")
  assert.equal(findPackage(snap, null).id, "bundle")
  assert.equal(findPackage(snap, "single").id, "single")
})

test("the validator refuses the edits that would cost money", () => {
  const broken = (change) => {
    const d = base()
    change(d)
    return validatePromotions(d).join(" | ")
  }
  assert.match(broken((d) => (d.evergreen.packages[2].price = 11.7)), /below the floor/)
  assert.match(broken((d) => (d.evergreen.packages[2].price = 100)), /below the floor|more than the 25% limit/)
  assert.match(broken((d) => (d.evergreen.packages[1].price = 80)), /more than the single price/)
  assert.match(broken((d) => (d.evergreen.packages[1].id = "single")), /used twice/)
  assert.match(broken((d) => (d.evergreen.packages[1].default = true)), /exactly one/)
  assert.match(broken((d) => (d.permit.number = "SP-1")), /both number and validUntil/)
  assert.match(broken((d) => d.campaigns.push({ ...cny, end: "2026-12-01" })), /ends before it starts/)
  assert.match(broken((d) => d.campaigns.push({ ...cny, start: "2026-02-30" })), /real dates/)
  assert.match(broken((d) => d.campaigns.push(cny, { ...cny, id: "other", start: "2027-02-03", end: "2027-02-10" })), /overlap/)
  assert.match(broken((d) => d.campaigns.push({ ...cny, lastOrderDate: "2027-03-01" })), /outside the campaign/)
  assert.match(broken((d) => d.campaigns.push({ ...cny, packages: sale.packages })), /can't carry packages/)
  assert.match(broken((d) => d.campaigns.push({ ...sale, packages: [{ id: "single", bottles: 1, price: 35, label: { zh: "单瓶装", en: "1 bottle" } }] })), /single-bottle price can't change/)
  assert.match(broken((d) => d.campaigns.push({ ...sale, packages: [] })), /needs at least one package/)
  assert.match(broken((d) => d.campaigns.push({ ...sale, packages: [{ id: "bundle", bottles: 4, price: 116, label: { zh: "4瓶装", en: "4 bottles" } }] })), /more than the 25% limit/)
  assert.deepEqual(validatePromotions(withPermit({ ...base(), campaigns: [cny, sale] })), [])
})

test("promotion wording refuses free, gift-with-purchase, trial, refund and effect words", () => {
  for (const [text, lang] of [
    ["买3送1", "zh"],
    ["全岛免费送货", "zh"],
    ["30天不满意，全额退款", "zh"],
    ["单瓶尝鲜", "zh"],
    ["舒缓肩颈", "zh"],
    ["Buy 3 get 1 free", "en"],
    ["30-day money-back guarantee", "en"],
    ["Try it today", "en"],
    ["Soothes stiff shoulders", "en"],
  ]) {
    assert.ok(copyProblems(text, lang).length > 0, `${text} should be refused`)
  }
  for (const [text, lang] of [
    ["4瓶装", "zh"],
    ["新年孝心礼 · 送到爸妈家", "zh"],
    ["全岛包邮", "zh"],
    ["4 bottles", "en"],
    ["Chinese New Year gifts, delivered to Mum and Dad", "en"],
  ]) {
    assert.deepEqual(copyProblems(text, lang), [], `${text} should pass`)
  }
  const bad = { ...base(), campaigns: [{ ...cny, banner: { zh: "新年买3送1", en: "Free bottle for the new year" } }] }
  assert.ok(promotionProblems(bad).length >= 2)
})
