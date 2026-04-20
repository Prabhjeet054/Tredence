import { Handle, Position, NodeProps } from 'reactflow';
import { ApprovalNodeData } from '../../../types/workflow';
import { ThumbsUp } from 'lucide-react';
import { useWorkflowStore } from '../../../store/workflowStore';
import clsx from 'clsx';

export function ApprovalNode({ id, data, selected }: NodeProps<ApprovalNodeData>) {
  const selectedId = useWorkflowStore(s => s.selectedNodeId);
  const isSelected = selected || selectedId === id;

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-xl border-2 bg-slate-900 min-w-[180px] shadow-lg transition-all',
        isSelected ? 'border-amber-400 shadow-amber-400/20' : 'border-amber-600'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !border-slate-900" />
      <div className="flex items-center gap-2 text-amber-400">
        <ThumbsUp size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">Approval</span>
      </div>
      <p className="text-white text-sm font-medium mt-1 truncate">{data.title || 'Approval'}</p>
      <p className="text-slate-400 text-xs mt-0.5">Role: {data.approverRole || 'Manager'}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !border-slate-900" />
    </div>
  );
}
