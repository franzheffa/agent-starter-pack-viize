import { gw, passThrough } from './_utils.js';
// On importe les constantes de configuration pour Vercel
export { runtime, dynamic, preferredRegion } from './_utils.js';

// On utilise les types Request et Response natifs, plus modernes
export default async function handler(req: Request): Promise<Response> {
  // Cette fonction sert de proxy vers l'agent "echo" sur la passerelle
  const url = `${gw()}/agents/echo`;

  try {
    // On transfère la requête originale (méthode, headers, corps)
    // C'est une approche plus robuste pour un proxy
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
      redirect: 'follow',
    });

    // On retourne la réponse de la passerelle telle quelle
    return passThrough(response);

  } catch (e: any) {
    console.error("Gateway fetch error:", e);
    return new Response(`Gateway fetch failed: ${e?.message ?? String(e)}`, { status: 502 });
  }
}
