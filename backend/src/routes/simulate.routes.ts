import { Router } from 'express';
import { simulateWorkflow } from '../controllers/simulate.controller';

const router = Router();
router.post('/', simulateWorkflow);
export default router;
