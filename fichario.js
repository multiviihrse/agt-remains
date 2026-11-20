
/* Fichário: masonry real, com redistribuição entre colunas ao expandir um grimório. */
(() => {
  const grid = document.querySelector('#fichario .file-grid');
  if (!grid) return;
  let cards = Array.from(grid.querySelectorAll(':scope > .file-card'));
  if (!cards.length) return;
  let scheduled = false;
  let ready = false;
  let loaded = false;
  let loading = null;
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
    if (!ready) { ready = true; grid.classList.add('file-masonry-ready'); }
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
  const fichaLink=p=>'#ficha/'+(p._demo?'demo':'aprovado')+'/'+encodeURIComponent(p.id);
  const tag = v => v ? '<span class="file-tag">'+esc(v)+'</span>' : '';
  function cardFor(p){
    const article=document.createElement('article');article.className='file-card';
    const abilities=Array.isArray(p.abilities)?p.abilities:[];
    const portrait=typeof p.photo_url==='string'&&(/^(https:\/\/|assets\/)/i.test(p.photo_url))?p.photo_url:'';
    article.innerHTML=`
      <span aria-hidden="true" class="file-frame-side file-frame-side-right"></span><span aria-hidden="true" class="file-frame-side file-frame-side-left"></span>
      <span aria-hidden="true" class="file-corner file-corner-br"></span><span aria-hidden="true" class="file-corner file-corner-bl"></span><span aria-hidden="true" class="file-corner file-corner-tr"></span><span aria-hidden="true" class="file-corner file-corner-tl"></span>
      <img alt="" aria-hidden="true" class="file-card-rune" src="assets/runas/fichario.svg">
      <div class="file-identity"><div class="file-portrait-frame">${portrait?'<img class="file-portrait-image" loading="lazy" alt="Retrato de '+esc(p.first_name)+'" src="'+esc(portrait)+'">':''}<img alt="" aria-hidden="true" class="file-portrait-ornament" src="assets/fichario/moldura-retrato.svg"></div>
      <div class="file-info"><h3 class="file-character-name"><a class="file-character-link" href="${esc(fichaLink(p))}">${esc([p.first_name,p.last_name].filter(Boolean).join(' '))}</a></h3><div class="file-tags"><span class="file-tag file-player-id">${esc(p.player_id||'JOGADOR')}</span>${tag(p.race)}${tag(p.age_text)}<span class="file-status" aria-label="Ativo" title="Ativo"><span class="file-status-dot is-active" aria-hidden="true"></span></span></div><p class="file-bio">${esc(p.biography)}</p></div></div>
      <details class="file-grimoire"><summary class="file-grimoire-title"><img alt="" aria-hidden="true" class="file-grimoire-ornament" src="assets/dice-ornaments/estrela.png"><span>Habilidades</span><span class="file-ability-count">(${abilities.length})</span><span class="file-grimoire-chevron">⌄</span></summary><ol>${abilities.map((ability,i)=>'<li class="file-power"><div class="file-power-name"><span>'+String(i+1).padStart(2,'0')+'.</span><strong>'+esc(ability.title)+'</strong></div><div class="file-tags">'+tag(ability.nature)+tag(ability.difficulty)+tag(ability.effect)+'</div><p>'+esc(ability.description)+'</p></li>').join('')}</ol></details>`;
    return article;
  }
  async function refreshApproved(force=false){
    if (loading) return loading;
    if (loaded && !force) { schedule(); return; }
    loading = (async()=>{try{
      const response=await fetch(endpoint,{headers:{apikey:key},cache:'no-store'});
      if(!response.ok)throw Error('HTTP '+response.status);
      const approved=await response.json();
      if(!Array.isArray(approved))throw Error('Resposta inválida');
      const fragment=document.createDocumentFragment();
      approved.forEach(p=>fragment.append(cardFor(p)));const demoResponse=await fetch('https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/agt_demo_characters?select=*&order=id.asc',{headers:{apikey:key},cache:'no-store'});if(demoResponse.ok){const demos=await demoResponse.json();if(Array.isArray(demos))demos.forEach(p=>fragment.append(cardFor({...p,_demo:true})));}
      grid.classList.remove('file-masonry-ready');
      ready = false;
      grid.replaceChildren(fragment);
      cards=Array.from(grid.children);
      loaded = true;
      cards.forEach(card=>window.agtObserveFileCard?.(card));
      if(!cards.length){grid.style.height='auto';grid.textContent='Nenhum personagem aprovado até o momento.';}
      else schedule();
    }catch(error){console.error('Fichário: não foi possível carregar personagens aprovados',error);}
    finally{loading=null;}})();
    return loading;
  }

  /* Página individual: seleciona um único personagem pelo endereço da ficha. */
  const detail=document.getElementById('ficha-content');
  async function showFicha(){
    if(!detail)return;
    const match=location.hash.match(/^#ficha\/(aprovado|demo)\/([^/?#]+)$/);
    if(!match)return;
    detail.textContent='Carregando ficha...';
    const demo=match[1]==='demo';const id=decodeURIComponent(match[2]);
    const table=demo?'agt_demo_characters':'agt_public_fichario';
    const url='https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/'+table+'?select=*&id=eq.'+encodeURIComponent(id)+'&limit=1';
    try{const res=await fetch(url,{headers:{apikey:key},cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();if(location.hash!=='#ficha/'+match[1]+'/'+match[2])return;const p=data[0];if(!p){detail.textContent='Personagem não encontrado.';return;}
      const name=[p.first_name,p.last_name].filter(Boolean).join(' ');
      const abilities=Array.isArray(p.abilities)?p.abilities:[];
      const portrait=typeof p.photo_url==='string'&&(p.photo_url.startsWith('https://')||p.photo_url.startsWith('assets/'))?p.photo_url:'';
      detail.innerHTML='<div class="ficha-header">'+(portrait?'<img class="ficha-portrait" src="'+esc(portrait)+'" alt="Retrato de '+esc(name)+'">':'')+'<div><span class="eyebrow">REGISTRO INDIVIDUAL</span><h2>'+esc(name)+'</h2><p>'+[p.player_id,p.race,p.age_text].filter(Boolean).map(esc).join(' · ')+'</p></div></div>'+
        [['História',p.biography],['Aparência',p.appearance],['Relações',p.relationships]].filter(x=>x[1]).map(x=>'<section class="ficha-block"><h3>'+x[0]+'</h3><p>'+esc(x[1])+'</p></section>').join('')+
        '<section class="ficha-block"><h3>Habilidades ('+abilities.length+')</h3>'+abilities.map((a,i)=>'<div class="ficha-ability"><h4>'+esc(a.title||'Habilidade '+(i+1))+'</h4><p>'+[a.nature,a.difficulty,a.effect].filter(Boolean).map(esc).join(' · ')+'</p><p>'+esc(a.description)+'</p></div>').join('')+'</section>';
    }catch(err){detail.textContent='Não foi possível carregar a ficha. Atualize a página para tentar novamente.';}
  }
  window.addEventListener('hashchange',showFicha);showFicha();
  refreshApproved();
  document.querySelectorAll('a[href$="#fichario"], a[href="#fichario"]').forEach(el=>el.addEventListener('click',()=>schedule()));
  window.addEventListener('pageshow',()=>schedule());
})();
