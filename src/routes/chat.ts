import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { createMessage, listMessagesForUser } from '../store.js';

const chatRouter = Router();

const messageSchema = z.object({
  content: z.string().min(1).max(4000),
  role: z.enum(['user', 'assistant']).default('user'),
});

chatRouter.get('/messages', requireAuth, (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const messages = listMessagesForUser(user.id);
  res.json(messages);
});

chatRouter.post('/messages', requireAuth, (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    const body = messageSchema.parse(req.body);
    const message = createMessage({
      userId: user.id,
      role: body.role,
      content: body.content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to create message.' });
  }
});

export default chatRouter;
