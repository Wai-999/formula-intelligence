import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ML_MODELS, ML_LINKS, ML_FAMILIES, mlFamilyColorMap } from '../../data/ml/models.js';
import { computeHierarchicalLayout } from '../graph/hierarchicalLayout.js';
import { useMLUIStore } from '../../store/useMLUIStore.js';
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

export default function MLRelationshipMap() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const { width, height } = wrap.getBoundingClientRect();
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();
    svg.on('.zoom', null);
    svg.node().__zoom = d3.zoomIdentity;

    // Model names ("Ridge / Lasso / Elastic Net", "Gradient Boosting
    // (general)") run much longer than Stats mode's formula names, so this
    // graph needs wider spacing than the shared layout's default — see the
    // optional params added to computeHierarchicalLayout for exactly this.
    const { positions, chapterRowY, bounds } = computeHierarchicalLayout(ML_MODELS, ML_LINKS, {
      columnSpacing: 150,
      rowSpacing: 110,
    });
    const simNodes = ML_MODELS.map((n) => ({ ...n, ...positions[n.id] }));
    const simLinks = ML_LINKS
      .map((l) => ({ ...l, source: positions[l.s], target: positions[l.t] }))
      .filter((l) => l.source && l.target);

    const diagramW = bounds.maxX - bounds.minX;
    const diagramH = bounds.maxY - bounds.minY;
    const rawFitScale = Math.min(width / diagramW, height / diagramH) * 0.94;
    const fitScale = Number.isFinite(rawFitScale) && rawFitScale > 0 ? rawFitScale : 1;
    const minZoom = Math.max(0.05, Math.min(0.2, fitScale * 0.7));
    const maxZoom = Math.max(3, fitScale * 4);

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

    const zoomBehavior = d3.zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => container.attr('transform', event.transform));
    svg.call(zoomBehavior);

    const labelGroup = container.append('g').attr('class', 'mlgraph-row-labels');
    ML_FAMILIES.forEach((fam) => {
      const y = chapterRowY[fam.id];
      if (y === undefined) return;
      labelGroup.append('line')
        .attr('x1', bounds.minX + 10).attr('x2', bounds.maxX)
        .attr('y1', y).attr('y2', y)
        .attr('stroke', 'rgba(255,255,255,0.045)')
        .attr('stroke-width', 1);
      labelGroup.append('text')
        .attr('x', bounds.minX + 10)
        .attr('y', y - 10)
        .attr('class', 'mlgraph-row-label')
        .attr('fill', fam.color)
        .text(fam.name);
    });

    const linkSel = container.append('g').attr('class', 'mlgraph-links')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('class', (d) => `mlglink mlglink-${d.type}`)
      .attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y)
      .attr('stroke', (d) => EDGE_STYLE[d.type]?.color || 'rgba(255,255,255,0.14)')
      .attr('stroke-width', 1.4)
      .attr('stroke-opacity', 0.55)
      .attr('stroke-dasharray', (d) => EDGE_STYLE[d.type]?.dash || null)
      .attr('marker-end', (d) => `url(#mlarrow-${d.type})`);

    const nodeSel = container.append('g').attr('class', 'mlgraph-nodes')
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
              .attr('x1', (l) => (l.s === d.id ? d.x : l.source.x))
              .attr('y1', (l) => (l.s === d.id ? d.y : l.source.y))
              .attr('x2', (l) => (l.t === d.id ? d.x : l.target.x))
              .attr('y2', (l) => (l.t === d.id ? d.y : l.target.y));
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

    nodeSel.append('text')
      .attr('class', 'mlgnode-label')
      .attr('dy', 26)
      .attr('text-anchor', 'middle')
      .text((d) => d.name)
      .attr('fill', 'rgba(244,247,251,0.72)');

    let bgGestureStartTransform = null;
    zoomBehavior
      .on('start.bgdeselect', (event) => { bgGestureStartTransform = event.transform; })
      .on('end.bgdeselect', (event) => {
        const t0 = bgGestureStartTransform;
        const t1 = event.transform;
        const barelyMoved = t0 && Math.abs(t0.x - t1.x) < 2 && Math.abs(t0.y - t1.y) < 2 && Math.abs(t0.k - t1.k) < 0.001;
        if (barelyMoved) useMLUIStore.getState().selectModel(null);
      });

    const tx = width / 2 - ((bounds.minX + bounds.maxX) / 2) * fitScale;
    const ty = height / 2 - ((bounds.minY + bounds.maxY) / 2) * fitScale;
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(tx, ty).scale(fitScale));

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
      svg.on('.zoom', null);
      svg.node().__zoom = d3.zoomIdentity;
    };
  }, []);

  // Selection highlight — dim everything except the selected node's direct
  // connections, mirroring Stats mode's neighborhood-highlighting pattern.
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const nodeSel = svg.selectAll('g.mlgnode');
    const linkSel = svg.selectAll('line.mlglink');
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

  return (
    <div className="mlgraph-canvas-wrap" ref={wrapRef}>
      <svg ref={svgRef} className="mlgraph-canvas-svg" />
      <div className="mlgraph-tooltip" ref={tooltipRef} />
    </div>
  );
}
