import { runtime, dynamic, preferredRegion, gw, passThrough, methodGuard } from '../_utils';
export { runtime, dynamic, preferredRegion };

export default async function handler(req: Request): Promise<Response> {
  const guard = await methodGuard(req, ['POST']); if (guard) return guard;
  try {
    const body = await req.text();
    const up = await fetch(`${gw()}/agents/echo`, {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: body || '{}',
    });
    return passThrough(up);
  } catch (e:any) {
    return new Response(`Erreur proxy echo: ${e?.message||e}`, { status: 502 });
  }
}
