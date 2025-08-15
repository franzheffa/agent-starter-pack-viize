module.exports = async (_req, res) => {
  res.status(200).json({ ok: true, service: 'vercel-frontend' });
};
