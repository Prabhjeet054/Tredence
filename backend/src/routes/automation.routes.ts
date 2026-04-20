import { Router } from 'express';
import { getAutomations } from '../controllers/automation.controller';

const router = Router();
router.get('/', getAutomations);
export default router;
