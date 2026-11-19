
/* Fichário: masonry real, com redistribuição entre colunas ao expandir um grimório. */
(() => {
  const grid = document.querySelector('#fichario .file-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll(':scope > .file-card'));
  if (!cards.length) return;
  let scheduled = false;
  function layout() {
    scheduled = false;
    const columns = window.matchMedia('(max-width:700px)').matches ? 1 : 2;
    const gap = 10;
    const width = grid.clientWidth;
    if (!width) return;
    const colWidth = (width - gap * (columns - 1)) / columns;
    const heights = Array(columns).fill(0);
    cards.forEach(card => {
      const col = heights.indexOf(Math.min(...heights));
      card.style.width = `${colWidth}px`;
      card.style.transform = `translate(${col * (colWidth + gap)}px, ${heights[col]}px)`;
      heights[col] += card.offsetHeight + gap;
    });
    grid.style.height = `${Math.max(...heights, 0) - gap}px`;
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(layout);
  }
  grid.classList.add('file-masonry');
  grid.addEventListener('toggle', e => {
    if (e.target.matches('details.file-grimoire')) schedule();
  }, true);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(grid);
    cards.forEach(card => observer.observe(card));
  } else {
    window.addEventListener('resize', schedule);
  }
  document.querySelectorAll('[data-page], nav a, .sidebar a').forEach(el => {
    el.addEventListener('click', () => setTimeout(schedule, 0));
  });
  schedule();
})();
