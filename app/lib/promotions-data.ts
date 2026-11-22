// content/promotions.json, loaded once for the site. A bad file must never
// reach customers: this throws while the module loads, which fails the build,
// so Vercel keeps serving the previous deployment.
import raw from "@/content/promotions.json"
import { validatePromotions, type PromotionsData } from "./promotions"

export const PROMOTIONS = raw as unknown as PromotionsData

const problems = validatePromotions(PROMOTIONS)
if (problems.length) {
  throw new Error(`content/promotions.json can't ship:\n- ${problems.join("\n- ")}`)
}
