import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema, taskCreateSchema, taskUpdateSchema, workspaceSchema } from '../src/validators/schemas.js';

describe('request validation', () => {
  it('normalizes registration email and trims the name', () => {
    expect(registerSchema.parse({ name: '  Satyam  ', email: 'SATYAM@example.com', password: 'safe-password' })).toMatchObject({ name: 'Satyam', email: 'satyam@example.com' });
  });
  it('rejects passwords longer than bcrypt UTF-8 byte limit', () => {
    expect(registerSchema.safeParse({ name: 'Student', email: 's@example.com', password: 'क'.repeat(25) }).success).toBe(false);
  });
  it('rejects malformed login emails', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'password' }).success).toBe(false);
  });
  it('applies task defaults and accepts a date-only due date', () => {
    expect(taskCreateSchema.parse({ title: '  Finish report ', dueDate: '2026-11-20' })).toMatchObject({ title: 'Finish report', priority: 'MEDIUM', status: 'TODO', dueDate: '2026-11-20' });
  });
  it('rejects invalid calendar dates', () => {
    expect(taskCreateSchema.safeParse({ title: 'Task', dueDate: '2026-02-30' }).success).toBe(false);
  });
  it('allows partial task updates but rejects empty titles', () => {
    expect(taskUpdateSchema.safeParse({ priority: 'HIGH' }).success).toBe(true);
    expect(taskUpdateSchema.safeParse({ title: '' }).success).toBe(false);
  });
  it('trims workspace fields and enforces name length', () => {
    expect(workspaceSchema.parse({ name: '  Semester  ', description: '' }).name).toBe('Semester');
    expect(workspaceSchema.safeParse({ name: ' '.repeat(81) }).success).toBe(false);
  });
});
