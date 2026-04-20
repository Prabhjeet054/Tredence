import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomationAction extends Document {
  id: string;
  label: string;
  params: string[];
}

const AutomationActionSchema = new Schema<IAutomationAction>({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  params: [{ type: String }],
});

export const AutomationAction = mongoose.model<IAutomationAction>('AutomationAction', AutomationActionSchema);
