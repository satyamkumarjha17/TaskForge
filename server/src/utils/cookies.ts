import type { CookieOptions } from 'express';
import { env } from '../config/env.js';

export const authCookieName = 'taskforge_session';
export const csrfCookieName = 'taskforge_csrf';
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE === 'true',
  sameSite: env.COOKIE_SAME_SITE,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
};
export const csrfCookieOptions: CookieOptions = {
  httpOnly: false,
  secure: env.COOKIE_SECURE === 'true',
  sameSite: env.COOKIE_SAME_SITE,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
};
