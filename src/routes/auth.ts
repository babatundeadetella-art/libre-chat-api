import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config.js';
import { createUser, findUserByEmail, listUsers, seedDefaultData } from '../store.js';
import { requireAuth } from '../middleware/auth.js';

const authRouter = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post('/signup', async (req, res) => {
  try {
    const body = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = createUser({
      name: body.name,
      email: body.email,
      passwordHash,
    });

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to create user.' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = findUserByEmail(body.email);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const isValid = await bcrypt.compare(body.password, user.passwordHash);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to sign in.' });
  }
});

authRouter.get('/me', requireAuth, (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404).json({ error: 'No user record found.' });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
});

authRouter.get('/users', requireAuth, (_req, res) => {
  seedDefaultData();
  res.json(listUsers());
});

export default authRouter;
