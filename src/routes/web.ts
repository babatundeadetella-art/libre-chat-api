import { Router } from 'express';
import { z } from 'zod';
import { fetchWebPage, requestExternalApi } from '../lib/httpClient.js';
import { requireAuth } from '../middleware/auth.js';

const webRouter = Router();

const fetchUrlSchema = z.object({
  url: z.string().url(),
});

webRouter.get('/fetch', requireAuth, async (req, res) => {
  const { url } = fetchUrlSchema.parse({ url: req.query.url });

  try {
    const result = await fetchWebPage(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to fetch URL.' });
  }
});

webRouter.get('/search', requireAuth, async (req, res) => {
  const query = String(req.query.q ?? '').trim();

  if (!query) {
    res.status(400).json({ error: 'Missing `q` query parameter.' });
    return;
  }

  try {
    const result = await requestExternalApi({
      method: 'GET',
      baseUrl: `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Search failed.' });
  }
});

export default webRouter;
