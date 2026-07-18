// Generates a downloadable .ics calendar file client-side, entirely without
// a backend or database. HerbalBath's product is marketed as lasting 3-4
// months — this lets a customer add their own reorder reminder to their
// phone calendar right when they buy, which is the highest-intent moment to
// capture a future repeat purchase.

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

export function buildReorderReminderICS(monthsFromNow = 3): string {
  const now = new Date()
  const reminderDate = new Date(now)
  reminderDate.setMonth(reminderDate.getMonth() + monthsFromNow)
  // All-day-ish reminder at 10am local time on the reminder date.
  reminderDate.setHours(10, 0, 0, 0)

  const endDate = new Date(reminderDate)
  endDate.setMinutes(endDate.getMinutes() + 30)

  const uid = `herbalbath-reorder-${now.getTime()}@herbalbathsg.com`

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HerbalBath SG//Reorder Reminder//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(reminderDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    "SUMMARY:该补货了！HerbalBath 没药喷雾 Reorder Reminder",
    "DESCRIPTION:您的HerbalBath没药喷雾差不多该用完了。WhatsApp 8426 1225 或访问 https://herbalbathsg.com 重新订购。\\n\\nYour HerbalBath Myrrh Spray should be running low. WhatsApp 8426 1225 or visit https://herbalbathsg.com to reorder.",
    "LOCATION:https://herbalbathsg.com",
    "BEGIN:VALARM",
    "TRIGGER:-P0D",
    "ACTION:DISPLAY",
    "DESCRIPTION:HerbalBath 补货提醒 Reorder Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

export function downloadReorderReminderICS(monthsFromNow = 3) {
  const ics = buildReorderReminderICS(monthsFromNow)
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "herbalbath-reorder-reminder.ics"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
