// The typed, versioned knowledge graph (§7; docs/FORMULA_GRAPH_SCHEMA.md).
//
// Generic over its contents: callers pass nodes { id, kind, ... } and edges
// { source, target, type }. Validation enforces the schema's rules:
//   - node ids are unique and every node has a known kind
//   - every edge type is one of EDGE_TYPES and both ends exist (no dangling)
//   - `requires` edges form a DAG — a prerequisite cycle would make
//     "what should I learn first?" unanswerable. Other edge types (e.g. two
//     ideas applied to each other) may legitimately cycle.

export const GRAPH_VERSION = '1.0.0';

export const NODE_KINDS = ['concept', 'formula', 'lesson', 'exercise', 'project', 'dataset', 'model', 'application', 'career'];
export const EDGE_TYPES = ['requires', 'derived_from', 'generalizes', 'applies_to', 'contrasts_with', 'used_in'];

export function makeGraph(nodes, edges) {
  const byId = new Map();
  for (const n of nodes) byId.set(n.id, n);
  const out = new Map();
  const inn = new Map();
  for (const e of edges) {
    if (!out.has(e.source)) out.set(e.source, []);
    if (!inn.has(e.target)) inn.set(e.target, []);
    out.get(e.source).push(e);
    inn.get(e.target).push(e);
  }
  return { version: GRAPH_VERSION, nodes, edges, byId, out, inn };
}

/** Returns a list of human-readable problems; empty means valid. */
export function validateGraph(graph) {
  const errors = [];
  const seen = new Set();
  for (const n of graph.nodes) {
    if (!n.id) errors.push('node without id');
    else if (seen.has(n.id)) errors.push(`duplicate node id ${n.id}`);
    seen.add(n.id);
    if (!NODE_KINDS.includes(n.kind)) errors.push(`node ${n.id} has unknown kind ${n.kind}`);
  }
  for (const e of graph.edges) {
    if (!EDGE_TYPES.includes(e.type)) errors.push(`edge ${e.source} → ${e.target} has unknown type ${e.type}`);
    if (!graph.byId.has(e.source)) errors.push(`edge source ${e.source} does not exist (→ ${e.target}, ${e.type})`);
    if (!graph.byId.has(e.target)) errors.push(`edge target ${e.target} does not exist (${e.source} →, ${e.type})`);
    if (e.source === e.target) errors.push(`self-loop on ${e.source}`);
  }
  const cycle = findCycle(graph, 'requires');
  if (cycle) errors.push(`prerequisite cycle: ${cycle.join(' → ')}`);
  return errors;
}

/** A cycle among edges of `type`, as a list of ids, or null. */
export function findCycle(graph, type) {
  const WHITE = 0;
  const GREY = 1;
  const BLACK = 2;
  const color = new Map();
  const stack = [];
  const next = (id) => (graph.out.get(id) ?? []).filter((e) => e.type === type).map((e) => e.target);
  const visit = (id) => {
    color.set(id, GREY);
    stack.push(id);
    for (const t of next(id)) {
      const c = color.get(t) ?? WHITE;
      if (c === GREY) return [...stack.slice(stack.indexOf(t)), t];
      if (c === WHITE) {
        const found = visit(t);
        if (found) return found;
      }
    }
    stack.pop();
    color.set(id, BLACK);
    return null;
  };
  for (const n of graph.nodes) {
    if ((color.get(n.id) ?? WHITE) === WHITE) {
      const found = visit(n.id);
      if (found) return found;
    }
  }
  return null;
}

/** All nodes reachable from `id` along `type` edges (direction 'out' or 'in'). */
export function reach(graph, id, type, direction = 'out', maxDepth = Infinity) {
  const seen = new Map();
  let frontier = [id];
  for (let depth = 1; frontier.length && depth <= maxDepth; depth++) {
    const nextFrontier = [];
    for (const cur of frontier) {
      const list = direction === 'out' ? graph.out.get(cur) : graph.inn.get(cur);
      for (const e of list ?? []) {
        if (e.type !== type) continue;
        const other = direction === 'out' ? e.target : e.source;
        if (other === id || seen.has(other)) continue;
        seen.set(other, depth);
        nextFrontier.push(other);
      }
    }
    frontier = nextFrontier;
  }
  return seen; // id → depth
}

/**
 * Layer nodes by prerequisite depth: a node's layer is one more than the
 * deepest of its prerequisites. Used to draw the concept map left to right.
 */
export function prerequisiteLayers(graph, ids) {
  const set = new Set(ids);
  const layer = new Map();
  const get = (id, guard = new Set()) => {
    if (layer.has(id)) return layer.get(id);
    if (guard.has(id)) return 0;
    guard.add(id);
    const reqs = (graph.out.get(id) ?? []).filter((e) => e.type === 'requires' && set.has(e.target)).map((e) => e.target);
    const l = reqs.length ? 1 + Math.max(...reqs.map((r) => get(r, guard))) : 0;
    layer.set(id, l);
    return l;
  };
  for (const id of ids) get(id);
  return layer;
}
