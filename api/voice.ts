export const config = { runtime: 'nodejs' };
export default async function handler(req:any,res:any){
  const text = (req.query.text||'').toString();
  const url = (process.env.GATEWAY_URL||'https://agent-gateway-112329442315.europe-west1.run.app') + '/voice?text='+encodeURIComponent(text);
  const r = await fetch(url);
  res.status(r.status);
  r.headers.forEach((v,k)=> res.setHeader(k,v));
  res.setHeader('cache-control','no-store');
  res.send(Buffer.from(await r.arrayBuffer()));
}
