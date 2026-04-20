import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WorkflowNode, EndNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

const schema = z.object({
  endMessage: z.string().min(1, 'Message is required'),
  summaryFlag: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function defaults(node: WorkflowNode): FormValues {
  const d = node.data as EndNodeData;
  return {
    endMessage: d.endMessage ?? 'Workflow Complete',
    summaryFlag: Boolean(d.summaryFlag),
  };
}

export function EndNodeForm({ node }: { node: WorkflowNode }) {
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
      updateNodeData(node.id, values as EndNodeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">End message</label>
        <textarea
          {...register('endMessage')}
          rows={3}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>
      <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
        <input type="checkbox" {...register('summaryFlag')} className="rounded border-slate-600 bg-slate-800" />
        Generate summary
      </label>
    </div>
  );
}
