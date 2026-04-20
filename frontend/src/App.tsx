import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { NodePalette } from './components/sidebar/NodePalette';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeFormPanel } from './components/forms/NodeFormPanel';
import { SimulationPanel } from './components/sandbox/SimulationPanel';
import { Topbar } from './components/ui/Topbar';

function App() {
  const [showSimulation, setShowSimulation] = useState(false);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
        <Topbar onSimulate={() => setShowSimulation(true)} />
        <div className="flex flex-1 overflow-hidden">
          <NodePalette />
          <WorkflowCanvas />
          <NodeFormPanel />
        </div>
        {showSimulation && <SimulationPanel onClose={() => setShowSimulation(false)} />}
      </div>
    </ReactFlowProvider>
  );
}

export default App;
