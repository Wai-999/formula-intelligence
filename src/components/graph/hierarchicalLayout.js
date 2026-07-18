const ROW_SPACING = 96;
const COLUMN_SPACING = 68;

// Layered (Sugiyama-style) layout: each chapter is a row, ordered top to
// bottom. Columns within a row are ordered by the barycenter of each node's
// connections to already-placed earlier rows, which keeps prerequisite edges
// flowing downward with minimal crossings instead of a physics-settled tangle.
export function computeHierarchicalLayout(nodes, links) {
  const byChapter = {};
  nodes.forEach((n) => {
    if (!byChapter[n.ch]) byChapter[n.ch] = [];
    byChapter[n.ch].push(n.id);
  });
  const chapterIds = Object.keys(byChapter).map(Number).sort((a, b) => a - b);

  const xIndex = {};

  chapterIds.forEach((ch) => {
    let order = byChapter[ch];
    const hasEarlierPositions = Object.keys(xIndex).length > 0;

    if (hasEarlierPositions) {
      const withBary = order.map((id, origIdx) => {
        const neighborXs = [];
        links.forEach((l) => {
          if (l.s === id && xIndex[l.t] !== undefined) neighborXs.push(xIndex[l.t]);
          if (l.t === id && xIndex[l.s] !== undefined) neighborXs.push(xIndex[l.s]);
        });
        const bary = neighborXs.length ? neighborXs.reduce((a, b) => a + b, 0) / neighborXs.length : null;
        return { id, bary, origIdx };
      });
      withBary.sort((a, b) => {
        if (a.bary === null && b.bary === null) return a.origIdx - b.origIdx;
        if (a.bary === null) return 1;
        if (b.bary === null) return -1;
        return a.bary - b.bary;
      });
      order = withBary.map((item) => item.id);
    }

    order.forEach((id, i) => { xIndex[id] = i; });
    byChapter[ch] = order;
  });

  const maxRowCount = Math.max(...chapterIds.map((ch) => byChapter[ch].length));
  const diagramWidth = (maxRowCount - 1) * COLUMN_SPACING;

  const positions = {};
  chapterIds.forEach((ch, rowIdx) => {
    const order = byChapter[ch];
    const rowWidth = (order.length - 1) * COLUMN_SPACING;
    const offsetX = (diagramWidth - rowWidth) / 2;
    order.forEach((id, i) => {
      positions[id] = {
        x: offsetX + i * COLUMN_SPACING,
        y: rowIdx * ROW_SPACING,
      };
    });
  });

  const chapterRowY = Object.fromEntries(chapterIds.map((ch, rowIdx) => [ch, rowIdx * ROW_SPACING]));

  return {
    positions,
    chapterRowY,
    bounds: {
      minX: -170, // room for the left-side chapter label gutter
      maxX: diagramWidth + 40,
      minY: -40,
      maxY: (chapterIds.length - 1) * ROW_SPACING + 40,
    },
  };
}
