import { useWorkflowStore } from '../../store/workflowStore';
import { workflowApi } from '../../api/workflows';
import { Save, Play, RotateCcw, Download } from 'lucide-react';
import { useState } from 'react';

export function Topbar({ onSimulate }: { onSimulate: () => void }) {
  const { workflowName, workflowId, nodes, edges, setWorkflowName, loadWorkflow, resetCanvas } = useWorkflowStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (workflowId) {
        await workflowApi.update(workflowId, { name: workflowName, nodes, edges });
      } else {
        const created = await workflowApi.create({ name: workflowName, nodes, edges });
        loadWorkflow(created);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ name: workflowName, nodes, edges }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold">T</div>
        <input
          value={workflowName}
          onChange={e => setWorkflowName(e.target.value)}
          className="bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent focus:border-slate-500 pb-0.5"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={resetCanvas}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={13} /> Reset
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download size={13} /> Export
        </button>
        <button
          type="button"
          onClick={onSimulate}
          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Play size={13} /> Test
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
        >
          <Save size={13} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </header>
  );
}
