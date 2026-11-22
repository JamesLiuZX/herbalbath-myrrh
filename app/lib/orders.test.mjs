// Run with `pnpm test`. Orders from /pay: the WhatsApp message must not change
// for anyone who skips the optional fields, and what gets stored is checked
// on the server, not trusted from the browser.
import { test } from "node:test"
import assert from "node:assert/strict"
import { bearerOk, buildCodMessage, buildPaidMessage, cleanDetails, normaliseOrder, REFERENCE, sgMobile } from "./orders.ts"
import { newOrderReference } from "./paynow.ts"

const line = { reference: "HB1122K7Q2", packageLabel: "4瓶装", qty: 1, amountText: "S$117.00" }
const packages = [
  { id: "single", bottles: 1, price: 39 },
  { id: "bundle", bottles: 4, price: 117 },
]

test("with nothing filled in, the paid message is the one the page has always sent", () => {
  assert.equal(buildPaidMessage("zh", line), "你好！我刚用 PayNow 付款了 S$117.00\n套餐：4瓶装 × 1\n参考号：HB1122K7Q2\n\n姓名：\n送货地址：\n联系电话：")
  assert.equal(
    buildPaidMessage("en", { ...line, packageLabel: "4 bottles" }),
    "Hi! I've just paid S$117.00 by PayNow\nPackage: 4 bottles × 1\nReference: HB1122K7Q2\n\nName:\nDelivery address:\nPhone:",
  )
  assert.equal(buildPaidMessage("zh", line, { name: "", phone: "  ", address: "" }), buildPaidMessage("zh", line))
})

test("filled-in details, a gift note and the campaign are woven into the message", () => {
  const msg = buildPaidMessage("zh", { ...line, campaignId: "cny-2027" }, { name: "陈美玲", phone: "9123 4567", address: "Blk 123 Bedok North Ave 1 #05-67", giftNote: "妈妈新年快乐" })
  assert.match(msg, /姓名：陈美玲\n送货地址：Blk 123 Bedok North Ave 1 #05-67\n联系电话：9123 4567\n贺卡留言：妈妈新年快乐\n活动：cny-2027$/)
  const en = buildPaidMessage("en", { ...line, packageLabel: "4 bottles" }, { name: "Mei Ling", address: "Blk 123" })
  assert.match(en, /Name: Mei Ling\nDelivery address: Blk 123\nPhone:$/)
  assert.match(buildCodMessage("zh", line, { name: "陈美玲" }), /^你好！我想订购 HerbalBath 没药草本能量油，货到付款\n套餐：4瓶装 × 1（S\$117\.00）\n\n姓名：陈美玲/)
})

test("typed details are cleaned and capped before they go anywhere", () => {
  const d = cleanDetails({ name: "  A\n\tB  ", phone: "x".repeat(50), address: "y".repeat(500), giftNote: 42 })
  assert.equal(d.name, "A B")
  assert.equal(d.phone.length, 20)
  assert.equal(d.address.length, 200)
  assert.equal(d.giftNote, "")
  assert.deepEqual(cleanDetails(null), { name: "", phone: "", address: "", giftNote: "" })
})

test("an order is recorded with an amount worked out from the price list", () => {
  const ok = normaliseOrder({ reference: "HB1122K7Q2", packageId: "bundle", qty: 2, lang: "en", captainCode: "ab3cd" }, packages, "cny-2027", new Date("2026-11-22T04:00:00Z"))
  assert.equal(ok.ok, true)
  assert.deepEqual(ok.order, {
    reference: "HB1122K7Q2",
    status: "self_reported",
    packageId: "bundle",
    bottles: 4,
    qty: 2,
    amount: 234,
    campaignId: "cny-2027",
    captainCode: "AB3CD",
    lang: "en",
    consent: false,
    createdAt: "2026-11-22T04:00:00.000Z",
  })
  assert.equal(ok.contact, null)
  assert.equal(REFERENCE.test(newOrderReference()), true, "the page's own references are accepted")
})

test("bad orders are refused, and consent needs a real Singapore mobile", () => {
  const bad = (change) => normaliseOrder({ reference: "HB1122K7Q2", packageId: "bundle", qty: 1, lang: "zh", ...change }, packages, null)
  assert.equal(bad({ reference: "HB1122K7Q" }).ok, false)
  assert.equal(bad({ reference: "XX1122K7Q2" }).ok, false)
  assert.equal(bad({ reference: "HB1322K7Q2" }).ok, false)
  assert.equal(bad({ packageId: "pair" }).ok, false)
  assert.equal(bad({ qty: 0 }).ok, false)
  assert.equal(bad({ qty: 11 }).ok, false)
  assert.equal(bad({ qty: 1.5 }).ok, false)
  assert.equal(normaliseOrder(null, packages, null).ok, false)

  assert.equal(bad({ consent: true, phone: "12345" }).order.consent, false)
  const consented = bad({ consent: true, phone: "9123 4567", name: " Mei  Ling " })
  assert.equal(consented.order.consent, true)
  assert.deepEqual(consented.contact, { name: "Mei Ling", phone: "6591234567" })
  assert.equal(sgMobile("+65 8123 4567"), "6581234567")
  assert.equal(sgMobile("6123 4567"), null)
  assert.equal(bad({ captainCode: "<script>" }).order.captainCode, "")
})

test("the bearer check refuses an unset secret, including the literal 'Bearer undefined'", () => {
  assert.equal(bearerOk("Bearer s3cret", "s3cret"), true)
  assert.equal(bearerOk("Bearer s3cret ", "s3cret"), false)
  assert.equal(bearerOk("Bearer wrong", "s3cret"), false)
  assert.equal(bearerOk("s3cret", "s3cret"), false)
  assert.equal(bearerOk(null, "s3cret"), false)
  assert.equal(bearerOk("Bearer undefined", undefined), false)
  assert.equal(bearerOk("Bearer ", ""), false)
  assert.equal(bearerOk("Bearer undefined", "undefined"), true, "only a secret that is really set can match")
})
