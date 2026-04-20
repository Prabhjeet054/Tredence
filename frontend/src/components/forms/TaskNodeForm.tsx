import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WorkflowNode, TaskNodeData } from '../../types/workflow';
import { useWorkflowStore } from '../../store/workflowStore';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  customFields: z.array(z.object({ key: z.string(), value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

function defaults(node: WorkflowNode): FormValues {
  const d = node.data as TaskNodeData;
  return {
    title: d.title ?? 'New Task',
    description: d.description ?? '',
    assignee: d.assignee ?? '',
    dueDate: d.dueDate ?? '',
    customFields: Array.isArray(d.customFields) ? d.customFields : [],
  };
}

export function TaskNodeForm({ node }: { node: WorkflowNode }) {
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);

  const { register, control, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults(node),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'customFields' });

  useEffect(() => {
    reset(defaults(node));
  }, [node.id, reset, node]);

  useEffect(() => {
    const subscription = watch(values => {
      updateNodeData(node.id, values as TaskNodeData);
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
        <label className="block text-slate-400 text-xs font-medium mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Assignee</label>
        <input
          {...register('assignee')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-slate-400 text-xs font-medium mb-1">Due date</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs font-medium">Custom fields</span>
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
                {...register(`customFields.${index}.key`)}
                placeholder="Key"
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-white"
              />
              <input
                {...register(`customFields.${index}.value`)}
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
