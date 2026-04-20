import { apiClient } from './client';
import { WorkflowNode, WorkflowEdge, SimulateResult } from '../types/workflow';

export const simulateApi = {
  run: (nodes: WorkflowNode[], edges: WorkflowEdge[]) =>
    apiClient.post<SimulateResult>('/simulate', { nodes, edges }).then(r => r.data),
};
