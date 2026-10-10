import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { seedDefaultData } from './store.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import integrationsRouter from './routes/integrations.js';
import webRouter from './routes/web.js';
import aiRouter from './routes/ai.js';

const app = express();

seedDefaultData();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({
    app: config.appName,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/integrations', integrationsRouter);
app.use('/api/v1/web', webRouter);
app.use('/api/v1/ai', aiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, () => {
  console.log(`${config.appName} is running on http://localhost:${config.port}`);
});
