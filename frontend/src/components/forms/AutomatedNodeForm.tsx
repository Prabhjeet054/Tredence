import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WorkflowNode, AutomatedNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAutomations } from '../../hooks/useAutomations';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().optional(),
  actionParams: z.record(z.string()),
});

type FormValues = z.infer<typeof schema>;

function defaults(node: WorkflowNode): FormValues {
  const d = node.data as AutomatedNodeData;
  return {
    title: d.title ?? 'Automated Step',
    actionId: d.actionId ?? '',
    actionParams: d.actionParams && typeof d.actionParams === 'object' ? { ...d.actionParams } : {},
  };
}

export function AutomatedNodeForm({ node }: { node: WorkflowNode }) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);
  const { automations, loading } = useAutomations();

  const { register, watch, reset, setValue, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults(node),
  });

  const actionId = watch('actionId');

  const selectedAction = useMemo(() => automations.find(a => a.id === actionId), [automations, actionId]);

  useEffect(() => {
    reset(defaults(node));
  }, [node.id, reset, node]);

  useEffect(() => {
    if (!selectedAction) {
      setValue('actionParams', {});
      return;
    }
    const prev = getValues('actionParams') || {};
    const next: Record<string, string> = {};
    selectedAction.params.forEach(p => {
      next[p] = prev[p] ?? '';
    });
    setValue('actionParams', next);
  }, [actionId, selectedAction, setValue, getValues]);

  useEffect(() => {
    const subscription = watch(values => {
      updateNodeData(node.id, values as AutomatedNodeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading automations…</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Title</label>
        <input
          {...register('title')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Automation action</label>
        <select
          {...register('actionId')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select action</option>
          {automations.map(a => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
      {selectedAction && selectedAction.params.length > 0 ? (
        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-medium">Parameters</p>
          {selectedAction.params.map(param => (
            <div key={param}>
              <label className="block text-slate-500 text-xs mb-1 capitalize">{param.replace(/_/g, ' ')}</label>
              <input
                {...register(`actionParams.${param}`)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
