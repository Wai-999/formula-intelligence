import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { nodeById, chapterColorMap } from '../../data/index.js';
import { useLearningPathStore } from '../../store/useLearningPathStore.js';
import './MiniPrereqGraph.css';

export default function MiniPrereqGraph({ chain, targetId, focusId, onFocusNode }) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const nodeSelRef = useRef(null);
  const mastery = useLearningPathStore((s) => s.mastery);
  const getState = useLearningPathStore((s) => s.getState);

  const fullChain = useMemo(() => [...chain, targetId], [chain, targetId]);
  const chainKey = fullChain.join('|');

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    if (fullChain.length === 0) return;

    const W = wrap.clientWidth || 900;
    const H = Math.max(wrap.clientHeight, 260);
    svg.attr('viewBox', `0 0 ${W} ${H}`);

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arr-prereq')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'rgba(139,92,246,.6)');

    const miniNodes = fullChain.map((id) => ({ id, ...(nodeById[id] || { name: id }) }));
    const miniLinks = [];
    for (let i = 0; i < fullChain.length - 1; i++) {
      miniLinks.push({ source: fullChain[i], target: fullChain[i + 1] });
    }

    const xStep = W / (fullChain.length + 1);
    miniNodes.forEach((d, i) => {
      d.x = xStep * (i + 1);
      d.y = H / 2;
    });

    const g = svg.append('g');

    g
      .append('g')
      .selectAll('line')
      .data(miniLinks)
      .join('line')
      .attr('stroke', 'rgba(139,92,246,.5)')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arr-prereq)')
      .attr('x1', (d) => miniNodes.find((n) => n.id === d.source)?.x || 0)
      .attr('y1', (d) => miniNodes.find((n) => n.id === d.source)?.y || 0)
      .attr('x2', (d) => miniNodes.find((n) => n.id === d.target)?.x || 0)
      .attr('y2', (d) => miniNodes.find((n) => n.id === d.target)?.y || 0);

    const nodeSel = g
      .append('g')
      .selectAll('.lp-mini-node')
      .data(miniNodes)
      .join('g')
      .attr('class', 'lp-mini-node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onFocusNode(d.id))
      .on('mouseenter', (event, d) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        tip.style.display = 'block';
        tip.innerHTML = `<b>${d.name}</b><div class="lp-mini-tip-formula">${d.short || d.formula || ''}</div>`;
      })
      .on('mousemove', (event) => {
        const tip = tooltipRef.current;
        if (!tip) return;
        const bounds = wrap.getBoundingClientRect();
        tip.style.left = `${event.clientX - bounds.left + 14}px`;
        tip.style.top = `${event.clientY - bounds.top - 6}px`;
      })
      .on('mouseleave', () => {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      });

    nodeSel.each(function (d, i) {
      const self = d3.select(this);
      self.style('opacity', 0);
      setTimeout(() => self.style('opacity', 1), i * 500);
    });

    nodeSel
      .append('circle')
      .attr('r', (d) => (d.id === targetId ? 28 : 22))
      .attr('fill', (d) => `${chapterColorMap[d.ch] || '#6b7280'}33`)
      .attr('stroke-width', (d) => (d.id === targetId ? 3 : 2));

    nodeSel
      .append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .text((d) => (d.name.length > 14 ? `${d.name.slice(0, 12)}…` : d.name));

    nodeSelRef.current = nodeSel;
    updateNodeStyling();

    const onResize = () => {
      const rect = wrap.getBoundingClientRect();
      svg.attr('viewBox', `0 0 ${rect.width} ${Math.max(rect.height, 260)}`);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainKey]);

  function updateNodeStyling() {
    const nodeSel = nodeSelRef.current;
    if (!nodeSel) return;
    nodeSel.each(function (d) {
      const g = d3.select(this);
      const state = getState(d.id);
      const isTarget = d.id === targetId;
      let stroke = chapterColorMap[d.ch] || '#6b7280';
      if (isTarget) stroke = '#a78bfa';
      else if (state === 'ma') stroke = '#34d399';
      else if (state === 'ip') stroke = '#fbbf24';

      g.select('circle').attr('stroke', stroke);
      g.classed('lp-mn-focus', d.id === focusId);
      g.classed('lp-mn-mastered', state === 'ma' && !isTarget);
      g.classed('lp-mn-target', isTarget);
    });
  }

  useEffect(() => {
    updateNodeStyling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId, mastery]);

  return (
    <div className="lp-mini-graph" ref={wrapRef}>
      <svg ref={svgRef} className="lp-mini-svg" />
      <div className="lp-mini-tip" ref={tooltipRef} />
    </div>
  );
}
