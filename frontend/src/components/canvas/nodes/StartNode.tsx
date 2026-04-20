import { Handle, Position, NodeProps } from 'reactflow';
import { StartNodeData } from '../../../types/workflow';
import { Play } from 'lucide-react';
import { useWorkflowStore } from '../../../store/workflowStore';
import clsx from 'clsx';

export function StartNode({ id, data, selected }: NodeProps<StartNodeData>) {
  const selectedId = useWorkflowStore(s => s.selectedNodeId);
  const isSelected = selected || selectedId === id;

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-xl border-2 bg-slate-900 min-w-[160px] shadow-lg transition-all',
        isSelected ? 'border-emerald-400 shadow-emerald-400/20' : 'border-emerald-600'
      )}
    >
      <div className="flex items-center gap-2 text-emerald-400">
        <Play size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">Start</span>
      </div>
      <p className="text-white text-sm font-medium mt-1 truncate">{data.startTitle || 'Start'}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !border-slate-900" />
    </div>
  );
}
