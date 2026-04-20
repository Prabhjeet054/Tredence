import { Request, Response, NextFunction } from 'express';

interface SimulateNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

interface SimulateEdge {
  source: string;
  target: string;
}

interface SimulatePayload {
  nodes: SimulateNode[];
  edges: SimulateEdge[];
}

interface SimulateStep {
  nodeId: string;
  nodeType: string;
  label: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

function buildAdjacencyList(edges: SimulateEdge[]) {
  const map: Record<string, string[]> = {};
  edges.forEach(({ source, target }) => {
    if (!map[source]) map[source] = [];
    map[source].push(target);
  });
  return map;
}

function topologicalOrder(nodes: SimulateNode[], adj: Record<string, string[]>): SimulateNode[] | null {
  const inDegree: Record<string, number> = {};
  nodes.forEach(n => (inDegree[n.id] = 0));
  nodes.forEach(n => (adj[n.id] || []).forEach(target => (inDegree[target] = (inDegree[target] || 0) + 1)));

  const queue = nodes.filter(n => inDegree[n.id] === 0);
  const result: SimulateNode[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    (adj[node.id] || []).forEach(target => {
      inDegree[target]--;
      if (inDegree[target] === 0) {
        const targetNode = nodes.find(n => n.id === target);
        if (targetNode) queue.push(targetNode);
      }
    });
  }

  return result.length === nodes.length ? result : null;
}

export const simulateWorkflow = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nodes, edges }: SimulatePayload = req.body;

    if (!nodes?.length) {
      return res.status(400).json({ success: false, message: 'No nodes provided' });
    }

    const adj = buildAdjacencyList(edges);
    const ordered = topologicalOrder(nodes, adj);

    if (!ordered) {
      return res.status(400).json({ success: false, message: 'Cycle detected in workflow', steps: [] });
    }

    const startNodes = nodes.filter(n => n.type === 'start');
    const endNodes = nodes.filter(n => n.type === 'end');

    const validationErrors: string[] = [];
    if (startNodes.length === 0) validationErrors.push('Workflow must have a Start node');
    if (startNodes.length > 1) validationErrors.push('Workflow must have exactly one Start node');
    if (endNodes.length === 0) validationErrors.push('Workflow must have an End node');

    const connectedIds = new Set([...edges.map(e => e.source), ...edges.map(e => e.target)]);
    nodes.forEach(n => {
      if (nodes.length > 1 && !connectedIds.has(n.id)) {
        validationErrors.push(`Node "${(n.data.title as string) || n.id}" is disconnected`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: validationErrors, steps: [] });
    }

    const steps: SimulateStep[] = ordered.map((node, index) => {
      const delay = index * 150;
      return {
        nodeId: node.id,
        nodeType: node.type,
        label:
          (node.data.title as string) ||
          (node.data.startTitle as string) ||
          (node.data.endMessage as string) ||
          node.type,
        status: 'success',
        message: getStepMessage(node),
        timestamp: new Date(Date.now() + delay).toISOString(),
      };
    });

    res.json({ success: true, steps });
  } catch (err) {
    next(err);
  }
};

function getStepMessage(node: SimulateNode): string {
  switch (node.type) {
    case 'start':
      return `Workflow initiated: ${node.data.startTitle || 'Start'}`;
    case 'task':
      return `Task assigned to ${node.data.assignee || 'Unassigned'}: ${node.data.title}`;
    case 'approval':
      return `Pending approval from ${node.data.approverRole || 'Manager'}`;
    case 'automated':
      return `Executing automation: ${node.data.actionId || 'action'}`;
    case 'end':
      return `Workflow completed. ${node.data.summaryFlag ? 'Summary generated.' : ''}`;
    default:
      return 'Processing...';
  }
}
