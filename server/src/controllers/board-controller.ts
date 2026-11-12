import type { Request, Response } from 'express';
import * as boards from '../services/board-service.js';
import { asyncHandler } from '../utils/async-handler.js';
export const list = asyncHandler(async (req: Request, res: Response) => res.json({ data: await boards.listBoards(req.user!.userId, req.params.workspaceId!) }));
export const create = asyncHandler(async (req: Request, res: Response) => res.status(201).json({ data: await boards.createBoard(req.user!.userId, req.params.workspaceId!, req.body) }));
export const get = asyncHandler(async (req: Request, res: Response) => res.json({ data: await boards.getBoard(req.user!.userId, req.params.id!) }));
export const update = asyncHandler(async (req: Request, res: Response) => res.json({ data: await boards.updateBoard(req.user!.userId, req.params.id!, req.body) }));
export const remove = asyncHandler(async (req: Request, res: Response) => { await boards.deleteBoard(req.user!.userId, req.params.id!); res.status(204).end(); });
export const recent = asyncHandler(async (req: Request, res: Response) => res.json({ data: await boards.recentBoards(req.user!.userId) }));
