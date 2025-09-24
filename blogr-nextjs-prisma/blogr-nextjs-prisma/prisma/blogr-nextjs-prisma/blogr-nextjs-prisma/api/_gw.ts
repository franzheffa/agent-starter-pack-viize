const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
export async function gw(path: string, body: any){
  const r = await fetch(`${BASE}${path}`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body || {}) });
  const text = await r.text();
  try { return { status: r.status, json: JSON.parse(text) } } catch { return { status: r.status, json: { raw: text } } }
}
