import { Router } from 'express';
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from '../controllers/workflow.controller';

const router = Router();

router.get('/', getAllWorkflows);
router.get('/:id', getWorkflowById);
router.post('/', createWorkflow);
router.put('/:id', updateWorkflow);
router.delete('/:id', deleteWorkflow);

export default router;
