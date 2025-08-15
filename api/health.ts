export const config = { runtime: 'nodejs22.x' };
export default async function handler(_req:any,res:any){
  try{
    const r = await fetch(process.env.GATEWAY_URL + '/health',{cache:'no-store'});
    res.status(200).json({ ok:true, from:'vercel', gateway: await r.json() });
  }catch(e:any){ res.status(500).json({ ok:false, error:String(e?.message||e) }); }
}
