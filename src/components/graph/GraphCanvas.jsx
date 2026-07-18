import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { nodes, links, CHAPTERS, chapterColorMap } from '../../data/index.js';
import { getPrereqChain } from '../../data/prereqChains.js';
import { useUIStore } from '../../store/useUIStore.js';
import { useMasteryStore } from '../../store/useMasteryStore.js';
import { computeHierarchicalLayout } from './hierarchicalLayout.js';
import './GraphCanvas.css';

function resolveFullChain(targetId) {
  const raw = getPrereqChain(targetId);
  const ancestors = raw[raw.length - 1] === targetId ? raw.slice(0, -1) : raw;
  return [...ancestors, targetId];
}

// d3.drag/d3.zoom's own gesture 'start'/'end' events both expose the raw
// native event as sourceEvent, but its shape differs: mouse events carry
// clientX/Y directly, touch events carry them on changedTouches (touchend
// has already dropped the lifted finger from `touches` by the time it fires).
function sourceClientXY(sourceEvent) {
  const touch = sourceEvent.changedTouches?.[0] || sourceEvent.touches?.[0];
  return touch ? [touch.clientX, touch.clientY] : [sourceEvent.clientX, sourceEvent.clientY];
}

const STATE_STROKE = {
  gold: '#fbbf24',
  green: '#34d399',
  blue: '#60a5fa',
  red: '#f87171',
  none: 'rgba(255,255,255,0.22)',
};

const LINK_STYLE = {
  prereq: { color: '#8b5cf6', dash: null, arrow: true, flow: true },
  extends: { color: '#22d3ee', dash: null, arrow: true, flow: false },
  applies: { color: '#34d399', dash: null, arrow: true, flow: false },
  nonparam: { color: '#f472b6', dash: '3,3', arrow: true, flow: false },
  family: { color: '#fbbf24', dash: '1,4', arrow: false, flow: false },
};

