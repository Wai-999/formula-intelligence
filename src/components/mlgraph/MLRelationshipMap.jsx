import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ML_MODELS, ML_LINKS, ML_FAMILIES, mlFamilyColorMap } from '../../data/ml/models.js';
import { computeHierarchicalLayout } from '../graph/hierarchicalLayout.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
import { resolveT } from '../../lib/mlContent.js';
import './MLRelationshipMap.css';

// Sibling to Stats mode's GraphCanvas.jsx rather than a parameterized
// extension of it — see BUILD_LOG.md Module 3/Phase 1 §1 for why. Reuses
// the SAME computeHierarchicalLayout function (already generic) and the
// SAME click-detection approach discovered and hardened in Stats mode
// (read click-vs-drag from d3.drag/d3.zoom's own start/end gesture, not a
// hand-rolled mousedown/mouseup pair — see GraphCanvas.jsx's own comments
// for the full "why" if this is ever touched again).
//
// FIX_LOG.md (second pass): this is, and always was, a fixed hierarchical
// (Sugiyama-style) layout — one row per model family, columns
// barycenter-ordered within each row — not a force simulation. There is no
// physics "settle" step anywhere in this file. That matters for how the
// fixes below are framed: the layout strategy asked for (fixed bands per
// family, local ordering within a band, curved cross-band routing instead
// of straight lines) is not a rewrite of what's here — it's what's already
// here. What was genuinely missing, confirmed by measuring the live
// rendered DOM rather than assuming from the first pass's own report:
// (a) the curve-routing only considered ROW distance, so same-row edges
// spanning many columns (a real, common case — e.g. Decision Tree straight
// to Bagging, 900 canvas-units, cutting through every node between them)
// stayed dead straight; (b) multiple edges arriving at one node from
// similar directions landed at the exact same angle on its circumference
// (measured: several nodes had a 0° gap between two arrowheads — not an
// approximation, the literal same point); (c) node labels and the hover
// tooltip had no viewport-bounds awareness at all, unlike the row headers
// (which were already pinned in the first pass).
const EDGE_STYLE = {
  extends: { color: 'var(--accent)', dash: null },
  competes: { color: 'var(--warning)', dash: '3,3' },
  combines: { color: 'var(--success)', dash: '1,4' },
};

function sourceClientXY(sourceEvent) {
  const touch = sourceEvent.changedTouches?.[0] || sourceEvent.touches?.[0];
  return touch ? [touch.clientX, touch.clientY] : [sourceEvent.clientX, sourceEvent.clientY];
}

// Node circles are drawn with r=NODE_R (below); edges are trimmed back from
// each node's exact center by this radius (+ a small gap) so the line
// visibly stops at the node's boundary and the arrowhead marker renders in
// the open, pointing in, rather than buried under the node's own fill.
const NODE_R = 12;
const EDGE_GAP = 3;
// Must match the columnSpacing/rowSpacing passed to computeHierarchicalLayout
// below — kept as named constants here too since edge-curving and label
// truncation both need to reason about row/column geometry independently
// of the layout call itself.
const ROW_SPACING = 110;
const COLUMN_SPACING = 150;
// A generous safety net, not a default-triggering rule — only the single
// longest current label ("Bayesian Structural Time Series / Bayesian NNs",
// ~208 canvas-units) exceeds this in the static layout.
const MAX_LABEL_W = 190;
// Minimum angular gap enforced between edges arriving at the same node, so
// no two arrowheads land at (or near enough to look like) the same point.
const MIN_ARRIVAL_GAP_RAD = (13 * Math.PI) / 180;

function trimTowardPoint(fromX, fromY, towardX, towardY, trim) {
  const dx = towardX - fromX;
  const dy = towardY - fromY;
  const dist = Math.hypot(dx, dy) || 1;
  return { x: fromX + (dx / dist) * trim, y: fromY + (dy / dist) * trim };
}

