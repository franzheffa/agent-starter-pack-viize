export const config = { runtime: 'nodejs22.x' };
export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const r = await fetch(process.env.GATEWAY_URL + '/agents/echo',
    {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:req.body?.text})});
  res.status(r.status).json(await r.json());
}
