import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { createIntegration, findIntegrationById, listIntegrations, removeIntegrationById, requestExternalApi } from '../store.js';

const integrationsRouter = Router();

const integrationSchema = z.object({
  name: z.string().min(2),
  category: z.enum(['social', 'weather', 'news', 'search', 'custom']),
  baseUrl: z.string().url(),
  authToken: z.string().optional(),
  enabled: z.boolean().default(true),
});

integrationsRouter.get('/', requireAuth, (_req, res) => {
  res.json(listIntegrations());
});

integrationsRouter.post('/', requireAuth, (req, res) => {
  try {
    const body = integrationSchema.parse(req.body);
    const item = createIntegration(body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to add integration.' });
  }
});

integrationsRouter.delete('/:id', requireAuth, (req, res) => {
  const success = removeIntegrationById(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Integration not found.' });
    return;
  }

  res.json({ success: true, id: req.params.id });
});

integrationsRouter.post('/:id/test', requireAuth, async (req, res) => {
  const integration = findIntegrationById(req.params.id);

  if (!integration) {
    res.status(404).json({ error: 'Integration not found.' });
    return;
  }

  try {
    const result = await requestExternalApi({
      method: 'GET',
      baseUrl: integration.baseUrl,
      headers: integration.authToken ? { Authorization: `Bearer ${integration.authToken}` } : {},
    });

    res.json({
      integrationId: integration.id,
      service: integration.name,
      ok: result.ok,
      status: result.status,
      response: result.data,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Integration test failed.' });
  }
});

export default integrationsRouter;
