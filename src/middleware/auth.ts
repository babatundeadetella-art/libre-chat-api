import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';
import { findUserById } from '../store.js';
import type { AuthenticatedRequest } from '../types.js';

export function requireAuth(req: Request & AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid bearer token.' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = findUserById(payload.userId);

    if (!user) {
      res.status(401).json({ error: 'User not found for token.' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token is invalid or expired.' });
  }
}
