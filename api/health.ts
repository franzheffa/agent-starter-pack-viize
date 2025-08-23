import { runtime, dynamic, preferredRegion } from "./_utils.js";
export { runtime, dynamic, preferredRegion };

export default async function handler(req: Request): Promise<Response> {
  const responseData = {
    ok: true,
    region: req.headers.get('x-vercel-id') ?? undefined
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' } // La correction est ici
  });
}
