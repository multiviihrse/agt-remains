
/* Fichário: masonry real, com redistribuição entre colunas ao expandir um grimório. */
(() => {
  const grid = document.querySelector('#fichario .file-grid');
  if (!grid) return;
  let cards = Array.from(grid.querySelectorAll(':scope > .file-card'));
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
    window.agtObserveFileCard = card => observer.observe(card);
  } else {
    window.addEventListener('resize', schedule);
  }
  document.querySelectorAll('[data-page], nav a, .sidebar a').forEach(el => {
    el.addEventListener('click', () => setTimeout(schedule, 0));
  });
  schedule();
  const endpoint='https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/agt_public_fichario?select=*&order=reviewed_at.desc';
  const key='sb_publishable_u1UUMXQ-5ZiiFTF0u0xWbg_mLqsus0C';
  const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tag = v => v ? '<span class="file-tag">'+esc(v)+'</span>' : '';
  function cardFor(p){
    const article=document.createElement('article');article.className='file-card';
    const abilities=Array.isArray(p.abilities)?p.abilities:[];
    const portrait=typeof p.photo_url==='string'&&/^https:\/\//i.test(p.photo_url)?p.photo_url:'';
    article.innerHTML=`
      <span aria-hidden="true" class="file-frame-side file-frame-side-right"></span><span aria-hidden="true" class="file-frame-side file-frame-side-left"></span>
      <span aria-hidden="true" class="file-corner file-corner-br"></span><span aria-hidden="true" class="file-corner file-corner-bl"></span><span aria-hidden="true" class="file-corner file-corner-tr"></span><span aria-hidden="true" class="file-corner file-corner-tl"></span>
      <img alt="" aria-hidden="true" class="file-card-rune" src="assets/runas/fichario.svg">
      <div class="file-identity"><div class="file-portrait-frame">${portrait?'<img class="file-portrait-image" loading="lazy" alt="Retrato de '+esc(p.first_name)+'" src="'+esc(portrait)+'">':''}<img alt="" aria-hidden="true" class="file-portrait-ornament" src="assets/fichario/moldura-retrato.svg"></div>
      <div class="file-info"><h3 class="file-character-name">${esc([p.first_name,p.last_name].filter(Boolean).join(' '))}</h3><div class="file-tags"><span class="file-tag file-player-id">${esc(p.player_id||'JOGADOR')}</span>${tag(p.race)}${tag(p.age_text)}<span class="file-status" aria-label="Ativo" title="Ativo"><span class="file-status-dot is-active" aria-hidden="true"></span></span></div><p class="file-bio">${esc(p.biography)}</p></div></div>
      <details class="file-grimoire"><summary class="file-grimoire-title"><img alt="" aria-hidden="true" class="file-grimoire-ornament" src="assets/dice-ornaments/estrela.png"><span>Grimório</span><span>${String(abilities.length).padStart(2,'0')} HABILIDADES</span><span class="file-grimoire-chevron">⌄</span></summary><ol>${abilities.map((ability,i)=>'<li class="file-power"><div class="file-power-name"><span>'+String(i+1).padStart(2,'0')+'.</span><strong>'+esc(ability.title)+'</strong></div><div class="file-tags">'+tag(ability.nature)+tag(ability.difficulty)+tag(ability.effect)+'</div><p>'+esc(ability.description)+'</p></li>').join('')}</ol></details>`;
    return article;
  }
  async function refreshApproved(){
    try{
      const response=await fetch(endpoint,{headers:{apikey:key},cache:'no-store'});
      if(!response.ok)throw Error('HTTP '+response.status);
      const approved=await response.json();
      if(!Array.isArray(approved))throw Error('Resposta inválida');
      const fragment=document.createDocumentFragment();
      approved.forEach(p=>fragment.append(cardFor(p)));
      grid.replaceChildren(fragment);
      cards=Array.from(grid.children);
      cards.forEach(card=>window.agtObserveFileCard?.(card));
      if(!cards.length){grid.style.height='auto';grid.textContent='Nenhum personagem aprovado até o momento.';}
      else schedule();
    }catch(error){console.error('Fichário: não foi possível carregar personagens aprovados',error);}
  }
  refreshApproved();
  document.querySelectorAll('a[href$="#fichario"], a[href="#fichario"]').forEach(el=>el.addEventListener('click',refreshApproved));
  window.addEventListener('pageshow',refreshApproved);
})();
