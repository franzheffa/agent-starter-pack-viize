export const config = { runtime: 'nodejs22.x' };
export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const { prompt, imageUrl, model } = req.body||{};
  const url = process.env.GATEWAY_URL + '/agents/gemini';
  const r = await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt,imageUrl,model})});
  res.status(r.status).json(await r.json());
}
