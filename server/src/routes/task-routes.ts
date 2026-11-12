import { Router } from 'express';
import * as controller from '../controllers/task-controller.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { idSchema, taskUpdateSchema } from '../validators/schemas.js';
const router = Router();
router.get('/:id', validateParams(idSchema), controller.get);
router.patch('/:id', validateParams(idSchema), validateBody(taskUpdateSchema), controller.update);
router.delete('/:id', validateParams(idSchema), controller.remove);
export default router;
