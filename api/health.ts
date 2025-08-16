import { runtime, dynamic, preferredRegion, gw, passThrough } from './_utils';
export { runtime, dynamic, preferredRegion };

export default async function handler(_req: Request): Promise<Response> {
  try {
    const up = await fetch(`${gw()}/health`, { cache: 'no-store' });
    return passThrough(up);
  } catch (e:any) {
    return new Response(`Gateway injoignable: ${e?.message||e}`, { status: 502 });
  }
}
