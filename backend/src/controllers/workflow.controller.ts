import { Request, Response, NextFunction } from 'express';
import { Workflow } from '../models/Workflow';

export const getAllWorkflows = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const workflows = await Workflow.find().sort({ updatedAt: -1 });
    res.json({ success: true, data: workflows });
  } catch (err) {
    next(err);
  }
};

export const getWorkflowById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });
    res.json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
};

export const createWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await Workflow.create(req.body);
    res.status(201).json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
};

export const updateWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!workflow) return res.status(404).json({ success: false, message: 'Workflow not found' });
    res.json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Workflow.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
