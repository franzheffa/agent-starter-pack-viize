export const config = { runtime: 'nodejs' };
export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const { text } = req.body||{};
  const url = (process.env.GATEWAY_URL||'https://agent-gateway-112329442315.europe-west1.run.app') + '/agents/echo';
  const r = await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})});
  const j = await r.json(); res.status(r.status).json(j);
}
