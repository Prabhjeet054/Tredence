import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WorkflowNode, StartNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

const schema = z.object({
  startTitle: z.string().min(1, 'Title is required'),
  metadata: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

function defaults(node: WorkflowNode): FormValues {
  const d = node.data as StartNodeData;
  return {
    startTitle: d.startTitle ?? 'Start',
    metadata: Array.isArray(d.metadata) ? d.metadata : [],
  };
}

export function StartNodeForm({ node }: { node: WorkflowNode }) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const { register, control, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults(node),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'metadata' });

  useEffect(() => {
    reset(defaults(node));
  }, [node.id, reset, node]);

  useEffect(() => {
    const subscription = watch(values => {
      updateNodeData(node.id, values as StartNodeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, node.id, updateNodeData]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Start title</label>
        <input
          {...register('startTitle')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs font-medium">Metadata</span>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`metadata.${index}.key`)}
                placeholder="Key"
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white"
              />
              <input
                {...register(`metadata.${index}.value`)}
                placeholder="Value"
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white"
              />
              <button type="button" onClick={() => remove(index)} className="text-slate-500 hover:text-red-400 text-xs">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
