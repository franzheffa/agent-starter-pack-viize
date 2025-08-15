export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || process.env.GATEWAY_URL || 'https://agent-gateway-112329442315.europe-west1.run.app';
export async function POST(req: Request) {
  const text = await req.text();
  const r = await fetch(`${GATEWAY}/agents/tts`, { method:'POST', headers:{'content-type':'text/plain; charset=utf-8'}, body: text });
  return new Response(r.body ?? (await r.blob()), { status:r.status, headers:{ 'content-type': r.headers.get('content-type') || 'audio/mpeg' } });
}
