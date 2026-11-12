import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
}).superRefine((values, context) => {
  if (values.NODE_ENV === 'production' && values.COOKIE_SECURE !== 'true') {
    context.addIssue({ code: 'custom', path: ['COOKIE_SECURE'], message: 'Secure cookies are required in production.' });
  }
  if (values.COOKIE_SAME_SITE === 'none' && values.COOKIE_SECURE !== 'true') {
    context.addIssue({ code: 'custom', path: ['COOKIE_SAME_SITE'], message: 'SameSite=None requires Secure cookies.' });
  }
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid server environment: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
}
export const env = parsed.data;
