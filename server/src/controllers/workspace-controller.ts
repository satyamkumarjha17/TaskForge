import type { Request, Response } from 'express';
import * as workspaces from '../services/workspace-service.js';
import { asyncHandler } from '../utils/async-handler.js';
export const list = asyncHandler(async (req: Request, res: Response) => res.json({ data: await workspaces.listWorkspaces(req.user!.userId) }));
export const create = asyncHandler(async (req: Request, res: Response) => res.status(201).json({ data: await workspaces.createWorkspace(req.user!.userId, req.body) }));
export const get = asyncHandler(async (req: Request, res: Response) => res.json({ data: await workspaces.getWorkspace(req.user!.userId, req.params.id!) }));
export const update = asyncHandler(async (req: Request, res: Response) => res.json({ data: await workspaces.updateWorkspace(req.user!.userId, req.params.id!, req.body) }));
export const remove = asyncHandler(async (req: Request, res: Response) => { await workspaces.deleteWorkspace(req.user!.userId, req.params.id!); res.status(204).end(); });
