import { Handle, Position, NodeProps } from 'reactflow';
import { TaskNodeData } from '../../../types/workflow';
import { CheckSquare } from 'lucide-react';
import { useWorkflowStore } from '../../../store/workflowStore';
import clsx from 'clsx';

export function TaskNode({ id, data, selected }: NodeProps<TaskNodeData>) {
  const selectedId = useWorkflowStore(s => s.selectedNodeId);
  const isSelected = selected || selectedId === id;

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-xl border-2 bg-slate-900 min-w-[180px] shadow-lg transition-all',
        isSelected ? 'border-blue-400 shadow-blue-400/20' : 'border-blue-600'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !border-slate-900" />
      <div className="flex items-center gap-2 text-blue-400">
        <CheckSquare size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">Task</span>
      </div>
      <p className="text-white text-sm font-medium mt-1 truncate">{data.title || 'Task'}</p>
      {data.assignee ? (
        <p className="text-slate-400 text-xs mt-0.5 truncate">Assignee: {data.assignee}</p>
      ) : null}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !border-slate-900" />
    </div>
  );
}
