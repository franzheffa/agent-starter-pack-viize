import { gw, passThrough } from './_utils.js';

// Si vous avez besoin de ces exports pour Vercel (edge, etc.), gardez cette ligne
export { runtime, dynamic, preferredRegion } from './_utils.js';

export default async function handler(req: Request): Promise<Response> {
  // Cette fonction sert de proxy vers l'agent "echo"
  const url = `${gw()}/agents/echo`;

  try {
    // On transfère la requête originale (méthode, headers, corps)
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
      redirect: 'follow'
    });

    // On retourne la réponse de la passerelle
    return passThrough(response);

  } catch (e: any) {
    return new Response(`Gateway fetch failed: ${e?.message ?? String(e)}`, { status: 502 });
  }
}
