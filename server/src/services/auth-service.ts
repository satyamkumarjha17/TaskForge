import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

const dummyHash = bcrypt.hashSync('invalid-login-comparison', 12);
const publicUser = { id: true, name: true, email: true, createdAt: true } as const;
export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
  if (existing) throw new HttpError(409, 'EMAIL_IN_USE', 'An account with this email already exists.');
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash }, select: publicUser });
  return { user, token: createToken(user.id) };
}
export async function authenticateUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const valid = user ? await bcrypt.compare(input.password, user.passwordHash) : await bcrypt.compare(input.password, dummyHash);
  if (!user || !valid) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  return { user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }, token: createToken(user.id) };
}
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUser });
  if (!user) throw new HttpError(401, 'UNAUTHENTICATED', 'Your session is no longer valid.');
  return user;
}
function createToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}
