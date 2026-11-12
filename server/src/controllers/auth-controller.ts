import type { Request, Response } from 'express';
import { authenticateUser, getCurrentUser, registerUser } from '../services/auth-service.js';
import { authCookieName, cookieOptions, csrfCookieName } from '../utils/cookies.js';
import { asyncHandler } from '../utils/async-handler.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body as { name: string; email: string; password: string });
  res.cookie(authCookieName, result.token, cookieOptions).status(201).json({ data: { user: result.user } });
});
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authenticateUser(req.body as { email: string; password: string });
  res.cookie(authCookieName, result.token, cookieOptions).json({ data: { user: result.user } });
});
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(authCookieName, { ...cookieOptions, maxAge: undefined }).json({ data: { loggedOut: true } });
});
export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ data: { user: await getCurrentUser(req.user!.userId) } });
});

export const csrf = asyncHandler(async (req: Request, res: Response) => { res.json({ data: { token: res.locals.csrfToken ?? req.cookies?.[csrfCookieName] ?? null } }); });
