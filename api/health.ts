export const config = { runtime: 'nodejs22.x' };
export default async function handler(_req:any,res:any){
  try{
    const url = process.env.GATEWAY_URL!;
    const r = await fetch(url+'/health',{cache:'no-store'}); const j = await r.json();
    res.status(200).json({ ok: true, ...j });
  }catch(e:any){ res.status(500).json({ ok:false, error: e?.message||String(e) }); }
}