// Picks a control point for the quadratic-bezier edge between two node
// centers. Three cases:
//  - Nodes close together (same/adjacent row, few columns apart): a plain
//    straight line (control point on the midpoint) — the common case,
//    nothing to route around.
//  - Same/adjacent row but many columns apart: a straight line here would
//    cut through every node sitting between them on that row (confirmed
//    live — several real edges spanned 450-900 canvas-units, 3-6 columns,
//    dead straight). Bulges vertically instead, clear of the row's own
//    baseline; a modest, distance-scaled offset is enough given rows are
//    110 units apart and nodes are only 12px radius.
//  - Genuinely different rows: bulges horizontally toward the diagram's
//    outer margin (away from the dense center columns, into space the
//    centered-row layout already leaves empty for narrower rows).
function edgeControlPoint(sx, sy, tx, ty, diagramCenterX) {
  const midX = (sx + tx) / 2;
  const midY = (sy + ty) / 2;
  const rowDist = Math.abs(ty - sy) / ROW_SPACING;
  const colDist = Math.abs(tx - sx) / COLUMN_SPACING;

  if (rowDist >= 1.5) {
    const offset = Math.min(140, 26 * rowDist);
    const side = midX < diagramCenterX ? -1 : 1;
    return { x: midX + side * offset, y: midY };
  }
  if (colDist >= 2.5) {
    const offset = Math.min(48, 9 * colDist);
    return { x: midX, y: midY + offset };
  }
  return { x: midX, y: midY };
}

// Distributes the angle each edge departs its endpoints at, so edges that
// would otherwise arrive from nearly the same direction (measured live:
// several real nodes had two arrowheads at the literal identical angle)
// fan out around the node's circumference instead. Computed once from the
// static layout and cached on each link as _sAngle/_tAngle; reused as-is
// during drag (recomputing a stable fan live while a node moves is a lot
// of complexity for an interaction the verification pass isn't targeting —
// the fixed angle still departs the node in roughly the right direction).
function assignArrivalAngles(simLinks, diagramCenterX) {
  const byNode = new Map();
  simLinks.forEach((l) => {
    const cp = edgeControlPoint(l.source.x, l.source.y, l.target.x, l.target.y, diagramCenterX);
    const sEntry = { link: l, end: 's', angle: Math.atan2(cp.y - l.source.y, cp.x - l.source.x) };
    const tEntry = { link: l, end: 't', angle: Math.atan2(cp.y - l.target.y, cp.x - l.target.x) };
    if (!byNode.has(l.s)) byNode.set(l.s, []);
    if (!byNode.has(l.t)) byNode.set(l.t, []);
    byNode.get(l.s).push(sEntry);
    byNode.get(l.t).push(tEntry);
  });

  function apply(entry) {
    if (entry.end === 's') entry.link._sAngle = entry.angle;
    else entry.link._tAngle = entry.angle;
  }

  byNode.forEach((entries) => {
    if (entries.length < 2) {
      entries.forEach(apply);
      return;
    }
    const sorted = [...entries].sort((a, b) => a.angle - b.angle);
    const clusters = [[sorted[0]]];
    for (let i = 1; i < sorted.length; i++) {
      const lastCluster = clusters[clusters.length - 1];
      if (sorted[i].angle - lastCluster[lastCluster.length - 1].angle < MIN_ARRIVAL_GAP_RAD) {
        lastCluster.push(sorted[i]);
      } else {
        clusters.push([sorted[i]]);
      }
    }
    if (clusters.length > 1) {
      const first = clusters[0];
      const last = clusters[clusters.length - 1];
      const wrapGap = (first[0].angle + 2 * Math.PI) - last[last.length - 1].angle;
      if (wrapGap < MIN_ARRIVAL_GAP_RAD) {
        // `first` sorts lowest (just above -PI) and `last` sorts highest
        // (just below +PI) — geometrically adjacent across the atan2
        // -PI/+PI seam (both point roughly due "west"), but numerically
        // ~2*PI apart. The mean taken below (clusters.forEach) is a plain
        // sum/length average of raw angle values, which would average a
        // ~-3.1 and a ~3.1 to ~0 — due EAST, the opposite side of the node
        // from where these edges actually point — if left un-normalized.
        // Shifting `first`'s angles by +2*PI makes them numerically
        // contiguous with `last`'s before that mean is taken; this changes
        // no geometry (Math.cos/Math.sin are 2*PI-periodic), only which
        // numeral represents the same direction.
        const wrappedFirst = first.map((e) => ({ ...e, angle: e.angle + 2 * Math.PI }));
        clusters[0] = [...last, ...wrappedFirst];
        clusters.pop();
      }
    }
    const spread = [];
    clusters.forEach((cluster) => {
      if (cluster.length === 1) { spread.push(cluster[0]); return; }
      const mean = cluster.reduce((sum, e) => sum + e.angle, 0) / cluster.length;
      cluster.forEach((e, i) => {
        spread.push({ ...e, angle: mean + (i - (cluster.length - 1) / 2) * MIN_ARRIVAL_GAP_RAD });
      });
    });
    // Per-cluster spreading can still leave two DIFFERENT clusters' edge
    // members closer together than the minimum gap (confirmed live: one
    // node measured 4.8° between a cluster boundary pair, vs. the 13°
    // enforced within each cluster) — a few relaxation passes over the
    // fully-spread set catches that residual case too.
    for (let pass = 0; pass < 4; pass++) {
      spread.sort((a, b) => a.angle - b.angle);
      for (let i = 1; i < spread.length; i++) {
        const gap = spread[i].angle - spread[i - 1].angle;
        if (gap < MIN_ARRIVAL_GAP_RAD) {
          const push = (MIN_ARRIVAL_GAP_RAD - gap) / 2;
          spread[i - 1].angle -= push;
          spread[i].angle += push;
        }
      }
      const wrapGap = (spread[0].angle + 2 * Math.PI) - spread[spread.length - 1].angle;
      if (wrapGap < MIN_ARRIVAL_GAP_RAD) {
        const push = (MIN_ARRIVAL_GAP_RAD - wrapGap) / 2;
        spread[spread.length - 1].angle -= push;
        spread[0].angle += push;
      }
    }
    spread.forEach(apply);
  });
}

