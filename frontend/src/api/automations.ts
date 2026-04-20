import { apiClient, API_PREFIX } from './client';
import { AutomationAction } from '../types/workflow';

export const automationApi = {
  getAll: () =>
    apiClient.get<{ data: AutomationAction[] }>(`${API_PREFIX}/automations`).then(r => r.data.data),
};
