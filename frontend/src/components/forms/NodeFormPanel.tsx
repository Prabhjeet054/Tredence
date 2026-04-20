import { useWorkflowStore } from '../../store/workflowStore';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';
import { X } from 'lucide-react';

export function NodeFormPanel() {
  const { nodes, selectedNodeId, setSelectedNodeId } = useWorkflowStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start':
        return <StartNodeForm node={selectedNode} />;
      case 'task':
        return <TaskNodeForm node={selectedNode} />;
      case 'approval':
        return <ApprovalNodeForm node={selectedNode} />;
      case 'automated':
        return <AutomatedNodeForm node={selectedNode} />;
      case 'end':
        return <EndNodeForm node={selectedNode} />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-700 h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h2 className="text-white font-semibold text-sm">Configure Node</h2>
        <button type="button" onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 flex-1" key={selectedNode.id}>
        {renderForm()}
      </div>
    </aside>
  );
}