export default function GraphCanvas() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const d3State = useRef({});
  const tooltipRef = useRef(null);
  const traceTimeouts = useRef([]);

  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const chapterFilter = useUIStore((s) => s.chapterFilter);
  const traceChain = useUIStore((s) => s.traceChain);
  const getNodeState = useMasteryStore((s) => s.getNodeState);
  const recallData = useMasteryStore((s) => s.recallData);

  // Build the diagram once — a static hierarchical layout, not a physics sim.
  useEffect(() => {
    const wrap = wrapRef.current;
    const { width, height } = wrap.getBoundingClientRect();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    // React StrictMode double-invokes this effect on mount; d3-zoom stores its
    // transform on the DOM node itself (__zoom), which survives across that
    // double-invocation since the <svg> element isn't recreated. Reset it so
    // each run starts from a clean, predictable zoom state.
    svg.on('.zoom', null);
    svg.node().__zoom = d3.zoomIdentity;

    const outDegree = {};
    const inDegree = {};
    nodes.forEach((n) => { outDegree[n.id] = 0; inDegree[n.id] = 0; });
    links.forEach((l) => {
      outDegree[l.s] = (outDegree[l.s] || 0) + 1;
      inDegree[l.t] = (inDegree[l.t] || 0) + 1;
    });

    const { positions, chapterRowY, bounds } = computeHierarchicalLayout(nodes, links);
    const simNodes = nodes.map((n) => ({ ...n, ...positions[n.id] }));
    const simLinks = links
      .map((l) => ({ ...l, source: positions[l.s], target: positions[l.t] }))
      .filter((l) => l.source && l.target);

    // Computed up front so the zoom extent below can be sized around it —
    // on a small viewport or an unusually tall diagram, a fixed [0.2, 3]
    // extent could clamp the fit-to-view scale and leave the diagram
    // permanently cut off with no way to zoom out far enough to see it all.
    //
    // Guard against a 0×0 rect: on some fresh navigations this effect runs
    // before the flex layout has settled, so wrap.getBoundingClientRect()
    // can briefly report zero. An unguarded fitScale of 0 would make the
    // dynamic minZoom below (fitScale * 0.7) also 0 — removing the floor
    // that used to stop the graph from ever landing on scale(0) — so the
    // diagram would render fully invisible with no way to zoom back out.
    const diagramW = bounds.maxX - bounds.minX;
    const diagramH = bounds.maxY - bounds.minY;
    const rawFitScale = Math.min(width / diagramW, height / diagramH) * 0.94;
    const fitScale = Number.isFinite(rawFitScale) && rawFitScale > 0 ? rawFitScale : 1;
    const minZoom = Math.max(0.05, Math.min(0.2, fitScale * 0.7));
    const maxZoom = Math.max(3, fitScale * 4);

    const defs = svg.append('defs');
    Object.entries(LINK_STYLE).forEach(([type, style]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
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

    const zoomBehavior = d3.zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => container.attr('transform', event.transform));
    svg.call(zoomBehavior);

    // Row labels — the chapter gutter that makes "top = foundational,
    // bottom = advanced" readable at a glance.
    const labelGroup = container.append('g').attr('class', 'graph-row-labels');
    CHAPTERS.forEach((ch) => {
      const y = chapterRowY[ch.id];
      if (y === undefined) return;
      labelGroup.append('line')
        .attr('x1', bounds.minX + 10).attr('x2', bounds.maxX)
        .attr('y1', y).attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.045)')
        .attr('stroke-width', 1);
      labelGroup.append('text')
        .attr('x', bounds.minX + 10)
        .attr('y', y - 10)
        .attr('class', 'grow-label')
        .attr('fill', ch.color)
        .text(ch.name);
    });

    const linkSel = container
      .append('g')
      .attr('class', 'graph-links')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('class', (d) => `glink glink-${d.type}`)
      .attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y)
      .attr('stroke', (d) => LINK_STYLE[d.type]?.color || 'rgba(255,255,255,0.14)')
      .attr('stroke-width', (d) => (LINK_STYLE[d.type]?.flow ? 1.6 : 1.2))
      .attr('stroke-opacity', (d) => (LINK_STYLE[d.type]?.flow ? 0.55 : 0.32))
      .attr('stroke-dasharray', (d) => LINK_STYLE[d.type]?.dash || null)
      .attr('marker-end', (d) => (LINK_STYLE[d.type]?.arrow ? `url(#arrow-${d.type})` : null));

    const linksBySource = {};
    const linksByTarget = {};
    simLinks.forEach((l) => {
      (linksBySource[l.s] ||= []).push(l);
      (linksByTarget[l.t] ||= []).push(l);
    });

    const nodeGroup = container.append('g').attr('class', 'graph-nodes');

    const nodeSel = nodeGroup
      .selectAll('g.gnode')
      .data(simNodes)
      .join('g')
      .attr('class', (d) => {
        const isFork = outDegree[d.id] >= 2;
        const isCollider = inDegree[d.id] >= 2;
        return `gnode${isFork ? ' gnode-fork' : ''}${isCollider ? ' gnode-collider' : ''}`;
      })
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      // Click vs. drag is decided from d3.drag's OWN 'start'/'end' gesture,
      // not a native 'click' event and not a hand-rolled mousedown/mouseup
      // pair. Two reasons:
      //  1. d3-drag suppresses the native 'click' that follows *any* gesture
      //     it perceives as a drag (even a few jittery pixels, which real
      //     mice/trackpads produce on nearly every "click") — see nodrag.js's
      //     `yesdrag`, which installs a one-shot window 'click' swallower
      //     whenever clickDistance was exceeded. Any code depending on the
      //     native click event downstream of a d3.drag element inherits that
      //     suppression.
      //  2. d3-drag's internal "mousedown.drag" handler unconditionally calls
      //     event.stopImmediatePropagation() (see nopropagation() in
      //     noevent.js) on every mousedown, *before* any sibling mousedown
      //     listener added after `.call(d3.drag())` gets a chance to run.
      //     A hand-rolled mousedown/mouseup pair is therefore racing d3-drag
      //     for the same event and can silently stop firing if drag's setup
      //     internals ever throw first (they do, harmlessly for real trusted
      //     events, but not for synthetic ones missing `view`) or if version
      //     upgrades change internal ordering.
      // Reading start/end sidesteps both: it's the exact mechanism d3-drag
      // itself uses to know whether a gesture moved, already unifies mouse
      // and touch, and needs no separate touchstart/touchend handlers.
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
            (linksBySource[d.id] || []).forEach((l) => { l.source = d; });
            (linksByTarget[d.id] || []).forEach((l) => { l.target = d; });
            linkSel
              .attr('x1', (l) => l.source.x).attr('y1', (l) => l.source.y)
              .attr('x2', (l) => l.target.x).attr('y2', (l) => l.target.y);
          })
          .on('end', (event, d) => {
            const [x, y] = sourceClientXY(event.sourceEvent);
            const dx = x - (d._dragStartClientX ?? x);
            const dy = y - (d._dragStartClientY ?? y);
            if (Math.hypot(dx, dy) < 6) {
              useUIStore.getState().selectNode(d.id);
              useUIStore.getState().clearTraceChain();
            }
          })
      )
      .on('mouseenter', (event, d) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        const junction = outDegree[d.id] >= 2 && inDegree[d.id] >= 2
          ? 'Hub — fork & collider'
          : outDegree[d.id] >= 2
          ? 'Fork — branches to multiple formulas'
          : inDegree[d.id] >= 2
          ? 'Collider — multiple prerequisites converge here'
          : null;
        tip.style.display = 'block';
        tip.innerHTML = `<b>${d.name}</b><div class="gtip-formula">${d.formula}</div>${junction ? `<div class="gtip-junction">${junction}</div>` : ''}`;
      })
      .on('mousemove', (event) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        const bounds2 = wrap.getBoundingClientRect();
        let x = event.clientX - bounds2.left + 14;
        let y = event.clientY - bounds2.top + 14;
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      });

    // Collider ring — solid halo marking a convergence point (drawn first, sits outermost)
    nodeSel
      .filter((d) => inDegree[d.id] >= 2)
      .append('circle')
      .attr('class', 'gnode-collider-ring')
      .attr('r', 18)
      .attr('fill', 'none')
      .attr('stroke', '#f4f7fb')
      .attr('stroke-width', 1.4)
      .attr('stroke-opacity', 0.4);

    // Fork ring — dashed halo marking a branch point
    nodeSel
      .filter((d) => outDegree[d.id] >= 2)
      .append('circle')
      .attr('class', 'gnode-fork-ring')
      .attr('r', 14.5)
      .attr('fill', 'none')
      .attr('stroke', (d) => chapterColorMap[d.ch])
      .attr('stroke-width', 1.3)
      .attr('stroke-dasharray', '2,2.5')
      .attr('stroke-opacity', 0.75);

    nodeSel
      .append('circle')
      .attr('class', 'gnode-glow')
      .attr('r', 12)
      .attr('fill', (d) => chapterColorMap[d.ch])
      .attr('opacity', 0);

    nodeSel
      .append('circle')
      .attr('class', 'gnode-circle')
      .attr('r', (d) => (outDegree[d.id] >= 2 || inDegree[d.id] >= 2 ? 12.5 : 11))
      .attr('fill', (d) => chapterColorMap[d.ch])
      .attr('fill-opacity', 0.42)
      .attr('stroke-width', 2);

    nodeSel
      .append('text')
      .attr('class', 'gnode-label')
      .attr('dy', 26)
      .attr('text-anchor', 'middle')
      .text((d) => d.name)
      .attr('fill', 'rgba(244,247,251,0.72)');

    // Background deselect is read from zoomBehavior's OWN 'start'/'end'
    // gesture (same reasoning as the node click fix above: d3-zoom's
    // "mousedown.zoom" handler unconditionally calls
    // event.stopImmediatePropagation() before any hand-rolled sibling
    // mousedown listener would run). A "click" is a gesture whose transform
    // barely moved between start and end. Gestures that start on a node
    // never reach here at all — d3.drag's own stopImmediatePropagation on
    // the node keeps them from bubbling up to the svg's zoom handler — so
    // this only ever fires for genuine background interactions.
    let bgGestureStartTransform = null;
    zoomBehavior
      .on('start.bgdeselect', (event) => {
        bgGestureStartTransform = event.transform;
      })
      .on('end.bgdeselect', (event) => {
        const t0 = bgGestureStartTransform;
        const t1 = event.transform;
        const barelyMoved = t0 && Math.abs(t0.x - t1.x) < 2 && Math.abs(t0.y - t1.y) < 2 && Math.abs(t0.k - t1.k) < 0.001;
        if (barelyMoved) {
          useUIStore.getState().selectNode(null);
          useUIStore.getState().clearTraceChain();
        }
      });

    // Fit the entire curriculum into view on load — the whole point of this
    // layout is that it should read in one glance, not require scrolling.
    const tx = width / 2 - ((bounds.minX + bounds.maxX) / 2) * fitScale;
    const ty = height / 2 - ((bounds.minY + bounds.maxY) / 2) * fitScale;
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(tx, ty).scale(fitScale));

    d3State.current = { nodeSel, linkSel, linksBySource, linksByTarget };

    // If the rect was degenerate at setup, the fit above used a fallback
    // scale of 1, not a real fit. Correct it the moment a real size arrives.
    let needsRefit = width < 10 || height < 10;
    const onResize = () => {
      const rect = wrap.getBoundingClientRect();
      svg.attr('width', rect.width).attr('height', rect.height);
      if (needsRefit && rect.width > 10 && rect.height > 10) {
        needsRefit = false;
        const realFitScale = Math.min(rect.width / diagramW, rect.height / diagramH) * 0.94;
        const rtx = rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * realFitScale;
        const rty = rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * realFitScale;
        zoomBehavior.scaleExtent([Math.max(0.05, Math.min(0.2, realFitScale * 0.7)), Math.max(3, realFitScale * 4)]);
        svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(rtx, rty).scale(realFitScale));
      }
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      // Mirror the mount-time reset so a real unmount+remount (not just
      // StrictMode's dev-only double-invoke) also starts from clean zoom
      // state, rather than inheriting whatever __zoom this run leaves behind.
      svg.on('.zoom', null);
      svg.node().__zoom = d3.zoomIdentity;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Visual updates that don't require rebuilding the diagram — search/chapter
  // dimming plus neighborhood highlighting: selecting a node dims everything
  // except its direct connections, so a single formula's edges are readable
  // against the other 100+ on screen. Skipped while a chain trace owns the
  // view (that animation drives node/edge opacity itself).
  useEffect(() => {
    const { nodeSel, linkSel } = d3State.current;
    if (!nodeSel || traceChain) return;

    const q = searchQuery.trim().toLowerCase();

    const connectedIds = new Set();
    if (selectedNodeId) {
      links.forEach((l) => {
        if (l.s === selectedNodeId) connectedIds.add(l.t);
        if (l.t === selectedNodeId) connectedIds.add(l.s);
      });
    }

    nodeSel.each(function (d) {
      const g = d3.select(this);
      const { state } = getNodeState(d.id);
      const isSelected = d.id === selectedNodeId;
      const isNeighbor = connectedIds.has(d.id);
      const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.short?.toLowerCase().includes(q);
      const matchesChapter = !chapterFilter || d.ch === chapterFilter;
      const dimmed = !matchesSearch || !matchesChapter || (selectedNodeId && !isSelected && !isNeighbor);

      g.select('circle.gnode-circle')
        .attr('stroke', STATE_STROKE[state])
        .attr('fill-opacity', isSelected ? 0.65 : 0.42)
        .attr('stroke-width', isSelected ? 3 : 2);

      g.select('circle.gnode-glow')
        .attr('opacity', isSelected ? 0.5 : 0)
        .attr('r', isSelected ? 20 : 12);

      g.attr('opacity', dimmed ? 0.13 : 1);
      g.classed('gnode-selected', isSelected);
      g.select('text.gnode-label').attr('fill', isSelected ? '#f4f7fb' : 'rgba(244,247,251,0.72)');
    });

    if (linkSel) {
      linkSel
        .attr('opacity', (l) => (selectedNodeId ? (l.s === selectedNodeId || l.t === selectedNodeId ? 1 : 0.05) : 1))
        .attr('stroke-width', (l) => {
          const base = LINK_STYLE[l.type]?.flow ? 1.6 : 1.2;
          return selectedNodeId && (l.s === selectedNodeId || l.t === selectedNodeId) ? base + 1.2 : base;
        });
    }
  }, [selectedNodeId, searchQuery, chapterFilter, traceChain, getNodeState, recallData]);

  // Full prerequisite-chain trace — dims everything, then reveals each
  // ancestor in sequence from root to target, mirroring how the original
  // app's "Prerequisite Path Mode" made an entire lineage legible at once.
  useEffect(() => {
    const { nodeSel, linkSel } = d3State.current;
    traceTimeouts.current.forEach((t) => clearTimeout(t));
    traceTimeouts.current = [];
    if (!nodeSel || !linkSel || !traceChain) return;

    const fullChain = resolveFullChain(traceChain.targetId);
    const chainNodeSet = new Set(fullChain);
    // A curated chain reveals strictly step-to-step; the fallback (direct
    // prereqs with no curated ordering) has every ancestor pointing straight
    // at the target rather than at each other — so instead of assuming a
    // specific sequential edge pattern, reveal any real edge the moment BOTH
    // its endpoints have appeared in the reveal sequence.
    const revealedSet = new Set();

    // Dim everything immediately, before the staggered reveal begins.
    nodeSel.attr('opacity', 0.08);
    linkSel.attr('opacity', 0.04);

    fullChain.forEach((id, i) => {
      const delay = 250 + i * 550;
      const t = setTimeout(() => {
        revealedSet.add(id);
        nodeSel.filter((d) => d.id === id)
          .attr('opacity', 1)
          .select('circle.gnode-circle')
          .attr('stroke-width', 3);
        linkSel.filter((l) => chainNodeSet.has(l.s) && chainNodeSet.has(l.t) && revealedSet.has(l.s) && revealedSet.has(l.t))
          .attr('opacity', 0.95)
          .attr('stroke-width', (l) => (LINK_STYLE[l.type]?.flow ? 2.4 : 2));
      }, delay);
      traceTimeouts.current.push(t);
    });

    return () => {
      traceTimeouts.current.forEach((t) => clearTimeout(t));
      traceTimeouts.current = [];
      // Only reset opacity if the diagram is still mounted with the same
      // selections — a tab switch or unmount tears the DOM down separately.
      if (d3State.current.nodeSel === nodeSel) {
        nodeSel.attr('opacity', null);
        linkSel.attr('opacity', null);
      }
    };
  }, [traceChain]);

  return (
    <div className="graph-canvas-wrap" ref={wrapRef}>
      <svg ref={svgRef} className="graph-canvas-svg" />
      <div className="graph-tooltip" ref={tooltipRef} />
      <div className="graph-legend">
        <div className="glegend-title">Connections</div>
        <div className="glegend-row"><span className="glegend-swatch" style={{ background: '#8b5cf6' }} /> Prerequisite</div>
        <div className="glegend-row"><span className="glegend-swatch" style={{ background: '#22d3ee' }} /> Extends</div>
        <div className="glegend-row"><span className="glegend-swatch" style={{ background: '#34d399' }} /> Applies</div>
        <div className="glegend-row"><span className="glegend-swatch" style={{ background: '#f472b6' }} /> Nonparametric alt.</div>
        <div className="glegend-row"><span className="glegend-swatch" style={{ background: '#fbbf24' }} /> Family</div>
        <div className="glegend-divider" />
        <div className="glegend-row"><span className="glegend-ring glegend-ring-fork" /> Fork — branches out</div>
        <div className="glegend-row"><span className="glegend-ring glegend-ring-collider" /> Collider — converges in</div>
      </div>
    </div>
  );
}
