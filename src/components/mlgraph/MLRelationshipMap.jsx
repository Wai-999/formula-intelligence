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
const EDGE_STYLE = {
  extends: { color: 'var(--accent)', dash: null },
  competes: { color: 'var(--warning)', dash: '3,3' },
  combines: { color: 'var(--success)', dash: '1,4' },
};

function sourceClientXY(sourceEvent) {
  const touch = sourceEvent.changedTouches?.[0] || sourceEvent.touches?.[0];
  return touch ? [touch.clientX, touch.clientY] : [sourceEvent.clientX, sourceEvent.clientY];
}

// Node circles are drawn with r=NODE_R (below); edges were previously drawn
// straight from center to center, so every arrowhead marker landed exactly
// on the target's center — entirely hidden under the (semi-opaque) node
// circle rather than visibly pointing into it from outside, which is what
// read as "dislocated arrows" (the marker was there, just invisible, so
// the thin line-under-node made nearby unrelated markers look detached).
// Trimming both endpoints back along the source→target unit vector by the
// node radius (+ a small gap) fixes this: the line now visibly stops at
// each node's boundary and the arrowhead renders in the open, just outside
// the target circle, pointing in.
const NODE_R = 12;
const EDGE_GAP = 3;
// Must match the columnSpacing/rowSpacing passed to computeHierarchicalLayout
// below — kept as named constants here too since edge-curving and label
// truncation both need to reason about row/column geometry independently
// of the layout call itself.
const ROW_SPACING = 110;
const COLUMN_SPACING = 150;
// FIX_LOG.md B.1: a generous safety net, not a default-triggering rule —
// only the single longest current label ("Bayesian Structural Time Series /
// Bayesian NNs", ~208 canvas-units) exceeds this. A getBoundingClientRect
// sweep across all 32 nodes confirmed zero real label collisions in the
// static layout even with several labels wider than their own column slot
// (centered text mostly overhangs into empty inter-column gaps, not into a
// neighbor's label) — so truncation stays a defensive fallback for outliers
// and for whatever a learner drags nodes into, not a rewrite of the whole
// label set.
const MAX_LABEL_W = 190;

function trimTowardPoint(fromX, fromY, towardX, towardY, trim) {
  const dx = towardX - fromX;
  const dy = towardY - fromY;
  const dist = Math.hypot(dx, dy) || 1;
  return { x: fromX + (dx / dist) * trim, y: fromY + (dy / dist) * trim };
}

// FIX_LOG.md B.1: this is a fixed hierarchical (Sugiyama-style) layout, not
// a force simulation — there's no "settle" step where physics could push
// edges around nodes. Long-distance edges (2+ rows apart) drawn as straight
// lines were the main source of "edges slicing through unrelated nodes":
// with columns barycenter-ordered for their IMMEDIATE row only, an edge
// skipping several rows has no reason to stay clear of whatever sits in the
// rows it passes through. Bowing those edges into a quadratic curve that
// bulges toward the diagram's outer margin (away from the dense center
// columns, into space the centered-row layout already leaves empty for
// narrower rows) routes them clear of intermediate nodes in the common case
// and reads as deliberate lanes rather than a tangle. Same-row/adjacent-row
// edges (the majority) get zero offset, which collapses the same formula to
// a plain straight line — pixel-identical to the old rendering for those.
function edgeControlPoint(sx, sy, tx, ty, diagramCenterX) {
  const midX = (sx + tx) / 2;
  const midY = (sy + ty) / 2;
  const rowDist = Math.abs(ty - sy) / ROW_SPACING;
  if (rowDist < 1.5) return { x: midX, y: midY };
  const offset = Math.min(70, 18 * rowDist);
  const side = midX < diagramCenterX ? -1 : 1;
  return { x: midX + side * offset, y: midY };
}

