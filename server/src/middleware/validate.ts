import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../utils/http-error.js';
export const validateBody = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) { next(new HttpError(422, 'VALIDATION_ERROR', 'Please check the submitted information.', result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })))); return; }
  req.body = result.data; next();
};
export const validateParams = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) { next(new HttpError(400, 'INVALID_RESOURCE_ID', 'The requested resource is invalid.')); return; }
  req.params = result.data; next();
};
