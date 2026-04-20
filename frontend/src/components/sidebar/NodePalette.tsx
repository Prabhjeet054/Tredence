import { DragEvent } from 'react';
import { Play, CheckSquare, ThumbsUp, Zap, Flag } from 'lucide-react';

const NODE_TYPES = [
  { type: 'start', label: 'Start', icon: Play, color: 'text-emerald-400 border-emerald-700 bg-emerald-950' },
  { type: 'task', label: 'Task', icon: CheckSquare, color: 'text-blue-400 border-blue-700 bg-blue-950' },
  { type: 'approval', label: 'Approval', icon: ThumbsUp, color: 'text-amber-400 border-amber-700 bg-amber-950' },
  { type: 'automated', label: 'Automated', icon: Zap, color: 'text-purple-400 border-purple-700 bg-purple-950' },
  { type: 'end', label: 'End', icon: Flag, color: 'text-red-400 border-red-700 bg-red-950' },
];

export function NodePalette() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-700 flex flex-col p-4 gap-2">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">Nodes</p>
      {NODE_TYPES.map(({ type, label, icon: Icon, color }) => (
        <div
          key={type}
          draggable
          onDragStart={e => onDragStart(e, type)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing select-none ${color}`}
        >
          <Icon size={15} />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </aside>
  );
}
