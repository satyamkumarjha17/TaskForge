import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    console.info(JSON.stringify({
      level: 'info',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    }));
  });
  next();
};
