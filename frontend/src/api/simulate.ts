import { apiClient, API_PREFIX } from './client';
import { WorkflowNode, WorkflowEdge, SimulateResult } from '../types/workflow';

export const simulateApi = {
  run: (nodes: WorkflowNode[], edges: WorkflowEdge[]) =>
    apiClient.post<SimulateResult>(`${API_PREFIX}/simulate`, { nodes, edges }).then(r => r.data),
};
