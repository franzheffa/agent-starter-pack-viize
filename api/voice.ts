export const config = { runtime: 'nodejs' };
export default async function handler(req:any,res:any){
  const text=(req.query.text||'').toString();
  const r = await fetch(process.env.GATEWAY_URL + '/voice?text='+encodeURIComponent(text));
  res.status(r.status); r.headers.forEach((v,k)=>res.setHeader(k,v));
  res.setHeader('cache-control','no-store'); res.send(Buffer.from(await r.arrayBuffer()));
}
