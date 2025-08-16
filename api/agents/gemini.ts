export const config = { runtime: "nodejs" }
import { readJson, gatewayUrl } from "../_utils"
import { pipeline } from "node:stream"
import { promisify } from "node:util"
const pump = promisify(pipeline)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })
  try {
    const body = await readJson(req)
    const upstream = await fetch(`${gatewayUrl()}/agents/gemini`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    const ctype = upstream.headers.get('content-type') || ''
    res.setHeader('Cache-Control','no-store')

    // Si le gateway renvoie du flux (texte ou audio), on passe-à-travers
    if (upstream.body && (ctype.includes('stream') || ctype.startsWith('text/') || ctype.startsWith('audio/'))) {
      res.setHeader('Content-Type', ctype || 'text/plain; charset=utf-8')
      // @ts-ignore
      await pump(upstream.body as any, res)
      return
    }

    // Sinon, on renvoie le payload tel quel (JSON)
    const buf = Buffer.from(await upstream.arrayBuffer())
    res.status(upstream.status).send(buf)
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'gemini failed' })
  }
}
