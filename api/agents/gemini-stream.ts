export const config = { runtime: 'nodejs22.x' };
export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const r = await fetch(process.env.GATEWAY_URL + '/agents/gemini/stream',
    {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(req.body||{})});
  res.status(r.status);
  for (const [k,v] of r.headers) res.setHeader(k,v);
  res.setHeader('Cache-Control','no-store'); res.setHeader('X-Accel-Buffering','no');
  const reader = r.body!.getReader();
  async function pump(){ const {value,done}=await reader.read(); if(done){ res.end(); return; }
    res.write(Buffer.from(value)); pump(); }
  pump();
}
