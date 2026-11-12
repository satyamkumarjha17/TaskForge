import type { Request, Response } from 'express';
import * as tasks from '../services/task-service.js';
import { asyncHandler } from '../utils/async-handler.js';
export const list = asyncHandler(async (req: Request, res: Response) => res.json({ data: await tasks.listTasks(req.user!.userId, req.params.boardId!) }));
export const create = asyncHandler(async (req: Request, res: Response) => res.status(201).json({ data: await tasks.createTask(req.user!.userId, req.params.boardId!, req.body) }));
export const get = asyncHandler(async (req: Request, res: Response) => res.json({ data: await tasks.getTask(req.user!.userId, req.params.id!) }));
export const update = asyncHandler(async (req: Request, res: Response) => res.json({ data: await tasks.updateTask(req.user!.userId, req.params.id!, req.body) }));
export const remove = asyncHandler(async (req: Request, res: Response) => { await tasks.deleteTask(req.user!.userId, req.params.id!); res.status(204).end(); });
