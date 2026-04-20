import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulate } from '../../hooks/useSimulate';
import { CheckCircle, XCircle, AlertCircle, Loader2, Play } from 'lucide-react';

export function SimulationPanel({ onClose }: { onClose: () => void }) {
  const { nodes, edges } = useWorkflowStore();
  const { result, loading, run, reset } = useSimulate();

  const handleRun = () => {
    reset();
    run(nodes, edges);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-white font-bold text-lg">Workflow Simulation</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl">
            ×
          </button>
        </div>

        <div className="p-6">
          <button
            type="button"
            onClick={handleRun}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg py-2.5 font-medium transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>

          {result && (
            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
              {!result.success && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-medium">{result.message}</p>
                  {result.errors?.map((e, i) => (
                    <p key={i} className="text-red-300 text-xs mt-1">
                      • {e}
                    </p>
                  ))}
                </div>
              )}
              {result.steps?.map((step, i) => (
                <div
                  key={step.nodeId}
                  className="flex items-start gap-3 bg-slate-800 rounded-lg p-3 animate-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <StepIcon status={step.status} />
                  <div>
                    <p className="text-white text-sm font-medium">{step.label}</p>
                    <p className="text-slate-400 text-xs">{step.message}</p>
                    <p className="text-slate-600 text-xs">{new Date(step.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIcon({ status }: { status: string }) {
  if (status === 'success') return <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />;
  if (status === 'error') return <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />;
  return <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />;
}
