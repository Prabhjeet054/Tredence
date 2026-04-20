import { apiClient } from './client';
import { AutomationAction } from '../types/workflow';

export const automationApi = {
  getAll: () => apiClient.get<{ data: AutomationAction[] }>('/automations').then(r => r.data.data),
};
