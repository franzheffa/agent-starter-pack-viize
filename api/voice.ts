export const config = { runtime: 'nodejs22.x' };
export default async function handler(req:any,res:any){
  const text = (req.query.text||'').toString();
  const url = process.env.GATEWAY_URL + '/voice?text='+encodeURIComponent(text);
  const r = await fetch(url); res.status(r.status);
  r.headers.forEach((v,k)=>res.setHeader(k,v)); res.setHeader('cache-control','no-store');
  res.send(Buffer.from(await r.arrayBuffer()));
}