function edgePathD(sx, sy, tx, ty, diagramCenterX, sAngle, tAngle) {
  const cp = edgeControlPoint(sx, sy, tx, ty, diagramCenterX);
  const trim = NODE_R + EDGE_GAP;
  // Trim along the assigned arrival angle when one was computed (the usual
  // case — see assignArrivalAngles), which is what actually spreads
  // converging edges apart. Falls back to the tangent at the endpoint
  // (control-point → endpoint) otherwise, which is what keeps a plain
  // 2-edge connection's arrowhead correctly oriented.
  const p0 = sAngle != null
    ? { x: sx + Math.cos(sAngle) * trim, y: sy + Math.sin(sAngle) * trim }
    : trimTowardPoint(sx, sy, cp.x, cp.y, trim);
  const p2 = tAngle != null
    ? { x: tx + Math.cos(tAngle) * trim, y: ty + Math.sin(tAngle) * trim }
    : trimTowardPoint(tx, ty, cp.x, cp.y, trim);
  return `M${p0.x},${p0.y} Q${cp.x},${cp.y} ${p2.x},${p2.y}`;
}

const LABEL_DY_BELOW = 26;
const LABEL_DY_ABOVE = -18;
const LABEL_DX_SHIFT = 20;
const VIEWPORT_MARGIN = 4;

