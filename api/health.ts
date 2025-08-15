export const config = { runtime: 'edge' };
export default async function handler() {
  return new Response(JSON.stringify({ ok: true, service: 'vercel-frontend' }), { headers: { 'content-type': 'application/json' }});
}
