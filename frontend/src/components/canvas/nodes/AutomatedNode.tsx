import { Handle, Position, NodeProps } from 'reactflow';
import { AutomatedNodeData } from '../../../types/workflow';
import { Zap } from 'lucide-react';
import { useWorkflowStore } from '../../../store/workflowStore';
import clsx from 'clsx';

export function AutomatedNode({ id, data, selected }: NodeProps<AutomatedNodeData>) {
  const selectedId = useWorkflowStore(s => s.selectedNodeId);
  const isSelected = selected || selectedId === id;

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-xl border-2 bg-slate-900 min-w-[180px] shadow-lg transition-all',
        isSelected ? 'border-purple-400 shadow-purple-400/20' : 'border-purple-600'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !border-slate-900" />
      <div className="flex items-center gap-2 text-purple-400">
        <Zap size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">Automated</span>
      </div>
      <p className="text-white text-sm font-medium mt-1 truncate">{data.title || 'Automated'}</p>
      <p className="text-slate-400 text-xs mt-0.5 truncate">
        {data.actionId ? `Action: ${data.actionId}` : 'No action selected'}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !border-slate-900" />
    </div>
  );
}
