import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WorkflowNode, ApprovalNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.string().min(1),
  autoApproveThreshold: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

const ROLES = ['Manager', 'HRBP', 'Director'] as const;

function defaults(node: WorkflowNode): FormValues {
  const d = node.data as ApprovalNodeData;
  return {
    title: d.title ?? 'Approval Step',
    approverRole: d.approverRole ?? 'Manager',
    autoApproveThreshold: d.autoApproveThreshold ?? 0,
  };
}

export function ApprovalNodeForm({ node }: { node: WorkflowNode }) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const { register, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults(node),
  });

  useEffect(() => {
    reset(defaults(node));
  }, [node.id, reset, node]);

  useEffect(() => {
    const subscription = watch(values => {
      updateNodeData(node.id, values as ApprovalNodeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, node.id, updateNodeData]);

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
        <label className="block text-slate-400 text-xs font-medium mb-1">Approver role</label>
        <select
          {...register('approverRole')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {ROLES.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Auto-approve threshold</label>
        <input
          type="number"
          {...register('autoApproveThreshold')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
