import { useState } from 'react';
import { simulateApi } from '../api/simulate';
import { WorkflowNode, WorkflowEdge, SimulateResult } from '../types/workflow';

export function useSimulate() {
  const [result, setResult] = useState<SimulateResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
    setLoading(true);
    try {
      const res = await simulateApi.run(nodes, edges);
      setResult(res);
    } catch (err: unknown) {
      setResult({ success: false, message: (err as { message?: string })?.message || 'Simulation failed' });
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, run, reset: () => setResult(null) };
}
