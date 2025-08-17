// ESM + TypeScript (Node 22 a fetch global)
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GATEWAY_URL = process.env.GATEWAY_URL!;
const AUTH_SECRET  = process.env.AUTH_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // POST { text, image? }  |  GET ?q=...
    const isPost = req.method === 'POST';
    const text   = isPost ? req.body?.text : (req.query?.q as string | undefined);
    const image  = isPost ? req.body?.image : undefined;

    const gw = await fetch(`${GATEWAY_URL}/agents/gemini`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-auth-secret': AUTH_SECRET,
      },
      body: JSON.stringify({ text, image }),
    });

    // Proxy status + body tel quel
    const body = await gw.text();
    res.status(gw.status);
    const ct = gw.headers.get('content-type') ?? 'application/json; charset=utf-8';
    res.setHeader('content-type', ct);
    res.send(body);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err?.message ?? 'unknown' });
  }
}
