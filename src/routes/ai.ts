import { Router } from 'express';
import { z } from 'zod';
import { fetchWebPage } from '../lib/httpClient.js';
import { requireAuth } from '../middleware/auth.js';

const aiRouter = Router();

const planSchema = z.object({
  task: z.string().min(3),
  goal: z.string().optional(),
  url: z.string().url().optional(),
  provider: z.string().optional(),
});

aiRouter.post('/orchestrate', requireAuth, async (req, res) => {
  try {
    const body = planSchema.parse(req.body);
    const plan = [
      { step: 'understand', description: `Interpret the objective: ${body.task}` },
      { step: 'gather-data', description: body.url ? `Fetch information from ${body.url}` : 'Search available sources for relevant context' },
      { step: 'act', description: `Use provider ${body.provider ?? 'default'} to perform the requested action` },
      { step: 'respond', description: 'Return the result and summarize actions taken' },
    ];

    let pageContext: unknown = null;
    if (body.url) {
      pageContext = await fetchWebPage(body.url);
    }

    res.json({
      ok: true,
      task: body.task,
      goal: body.goal ?? 'General internet automation',
      provider: body.provider ?? 'default',
      plan,
      context: pageContext,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to orchestrate task.' });
  }
});

export default aiRouter;
