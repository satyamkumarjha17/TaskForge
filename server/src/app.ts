import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import authRoutes from './routes/auth-routes.js';
import workspaceRoutes from './routes/workspace-routes.js';
import boardRoutes from './routes/boards-routes.js';
import taskRoutes from './routes/task-routes.js';
import { issueCsrfToken, requireCsrf } from './middleware/csrf.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { requireAuth } from './middleware/auth.js';
import { requestLogger } from './middleware/request-logger.js';
import { prisma } from './config/prisma.js';
import { asyncHandler } from './utils/async-handler.js';
import { HttpError } from './utils/http-error.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    },
  },
}));
app.use(requestLogger);
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true, methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'X-CSRF-Token'] }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use(issueCsrfToken);
app.use('/api/v1', requireCsrf);
app.get('/api/v1/health', asyncHandler(async (_req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ data: { status: 'ok', database: 'connected' } }); }
  catch { throw new HttpError(503, 'SERVICE_UNAVAILABLE', 'The database is unavailable.'); }
}));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workspaces', requireAuth, workspaceRoutes);
app.use('/api/v1/boards', requireAuth, boardRoutes);
app.use('/api/v1/tasks', requireAuth, taskRoutes);
app.use(notFound);
app.use(errorHandler);
