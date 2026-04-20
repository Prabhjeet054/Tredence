import { Request, Response, NextFunction } from 'express';
import { AutomationAction } from '../models/AutomationAction';

export const getAutomations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await AutomationAction.countDocuments();
    if (count === 0) {
      await AutomationAction.insertMany([
        { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
        { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
        { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
        { id: 'update_hrms', label: 'Update HRMS', params: ['employee_id', 'field', 'value'] },
      ]);
    }
    const actions = await AutomationAction.find();
    res.json({ success: true, data: actions });
  } catch (err) {
    next(err);
  }
};
