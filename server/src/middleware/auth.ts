import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { authCookieName } from '../utils/cookies.js';
import { HttpError } from '../utils/http-error.js';
export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[authCookieName] as string | undefined;
  if (!token) { next(new HttpError(401, 'UNAUTHENTICATED', 'Please sign in to continue.')); return; }
  try { const payload = jwt.verify(token, env.JWT_SECRET); if (typeof payload === 'string' || typeof payload.userId !== 'string') throw new Error('Invalid token'); req.user = payload as jwt.JwtPayload & { userId: string }; next(); }
  catch { next(new HttpError(401, 'UNAUTHENTICATED', 'Your session has expired. Please sign in again.')); }
};
