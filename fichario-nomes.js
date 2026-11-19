/* Dimensiona cada nome para preencher horizontalmente sua coluna,
   sem ultrapassar a altura de texto de 20px. */
(() => {
  const names = [...document.querySelectorAll('#fichario .file-info .file-character-name')];
  if (!names.length) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let queued = false;
  function fit() {
    queued = false;
    for (const el of names) {
      const width = el.clientWidth;
      if (!width || !ctx) continue;
      const style = getComputedStyle(el);
      const family = style.fontFamily || '"Beth Ellen", cursive';
      const weight = style.fontWeight || '400';
      ctx.font = `${weight} 20px ${family}`;
      const measured = ctx.measureText(el.textContent.trim()).width;
      const size = measured ? Math.min(20, 20 * Math.max(0, width - 2) / measured) : 20;
      el.style.fontSize = `${Math.max(1, size).toFixed(2)}px`;
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(fit);
  }
  if (document.fonts?.ready) document.fonts.ready.then(schedule);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    names.forEach(el => observer.observe(el.parentElement));
  } else window.addEventListener('resize', schedule);
  schedule();
})();
