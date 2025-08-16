import { runtime, dynamic, preferredRegion, gw, passThrough, methodGuard } from './_utils';
export { runtime, dynamic, preferredRegion };

export default async function handler(req: Request): Promise<Response> {
  const guard = await methodGuard(req, ['GET']); if (guard) return guard;
  try {
    const up = await fetch(`${gw()}/voice${new URL(req.url).search}`, { method: 'GET' });
    return passThrough(up);
  } catch (e:any) {
    return new Response(`Erreur proxy voix: ${e?.message||e}`, { status: 502 });
  }
}