export default function MLRelationshipMap() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const tooltipRef = useRef(null);
  const pinnedLabelSelRef = useRef(null);
  const lang = useMLUIStore((s) => s.lang);
  // Read via ref inside the mount effect (below), not the reactive `lang`
  // directly — the mount effect must stay [] deps (a real dependency would
  // re-run the whole D3 mount on every language toggle, destroying pan/
  // zoom/drag state), and this is the standard, lint-clean way to read a
  // "latest value" from inside an effect without adding it as a dependency.
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const wrap = wrapRef.current;
    // let, not const: the pane can be display:none at mount (keep-alive
    // tab mounting — see MLBody.jsx), giving a 0x0 initial measurement that
    // the resize-refit logic below corrects once the tab becomes visible.
    let { width, height } = wrap.getBoundingClientRect();
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    svg.on('.zoom', null);
    svg.node().__zoom = d3.zoomIdentity;

    // Model names ("Ridge / Lasso / Elastic Net", "Gradient Boosting
    // (general)") run much longer than Stats mode's formula names, so this
    // graph needs wider spacing than the shared layout's default — see the
    // optional params added to computeHierarchicalLayout for exactly this.
    const { positions, chapterRowY } = computeHierarchicalLayout(ML_MODELS, ML_LINKS, {
      columnSpacing: COLUMN_SPACING,
      rowSpacing: ROW_SPACING,
    });
    const simNodes = ML_MODELS.map((n) => ({ ...n, ...positions[n.id] }));
    const simLinks = ML_LINKS
      .map((l) => ({ ...l, source: positions[l.s], target: positions[l.t] }))
      .filter((l) => l.source && l.target);

    const rowXs = Object.values(positions).map((p) => p.x);
    const minNodeX = Math.min(...rowXs);
    const maxNodeX = Math.max(...rowXs);
    const diagramCenterX = (minNodeX + maxNodeX) / 2;

    assignArrivalAngles(simLinks, diagramCenterX);

    const defs = svg.append('defs');
    Object.entries(EDGE_STYLE).forEach(([type, style]) => {
      defs.append('marker')
        .attr('id', `mlarrow-${type}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 9)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M0,0 L10,5 L0,10 Z')
        .attr('fill', style.color);
    });

    const container = svg.append('g');

    // Row divider lines stay inside the zoomed/panned container (they mark
    // exactly which row of nodes is which) but live in their own group, kept
    // OUT of the fit-to-view bbox measurement below (contentGroup) — a
    // divider is allowed to extend past the node/label content on purpose,
    // and including it in the measured extent would make the "real
    // content" bbox meaningless. The row NAME text does not live here at
    // all — see the pinned label layer below.
    const dividerGroup = container.append('g').attr('class', 'mlgraph-row-dividers');
    const dividerMargin = 400;
    ML_FAMILIES.forEach((fam) => {
      const y = chapterRowY[fam.id];
      if (y === undefined) return;
      dividerGroup.append('line')
        .attr('x1', minNodeX - dividerMargin).attr('x2', maxNodeX + dividerMargin)
        .attr('y1', y).attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.045)')
        .attr('stroke-width', 1);
    });

    const contentGroup = container.append('g').attr('class', 'mlgraph-content');
    const linkSel = contentGroup.append('g').attr('class', 'mlgraph-links')
      .selectAll('path')
      .data(simLinks)
      .join('path')
      .attr('class', (d) => `mlglink mlglink-${d.type}`)
      .attr('fill', 'none')
      .attr('d', (d) => edgePathD(d.source.x, d.source.y, d.target.x, d.target.y, diagramCenterX, d._sAngle, d._tAngle))
      .attr('stroke', (d) => EDGE_STYLE[d.type]?.color || 'rgba(255,255,255,0.14)')
      .attr('stroke-width', 1.4)
      .attr('stroke-opacity', 0.55)
      .attr('stroke-dasharray', (d) => EDGE_STYLE[d.type]?.dash || null)
      .attr('marker-end', (d) => `url(#mlarrow-${d.type})`);

    const nodeSel = contentGroup.append('g').attr('class', 'mlgraph-nodes')
      .selectAll('g.mlgnode')
      .data(simNodes)
      .join('g')
      .attr('class', 'mlgnode')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .call(
        d3.drag()
          .on('start', function (event, d) {
            const [x, y] = sourceClientXY(event.sourceEvent);
            d._dragStartClientX = x;
            d._dragStartClientY = y;
            d3.select(this).raise();
          })
          .on('drag', function (event, d) {
            d.x = event.x;
            d.y = event.y;
            d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
            linkSel
              .filter((l) => l.s === d.id || l.t === d.id)
              .attr('d', function (l) {
                const sx = l.s === d.id ? d.x : l.source.x;
                const sy = l.s === d.id ? d.y : l.source.y;
                const tx = l.t === d.id ? d.x : l.target.x;
                const ty = l.t === d.id ? d.y : l.target.y;
                return edgePathD(sx, sy, tx, ty, diagramCenterX, l._sAngle, l._tAngle);
              });
          })
          .on('end', (event, d) => {
            const [x, y] = sourceClientXY(event.sourceEvent);
            const dx = x - (d._dragStartClientX ?? x);
            const dy = y - (d._dragStartClientY ?? y);
            if (Math.hypot(dx, dy) < 6) {
              useMLUIStore.getState().selectModel(d.id);
            } else {
              repositionNodeLabels(d3.zoomTransform(svg.node()), width, height);
            }
          })
      )
      .on('mouseenter', function (event, d) {
        const tip = tooltipRef.current;
        if (!tip) return;
        tip.style.display = 'block';
        tip.innerHTML = `<b>${d.name}</b><div class="mlgtip-short">${d.short}</div>`;
        // Measured once per hover (content just changed, size is now
        // settled) — mousemove below reuses these cached dimensions rather
        // than forcing a synchronous layout on every pointer move.
        const r = tip.getBoundingClientRect();
        tip._w = r.width;
        tip._h = r.height;
      })
      .on('mousemove', (event) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        const b = wrap.getBoundingClientRect();
        const relX = event.clientX - b.left;
        const relY = event.clientY - b.top;
        const GAP = 14;
        const tw = tip._w || 160;
        const th = tip._h || 48;
        // Viewport-collision: default to the cursor's bottom-right, flip to
        // the opposite side of the cursor when that would clip past the
        // wrap's right/bottom edge, clamp near (not flip) on the left/top
        // since the cursor being that close to those edges already leaves
        // little room to flip into.
        let left = relX + GAP;
        let top = relY + GAP;
        if (left + tw > b.width) left = relX - tw - GAP;
        if (top + th > b.height) top = relY - th - GAP;
        if (left < 0) left = VIEWPORT_MARGIN;
        if (top < 0) top = VIEWPORT_MARGIN;
        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      });

    nodeSel.append('circle')
      .attr('class', 'mlgnode-circle')
      .attr('r', 12)
      .attr('fill', (d) => mlFamilyColorMap[d.ch])
      .attr('fill-opacity', 0.42)
      .attr('stroke', (d) => mlFamilyColorMap[d.ch])
      .attr('stroke-width', 2);

    const labelSel = nodeSel.append('text')
      .attr('class', 'mlgnode-label')
      .attr('dy', LABEL_DY_BELOW)
      .attr('text-anchor', 'middle')
      .text((d) => d.name)
      .attr('fill', 'rgba(244,247,251,0.72)');

    // Truncation safety net — full name always remains available via the
    // hover tooltip above, unaffected by this. Cache each label's final
    // (possibly truncated) rendered width for the viewport-collision check
    // below, which needs it on every pan/zoom without re-measuring the DOM.
    labelSel.each(function (d) {
      const el = this;
      if (el.getComputedTextLength() > MAX_LABEL_W) {
        let name = d.name;
        while (name.length > 3 && el.getComputedTextLength() > MAX_LABEL_W) {
          name = name.slice(0, -1);
          el.textContent = `${name}…`;
        }
      }
      d._labelW = el.getComputedTextLength();
    });

    // Node-label viewport collision: flip below->above when the label
    // would clip the bottom edge, shift the text-anchor toward the node
    // when it would clip the left/right edge. Node labels move freely with
    // pan/zoom/drag (unlike the pinned row headers below), so unlike those,
    // this has to be re-evaluated on every transform change rather than
    // solved once.
    function repositionNodeLabels(transform, w, h) {
      labelSel.each(function (d) {
        const screenX = transform.applyX(d.x);
        const screenY = transform.applyY(d.y);
        // A node whose own center is well past the viewport shouldn't have
        // its label dragged back on-screen to "rescue" it from clipping —
        // confirmed live: without this, a label for a node hundreds of
        // pixels off-screen got shifted far enough to land in the middle
        // of the viewport, disconnected from any visible node and
        // overlapping whatever real label was already there. If the node
        // itself isn't reasonably on-screen, hide its label instead.
        const nodeOffScreen = screenX < -NODE_R - 40 || screenX > w + NODE_R + 40
          || screenY < -NODE_R - 40 || screenY > h + NODE_R + 40;
        if (nodeOffScreen) {
          d3.select(this).style('display', 'none');
          return;
        }
        d3.select(this).style('display', null);
        const halfW = (d._labelW * transform.k) / 2;
        let anchor = 'middle';
        let dx = 0;
        const overflowLeft = VIEWPORT_MARGIN - (screenX - halfW);
        const overflowRight = (screenX + halfW) - (w - VIEWPORT_MARGIN);
        if (overflowLeft > 0) {
          anchor = 'start';
          // Not just a fixed nudge — a node can sit close enough to the
          // edge that a constant shift isn't enough to actually clear the
          // boundary. Use whichever is larger: the usual small "hug the
          // node" gap, or the exact overflow plus a buffer. Safe from the
          // same runaway-shift problem the off-screen check above guards
          // against, since a node close enough to still be on-screen only
          // ever needs a bounded shift.
          dx = Math.max(LABEL_DX_SHIFT, overflowLeft / transform.k + 8);
        } else if (overflowRight > 0) {
          anchor = 'end';
          dx = -Math.max(LABEL_DX_SHIFT, overflowRight / transform.k + 8);
        }
        const labelBelowBottomPx = screenY + (LABEL_DY_BELOW + 12) * transform.k;
        const dy = labelBelowBottomPx > h - VIEWPORT_MARGIN ? LABEL_DY_ABOVE : LABEL_DY_BELOW;
        d3.select(this).attr('text-anchor', anchor).attr('dx', dx).attr('dy', dy);
      });
    }

    // Fit-to-view from the ACTUAL rendered extent (nodes + labels + edge
    // curves), not a hand-estimated bounding box — the old fit used
    // computeHierarchicalLayout's bounds, which only reserves a fixed
    // margin tuned for Stats mode's short row labels/node names; ML mode's
    // longer strings could and did poke outside it, clipping at the SVG's
    // own edge. getBBox() on the content group measures real geometry, so
    // this stays correct regardless of future label-length changes.
    const contentBBox = contentGroup.node().getBBox();
    const PAD = 36;
    const bounds = {
      minX: contentBBox.x - PAD,
      maxX: contentBBox.x + contentBBox.width + PAD,
      minY: contentBBox.y - PAD,
      maxY: contentBBox.y + contentBBox.height + PAD,
    };

    function computeFit(w, h) {
      const diagramW = bounds.maxX - bounds.minX;
      const diagramH = bounds.maxY - bounds.minY;
      const raw = Math.min(w / diagramW, h / diagramH);
      const scale = Number.isFinite(raw) && raw > 0 ? raw : 1;
      return {
        scale,
        tx: w / 2 - ((bounds.minX + bounds.maxX) / 2) * scale,
        ty: h / 2 - ((bounds.minY + bounds.maxY) / 2) * scale,
      };
    }

    const initialFit = computeFit(width, height);
    const minZoom = Math.max(0.05, Math.min(0.2, initialFit.scale * 0.7));
    const maxZoom = Math.max(3, initialFit.scale * 4);

    // Row labels are pinned to the viewport's left edge — a sibling of
    // `container`, outside its zoom transform, with only their Y position
    // (not X) following pan/zoom. Structural navigation ("which family of
    // models am I looking at") must stay legible at any pan/zoom position,
    // not just the initial fit.
    const pinnedLabels = svg.append('g').attr('class', 'mlgraph-row-labels-pinned');
    const pinnedLabelSel = pinnedLabels.selectAll('text')
      .data(ML_FAMILIES.filter((fam) => chapterRowY[fam.id] !== undefined))
      .join('text')
      .attr('class', 'mlgraph-row-label')
      .attr('x', 14)
      .attr('fill', (d) => d.color)
      // level is irrelevant here — every ML_FAMILIES.name is blSame (same
      // text at both depths) — only lang varies, handled by the effect
      // below so a language toggle updates these without a full D3 remount.
      .text((d) => resolveT(d.name, 'beginner', langRef.current));
    pinnedLabelSelRef.current = pinnedLabelSel;

    function positionPinnedLabels(transform, h) {
      pinnedLabelSel
        .attr('y', (d) => transform.applyY(chapterRowY[d.id]) - 10)
        .style('display', (d) => {
          const y = transform.applyY(chapterRowY[d.id]);
          return y > -20 && y < h + 20 ? null : 'none';
        });
    }

    const zoomBehavior = d3.zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        positionPinnedLabels(event.transform, height);
        repositionNodeLabels(event.transform, width, height);
      });
    svg.call(zoomBehavior);

    let bgGestureStartTransform = null;
    zoomBehavior
      .on('start.bgdeselect', (event) => { bgGestureStartTransform = event.transform; })
      .on('end.bgdeselect', (event) => {
        const t0 = bgGestureStartTransform;
        const t1 = event.transform;
        const barelyMoved = t0 && Math.abs(t0.x - t1.x) < 2 && Math.abs(t0.y - t1.y) < 2 && Math.abs(t0.k - t1.k) < 0.001;
        if (barelyMoved) useMLUIStore.getState().selectModel(null);
      });

    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(initialFit.tx, initialFit.ty).scale(initialFit.scale));

    let needsRefit = width < 10 || height < 10;
    const onResize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      svg.attr('width', rect.width).attr('height', rect.height);
      if (needsRefit && rect.width > 10 && rect.height > 10) {
        needsRefit = false;
        const refit = computeFit(rect.width, rect.height);
        zoomBehavior.scaleExtent([Math.max(0.05, Math.min(0.2, refit.scale * 0.7)), Math.max(3, refit.scale * 4)]);
        svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(refit.tx, refit.ty).scale(refit.scale));
      } else {
        // Viewport resized (not just the initial hidden->visible reveal) —
        // pinned/node labels must re-check bounds even though `container`'s
        // own transform didn't change.
        const t = d3.zoomTransform(svg.node());
        positionPinnedLabels(t, height);
        repositionNodeLabels(t, width, height);
      }
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      svg.on('.zoom', null);
      svg.node().__zoom = d3.zoomIdentity;
    };
  }, []);

  // Selection highlight — dim everything except the selected node's direct
  // connections, mirroring Stats mode's neighborhood-highlighting pattern.
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const nodeSel = svg.selectAll('g.mlgnode');
    const linkSel = svg.selectAll('path.mlglink');
    const unsubscribe = useMLUIStore.subscribe((state, prev) => {
      if (state.selectedModelId === prev.selectedModelId) return;
      const id = state.selectedModelId;
      if (!id) {
        nodeSel.style('opacity', null);
        linkSel.style('opacity', null);
        return;
      }
      const connected = new Set([id]);
      ML_LINKS.forEach((l) => {
        if (l.s === id) connected.add(l.t);
        if (l.t === id) connected.add(l.s);
      });
      nodeSel.style('opacity', (d) => (connected.has(d.id) ? 1 : 0.15));
      linkSel.style('opacity', (d) => (d.s === id || d.t === id ? 0.9 : 0.06));
    });
    return unsubscribe;
  }, []);

  // Pinned row labels are bilingual, but the graph itself is an imperative
  // D3 mount effect ([] deps) that doesn't re-run on a language toggle —
  // this keeps just the label text in sync without remounting the whole
  // graph (which would reset pan/zoom/drag state).
  useEffect(() => {
    if (pinnedLabelSelRef.current) {
      pinnedLabelSelRef.current.text((d) => resolveT(d.name, 'beginner', lang));
    }
  }, [lang]);

  return (
    <div className="mlgraph-canvas-wrap" ref={wrapRef}>
      <svg ref={svgRef} className="mlgraph-canvas-svg" />
      <div className="mlgraph-tooltip" ref={tooltipRef} />
    </div>
  );
}
