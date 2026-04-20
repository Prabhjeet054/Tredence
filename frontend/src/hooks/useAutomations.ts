import { useEffect, useState } from 'react';
import { automationApi } from '../api/automations';
import { AutomationAction } from '../types/workflow';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    automationApi
      .getAll()
      .then(setAutomations)
      .finally(() => setLoading(false));
  }, []);

  return { automations, loading };
}
