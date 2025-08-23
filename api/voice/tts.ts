import { gw, passThrough, methodGuard } from '../_utils.js';
export { runtime, dynamic, preferredRegion } from '../_utils.js';

export default async function handler(req: Request): Promise<Response> {
  // 1. On n'autorise que la méthode POST, car on doit recevoir du texte à synthétiser.
  const guard = await methodGuard(req, ['POST']);
  if (guard) return guard;

  try {
    // 2. On envoie la requête à la passerelle en utilisant POST et en transférant le corps de la requête.
    const response = await fetch(`${gw()}/voice/tts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' }, // On s'assure que le header est correct.
      body: req.body, // On transfère le corps (le JSON avec le texte).
    });

    return passThrough(response);

  } catch (e: any) {
    return new Response(`Erreur proxy TTS: ${e?.message || e}`, { status: 502 });
  }
}
