import { apiClient, API_PREFIX } from './client';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/workflow';

const base = `${API_PREFIX}/workflows`;

export const workflowApi = {
  getAll: () => apiClient.get<{ data: Workflow[] }>(base).then(r => r.data.data),
  getById: (id: string) => apiClient.get<{ data: Workflow }>(`${base}/${id}`).then(r => r.data.data),
  create: (payload: { name: string; description?: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) =>
    apiClient.post<{ data: Workflow }>(base, payload).then(r => r.data.data),
  update: (id: string, payload: Partial<Workflow>) =>
    apiClient.put<{ data: Workflow }>(`${base}/${id}`, payload).then(r => r.data.data),
  delete: (id: string) => apiClient.delete(`${base}/${id}`),
};
