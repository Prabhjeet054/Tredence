import { Handle, Position, NodeProps } from 'reactflow';
import { EndNodeData } from '../../../types/workflow';
import { Flag } from 'lucide-react';
import { useWorkflowStore } from '../../../store/workflowStore';
import clsx from 'clsx';

export function EndNode({ id, data, selected }: NodeProps<EndNodeData>) {
  const selectedId = useWorkflowStore(s => s.selectedNodeId);
  const isSelected = selected || selectedId === id;

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-xl border-2 bg-slate-900 min-w-[160px] shadow-lg transition-all',
        isSelected ? 'border-red-400 shadow-red-400/20' : 'border-red-600'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-red-400 !border-slate-900" />
      <div className="flex items-center gap-2 text-red-400">
        <Flag size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">End</span>
      </div>
      <p className="text-white text-sm font-medium mt-1 truncate">{data.endMessage || 'Complete'}</p>
    </div>
  );
}
