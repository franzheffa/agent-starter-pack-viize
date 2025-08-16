export const config = { runtime: "nodejs" }
import { gatewayUrl } from "./_utils"
export default async function handler(req: any, res: any) {
  try {
    const r = await fetch(`${gatewayUrl()}/health`)
    const json = await r.json().catch(()=>({}))
    res.setHeader('Cache-Control','no-store')
    res.status(200).json({ ok: true, gateway: json })
  } catch (e:any) {
    res.status(200).json({ ok: false, error: e?.message })
  }
}
