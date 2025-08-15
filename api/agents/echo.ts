export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || process.env.GATEWAY_URL || 'https://agent-gateway-112329442315.europe-west1.run.app';
export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({} as any));
  const r = await fetch(`${GATEWAY}/agents/echo`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ text: body.text ?? '' }) });
  return new Response(await r.text(), { status:r.status, headers:{'content-type': r.headers.get('content-type') || 'application/json'} });
}
