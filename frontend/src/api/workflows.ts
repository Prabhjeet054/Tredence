import { apiClient } from './client';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/workflow';

export const workflowApi = {
  getAll: () => apiClient.get<{ data: Workflow[] }>('/workflows').then(r => r.data.data),
  getById: (id: string) => apiClient.get<{ data: Workflow }>(`/workflows/${id}`).then(r => r.data.data),
  create: (payload: { name: string; description?: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) =>
    apiClient.post<{ data: Workflow }>('/workflows', payload).then(r => r.data.data),
  update: (id: string, payload: Partial<Workflow>) =>
    apiClient.put<{ data: Workflow }>(`/workflows/${id}`, payload).then(r => r.data.data),
  delete: (id: string) => apiClient.delete(`/workflows/${id}`),
};
