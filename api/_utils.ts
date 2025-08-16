export function gatewayUrl() {
  return (process.env.GATEWAY_URL || 'https://agent-gateway-112329442315.europe-west1.run.app').replace(/\/+$/,'');
}
export async function readJson(req: any): Promise<any> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try { return JSON.parse(raw) } catch { return { raw } }
}
