export const config = { runtime: "nodejs" }
import { gatewayUrl } from "./_utils"
import { pipeline } from "node:stream"
import { promisify } from "node:util"
const pump = promisify(pipeline)

export default async function handler(req: any, res: any) {
  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const text = url.searchParams.get('text') || ''
    const upstream = await fetch(`${gatewayUrl()}/voice?text=${encodeURIComponent(text)}`)
    res.setHeader('Cache-Control','no-store')
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg')
    // @ts-ignore
    await pump(upstream.body as any, res)
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'tts failed' })
  }
}
