import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkflowNode {
  id: string;
  type: 'start' | 'task' | 'approval' | 'automated' | 'end';
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface IWorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface IWorkflow extends Document {
  name: string;
  description?: string;
  nodes: IWorkflowNode[];
  edges: IWorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowNodeSchema = new Schema<IWorkflowNode>({
  id: { type: String, required: true },
  type: { type: String, enum: ['start', 'task', 'approval', 'automated', 'end'], required: true },
  position: { x: Number, y: Number },
  data: { type: Schema.Types.Mixed, default: {} },
});

const WorkflowEdgeSchema = new Schema<IWorkflowEdge>({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  sourceHandle: String,
  targetHandle: String,
});

const WorkflowSchema = new Schema<IWorkflow>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    nodes: [WorkflowNodeSchema],
    edges: [WorkflowEdgeSchema],
  },
  { timestamps: true }
);

export const Workflow = mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
