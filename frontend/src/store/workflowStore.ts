import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, Connection, NodeChange, EdgeChange } from 'reactflow';
import { WorkflowNode, WorkflowEdge, WorkflowNodeData, NodeType } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  workflowName: string;
  workflowId: string | null;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNode['data']>) => void;
  setSelectedNodeId: (id: string | null) => void;
  setWorkflowName: (name: string) => void;
  loadWorkflow: (workflow: { _id: string; name: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) => void;
  resetCanvas: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowName: 'Untitled Workflow',
  workflowId: null,

  setNodes: nodes => set({ nodes }),
  setEdges: edges => set({ edges }),
  onNodesChange: changes => set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] }),
  onEdgesChange: changes => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: connection => set({ edges: addEdge({ ...connection, id: uuidv4() }, get().edges) }),
  addNode: (type, position) => {
    const id = uuidv4();
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: getDefaultData(type),
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map(n => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
    });
  },
  setSelectedNodeId: id => set({ selectedNodeId: id }),
  setWorkflowName: name => set({ workflowName: name }),
  loadWorkflow: workflow =>
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      workflowName: workflow.name,
      workflowId: workflow._id,
    }),
  resetCanvas: () => set({ nodes: [], edges: [], workflowName: 'Untitled Workflow', workflowId: null }),
}));

function getDefaultData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { startTitle: 'Start', metadata: [] };
    case 'task':
      return { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':
      return { title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated':
      return { title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end':
      return { endMessage: 'Workflow Complete', summaryFlag: false };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
