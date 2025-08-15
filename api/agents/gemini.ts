export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || process.env.GATEWAY_URL || 'https://agent-gateway-112329442315.europe-west1.run.app';
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const stream = searchParams.get('stream') === '1';
  const payload = await req.json();
  const r = await fetch(`${GATEWAY}/agents/gemini?stream=${stream?1:0}`, {
    method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)
  });
  // Retourne le body en streaming quand dispo
  if (r.body) return new Response(r.body, { status:r.status, headers:{ 'content-type': r.headers.get('content-type') || (stream?'text/plain':'application/json') } });
  return new Response(await r.text(), { status:r.status, headers:{'content-type':'application/json'} });
}
