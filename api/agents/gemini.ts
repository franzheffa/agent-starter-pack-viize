export const config = { runtime: 'edge' };
import { gw } from '../_gw';
export default async function handler(req: Request){
  const body = await req.json().catch(()=>({}));
  const { json, status } = await gw('/agents/gemini', body);
  return new Response(JSON.stringify(json), { status, headers: { 'content-type': 'application/json' }});
}
