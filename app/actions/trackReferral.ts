"use server"

// In a real application, you would save this data to a database (e.g., Supabase, Neon).
// For this demonstration, we'll just log it to the server console.
export async function trackReferralClick(refId: string | null, referredFrom: string) {
  if (!refId) {
    return { success: false, message: "No referral ID provided." }
  }

  const timestamp = new Date().toISOString()
  console.log(`[Referral Tracking] Timestamp: ${timestamp}, Referral ID: ${refId}, Referred From: ${referredFrom}`)

  // Here you would typically add database logic:
  // await db.insert(referrals).values({ refId, referredFrom, timestamp });

  return { success: true, message: `Referral ${refId} tracked successfully.` }
}
