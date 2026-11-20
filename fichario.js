
/* Fichário: masonry real, com redistribuição entre colunas ao expandir um grimório. */
(() => {
  const grid = document.querySelector('#fichario .file-grid');
  if (!grid) return;
  // As colunas são gerenciadas pelo CSS, sem medições contínuas em JavaScript.
  let loaded=false;
  let loading=null;
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
      <details class="file-grimoire"><summary class="file-grimoire-title"><img alt="" aria-hidden="true" class="file-grimoire-ornament" src="assets/dice-ornaments/estrela.png"><span>HABILIDADES</span><span class="file-ability-count">(${abilities.length})</span><span class="file-grimoire-chevron">⌄</span></summary><ol>${abilities.map((ability,i)=>'<li class="file-power"><div class="file-power-name"><span>'+String(i+1).padStart(2,'0')+'.</span><strong>'+esc(ability.title)+'</strong></div><div class="file-tags">'+tag(ability.nature)+tag(ability.difficulty)+tag(ability.effect)+'</div><p>'+esc(ability.description)+'</p></li>').join('')}</ol></details>`;
    return article;
  }
  async function refreshApproved(force=false){
    if (loading) return loading;
    if (loaded && !force) return;
    loading = (async()=>{try{
      const response=await fetch(endpoint,{headers:{apikey:key},cache:'no-store'});
      if(!response.ok)throw Error('HTTP '+response.status);
      const approved=await response.json();
      if(!Array.isArray(approved))throw Error('Resposta inválida');
      const fragment=document.createDocumentFragment();
      approved.forEach(p=>fragment.append(cardFor(p)));const demoResponse=await fetch('https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/agt_demo_characters?select=*&order=id.asc',{headers:{apikey:key},cache:'no-store'});if(demoResponse.ok){const demos=await demoResponse.json();if(Array.isArray(demos))demos.forEach(p=>fragment.append(cardFor({...p,_demo:true})));}
      grid.replaceChildren(fragment);
      loaded=true;
      if(!grid.children.length)grid.textContent='Nenhum personagem aprovado até o momento.';
    }catch(error){console.error('Fichário: não foi possível carregar personagens aprovados',error);}
    finally{loading=null;}})();
    return loading;
  }

  /* Ficha individual: dados do personagem e histórico global de ações. */
  const detail=document.getElementById('ficha-content');
  let currentDetail=0;
  async function loadActions(name,container,token){
    const normalized=name.trim().split(/\s+/).join(' ');
    const all=[];let offset=0;
    try{
      while(true){
        const url='https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/dice_rolls?select=created_at,character_name,action_name,dice_count,dice_sides,rolls,modifier,difficulty&character_name=ilike.'+encodeURIComponent(normalized)+'&order=created_at.desc&limit=1000&offset='+offset;
        const response=await fetch(url,{headers:{apikey:key},cache:'no-store'});
        if(!response.ok)throw Error('HTTP '+response.status);
        const rows=await response.json();if(token!==currentDetail)return;
        all.push(...rows);if(rows.length<1000)break;offset+=1000;
      }
      container.innerHTML=all.length?'<p class="ficha-action-total">'+all.length+' registro(s)</p>'+all.map(r=>{
        const total=(Array.isArray(r.rolls)?r.rolls.reduce((sum,n)=>sum+Number(n),0):0)+Number(r.modifier||0);
        const date=new Date(r.created_at).toLocaleString('pt-BR');
        return '<article class="ficha-action"><time>'+esc(date)+'</time><h4>'+esc(r.action_name)+'</h4><p>'+esc(r.dice_count)+'d'+esc(r.dice_sides)+' · '+esc((r.rolls||[]).join(' + '))+(r.modifier?' + '+esc(r.modifier):'')+' = <strong>'+esc(total)+'</strong> · DIF '+esc(r.difficulty)+'</p></article>';
      }).join(''):'<p>Nenhuma ação registrada para este personagem.</p>';
    }catch(err){if(token===currentDetail)container.textContent='Não foi possível carregar as ações.';}
  }
  async function showFicha(){
    if(!detail)return;
    const match=new RegExp('^#ficha/(aprovado|demo)/([^/?#]+)$').exec(location.hash);
    if(!match){currentDetail++;return;}
    const token=++currentDetail;
    detail.textContent='Carregando ficha...';
    const demo=match[1]==='demo',id=decodeURIComponent(match[2]);
    const table=demo?'agt_demo_characters':'agt_public_fichario';
    const url='https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/'+table+'?select=*&id=eq.'+encodeURIComponent(id)+'&limit=1';
    try{
      const res=await fetch(url,{headers:{apikey:key},cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
      const data=await res.json();if(token!==currentDetail)return;
      const p=data[0];if(!p){detail.textContent='Personagem não encontrado.';return;}
      const name=[p.first_name,p.last_name].filter(Boolean).join(' ');
      const abilities=Array.isArray(p.abilities)?p.abilities:[];
      const portrait=typeof p.photo_url==='string'&&(p.photo_url.startsWith('https://')||p.photo_url.startsWith('assets/'))?p.photo_url:'';
      const field=(title,value)=>'<section class="ficha-block"><h3>'+title+'</h3><p>'+esc(value||'Informação não disponível.')+'</p></section>';
      detail.innerHTML='<header class="ficha-header"><div class="ficha-portrait-frame">'+(portrait?'<img class="ficha-portrait-image" src="'+esc(portrait)+'" alt="Retrato de '+esc(name)+'">':'')+'<img class="ficha-portrait-ornament" src="assets/fichario/moldura-retrato.svg" alt="" aria-hidden="true"></div><div class="ficha-heading"><span class="eyebrow">REGISTRO INDIVIDUAL</span><h2>'+esc(name)+'</h2><div class="file-tags">'+tag(p.player_id||'JOGADOR')+tag(p.race)+tag(p.age_text)+'</div></div></header>'+
        '<div class="ficha-narrative">'+field('Biografia',p.biography)+field('Aparência',p.appearance)+field('Relacionamentos',p.relationships)+'</div>'+
        '<div class="ficha-columns"><section class="ficha-block ficha-abilities"><h3>GRIMÓRIO <span>('+abilities.length+')</span></h3>'+ (abilities.length?abilities.map((a,i)=>'<article class="ficha-ability"><h4>'+esc(a.title||'Habilidade '+(i+1))+'</h4><div class="file-tags">'+tag(a.nature)+tag(a.difficulty)+tag(a.effect)+'</div><p>'+esc(a.description)+'</p></article>').join(''):'<p>Nenhuma habilidade cadastrada.</p>')+'</section><section class="ficha-block ficha-actions"><h3>AÇÕES</h3><div class="ficha-actions-list">Carregando ações...</div></section></div>';
      loadActions(name,detail.querySelector('.ficha-actions-list'),token);
    }catch(err){if(token===currentDetail)detail.textContent='Não foi possível carregar a ficha. Atualize a página para tentar novamente.';}
  }
  window.addEventListener('hashchange',showFicha);showFicha();
  refreshApproved();

})();
