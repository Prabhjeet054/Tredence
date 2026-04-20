import { Node, Edge } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface StartNodeData {
  startTitle: string;
  metadata: Array<{ key: string; value: string }>;
}

export interface TaskNodeData {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields: Array<{ key: string; value: string }>;
}

export interface ApprovalNodeData {
  title: string;
  approverRole: 'Manager' | 'HRBP' | 'Director' | string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData {
  title: string;
  actionId?: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface Workflow {
  _id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulateStep {
  nodeId: string;
  nodeType: string;
  label: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface SimulateResult {
  success: boolean;
  steps?: SimulateStep[];
  message?: string;
  errors?: string[];
}
