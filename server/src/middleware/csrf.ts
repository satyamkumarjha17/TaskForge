import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { csrfCookieName, csrfCookieOptions } from '../utils/cookies.js';
import { HttpError } from '../utils/http-error.js';
const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
export const issueCsrfToken: RequestHandler = (req, res, next) => { if (!req.cookies?.[csrfCookieName]) { const token = randomBytes(32).toString('hex'); res.locals.csrfToken = token; res.cookie(csrfCookieName, token, csrfCookieOptions); } next(); };
export const requireCsrf: RequestHandler = (req, _res, next) => {
  if (safeMethods.has(req.method)) { next(); return; }
  if (req.get('origin') !== env.CLIENT_ORIGIN) { next(new HttpError(403, 'ORIGIN_REJECTED', 'Request origin is not allowed.')); return; }
  const cookie = req.cookies?.[csrfCookieName] as string | undefined; const header = req.get('x-csrf-token');
  if (!cookie || !header || cookie.length !== header.length || !timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) { next(new HttpError(403, 'CSRF_INVALID', 'Your session security token is missing or invalid. Refresh and try again.')); return; }
  next();
};
