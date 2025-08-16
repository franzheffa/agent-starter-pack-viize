export const config = { runtime: "nodejs" }
import { readJson, gatewayUrl } from "../_utils"
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })
  try {
    const body = await readJson(req)
    const upstream = await fetch(`${gatewayUrl()}/agents/echo`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })
    res.status(upstream.status)
    upstream.headers.forEach((v,k)=>res.setHeader(k,v))
    const buf = Buffer.from(await upstream.arrayBuffer())
    res.send(buf)
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'echo failed' })
  }
}