function edgePathD(sx, sy, tx, ty, diagramCenterX) {
  const cp = edgeControlPoint(sx, sy, tx, ty, diagramCenterX);
  const trim = NODE_R + EDGE_GAP;
  // Trim along the tangent at each end (control-point → endpoint), not the
  // raw source→target vector, so the trim stays correct once the edge is
  // curved — for a quadratic bezier the tangent at P2 is CP→P2 and at P0 is
  // P0→CP, which is exactly what trimTowardPoint(endpoint, cp, ...) gives.
  const p0 = trimTowardPoint(sx, sy, cp.x, cp.y, trim);
  const p2 = trimTowardPoint(tx, ty, cp.x, cp.y, trim);
  return `M${p0.x},${p0.y} Q${cp.x},${cp.y} ${p2.x},${p2.y}`;
}

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
    // positionPinnedLabels' visibility check needs the CURRENT size at the
    // time it runs, not this stale mount-time snapshot, or pinned labels
    // stay hidden forever on any page that happened to lazy-mount hidden
    // (FIX_LOG.md B.1 — caught by the pinned labels never appearing at all
    // on first real visit, an easy one to miss since the graph itself
    // renders correctly using the already-live-corrected fit transform).
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
      .attr('d', (d) => edgePathD(d.source.x, d.source.y, d.target.x, d.target.y, diagramCenterX))
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
                return edgePathD(sx, sy, tx, ty, diagramCenterX);
              });
          })
          .on('end', (event, d) => {
            const [x, y] = sourceClientXY(event.sourceEvent);
            const dx = x - (d._dragStartClientX ?? x);
            const dy = y - (d._dragStartClientY ?? y);
            if (Math.hypot(dx, dy) < 6) {
              useMLUIStore.getState().selectModel(d.id);
            }
          })
      )
      .on('mouseenter', (event, d) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        tip.style.display = 'block';
        tip.innerHTML = `<b>${d.name}</b><div class="mlgtip-short">${d.short}</div>`;
      })
      .on('mousemove', (event) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        const b = wrap.getBoundingClientRect();
        tip.style.left = `${event.clientX - b.left + 14}px`;
        tip.style.top = `${event.clientY - b.top + 14}px`;
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
      .attr('dy', 26)
      .attr('text-anchor', 'middle')
      .text((d) => d.name)
      .attr('fill', 'rgba(244,247,251,0.72)');

    // Truncation safety net (FIX_LOG.md B.1) — full name always remains
    // available via the hover tooltip above, unaffected by this.
    labelSel.each(function (d) {
      const el = this;
      if (el.getComputedTextLength() <= MAX_LABEL_W) return;
      let name = d.name;
      while (name.length > 3 && el.getComputedTextLength() > MAX_LABEL_W) {
        name = name.slice(0, -1);
        el.textContent = `${name}…`;
      }
    });

    // Fit-to-view from the ACTUAL rendered extent (nodes + labels + edge
    // curves), not a hand-estimated bounding box (FIX_LOG.md B.1) — the old
    // fit used computeHierarchicalLayout's bounds, which only reserves a
    // fixed margin tuned for Stats mode's short row labels/node names; ML
    // mode's longer strings (e.g. "Exponential Smoothing / Holt-Winters")
    // could and did poke outside it, clipping at the SVG's own edge.
    // getBBox() on the content group measures real geometry, so this stays
    // correct regardless of future label-length changes.
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
    // not just the initial fit — embedding them in the pannable canvas
    // meant panning left, or simply not having enough gutter width for ML
    // mode's longer category names (vs. the Stats-mode-tuned default),
    // clipped them into unreadable fragments (FIX_LOG.md B.1).
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

    function positionPinnedLabels(transform) {
      pinnedLabelSel
        .attr('y', (d) => transform.applyY(chapterRowY[d.id]) - 10)
        .style('display', (d) => {
          const y = transform.applyY(chapterRowY[d.id]);
          return y > -20 && y < height + 20 ? null : 'none';
        });
    }

    const zoomBehavior = d3.zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        positionPinnedLabels(event.transform);
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
        // pinned labels' Y must track it even though `container`'s own
        // transform didn't change.
        positionPinnedLabels(d3.zoomTransform(svg.node()));
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

  // Pinned row labels (FIX_LOG.md Section C.3) are bilingual, but the graph
  // itself is an imperative D3 mount effect ([] deps) that doesn't re-run
  // on a language toggle — this keeps just the label text in sync without
  // remounting the whole graph (which would reset pan/zoom/drag state).
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
