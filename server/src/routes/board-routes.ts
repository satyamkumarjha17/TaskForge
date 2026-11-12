import { Router } from 'express';
import * as controller from '../controllers/board-controller.js';
import { validateBody } from '../middleware/validate.js';
import { boardSchema } from '../validators/schemas.js';
const router = Router({ mergeParams: true });
router.get('/', controller.list);
router.post('/', validateBody(boardSchema), controller.create);
export default router;
