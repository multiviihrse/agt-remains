(()=>{
const form=document.getElementById('casForm');if(!form)return;
const powers=document.getElementById('casPowers');
const CATALOG_URL='https://tfzjpuqjvfpqqdpgpknb.supabase.co/rest/v1/ability_options?select=category,label,sort_order&active=eq.true&order=sort_order.asc';
const CATALOG_KEY='sb_publishable_u1UUMXQ-5ZiiFTF0u0xWbg_mLqsus0C';
const catalogs={nature:[],type:[],level:[]};
async function loadAbilityOptions(){
 const selects=[...powers.querySelectorAll('select')];
 selects.forEach(el=>{el.disabled=true;el.innerHTML='<option value="">Carregando opções...</option>';});
 try{
  const response=await fetch(CATALOG_URL,{headers:{'apikey':CATALOG_KEY,'Accept':'application/json'}});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const rows=await response.json();
  for(const row of rows){if(Object.hasOwn(catalogs,row.category)&&typeof row.label==='string')catalogs[row.category].push(row.label);}
  if(Object.values(catalogs).some(list=>!list.length))throw new Error('Catálogos incompletos');
  for(const el of selects){const category=el.name.endsWith('_natureza')?'nature':el.name.endsWith('_efeito')?'type':'level';const previous=el.value;el.innerHTML=options(catalogs[category]);el.disabled=false;if(catalogs[category].includes(previous))el.value=previous;}
  restoreDraft();
 }catch(error){console.error('Falha ao carregar catálogos de habilidades:',error);selects.forEach(el=>{el.innerHTML='<option value="">Indisponível no momento</option>';});const feedback=document.getElementById('casFeedback');if(feedback)feedback.textContent='Não foi possível carregar as opções do grimório. Atualize a página para tentar novamente.';}
}
const options=values=>'<option value="">Selecione...</option>'+values.map(v=>`<option value="${v}">${v}</option>`).join('');
for(let i=1;i<=5;i++){
 const el=document.createElement('div');el.className='cas-power';
 el.innerHTML=`<h4>HABILIDADE ${String(i).padStart(2,'0')}</h4><div class="cas-power-grid"><label>Nome<input name="habilidade_${i}_nome" maxlength="90" placeholder="Nome da habilidade"></label><label>Natureza<select name="habilidade_${i}_natureza">${options([])}</select></label><label>Dificuldade<select name="habilidade_${i}_dificuldade">${options([])}</select></label><label>Efeito<select name="habilidade_${i}_efeito">${options([])}</select></label><label>Descrição<textarea name="habilidade_${i}_descricao" rows="2" maxlength="350" placeholder="O que a habilidade faz e quais são seus limites?"></textarea></label></div>`;
 powers.append(el);
}
const feedback=document.getElementById('casFeedback'), count=document.getElementById('casCount'),hist=document.getElementById('casHistoria'),previewNode=document.getElementById('casPreview');
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=()=>Object.fromEntries(new FormData(form).entries());
function preview(){
 const d=data();
 // A ficha de demonstração é a própria matriz visual do Fichário.
 const original=document.querySelector('#fichario .file-card');
 if(!original)return;
 const card=original.cloneNode(true);
 card.classList.add('cas-file-card');
 card.querySelector('.file-character-name').textContent=[d.nome,d.familia].map(v=>(v||'').trim()).filter(Boolean).join(' ')||'Personagem sem nome';
 const tags=card.querySelector('.file-info .file-tags');
 tags.innerHTML='';
 [d.jogador||'PLAYER —',d.raca||'Raça indefinida',d.idade||'Idade não informada'].forEach((v,i)=>{
  const span=document.createElement('span');span.className='file-tag'+(i===0?' file-player-id':'');span.textContent=v;tags.append(span);
 });
 card.querySelector('.file-bio').textContent=d.historia||'História ainda não escrita.';
 const portrait=card.querySelector('.file-portrait-image');
 if(/^https:\/\//i.test(d.retrato||'')){portrait.src=d.retrato;portrait.alt='Retrato do personagem';portrait.onerror=()=>{portrait.style.display='none'};}
 else{portrait.remove();const ph=document.createElement('div');ph.className='cas-portrait-placeholder';ph.textContent='RETRATO DO PERSONAGEM';card.querySelector('.file-portrait-frame').prepend(ph)}
 const entries=Array.from({length:5},(_,i)=>i+1).filter(i=>d[`habilidade_${i}_nome`]);
 const ol=card.querySelector('.file-grimoire ol');ol.replaceChildren();
 for(const i of entries){
  const li=document.createElement('li');li.className='file-power';
  const header=document.createElement('div');header.className='file-power-name';
  const number=document.createElement('span');number.textContent=String(i).padStart(2,'0')+'.';
  const title=document.createElement('strong');title.textContent=d[`habilidade_${i}_nome`];header.append(number,title);
  const tags=document.createElement('div');tags.className='file-tags';
  for(const value of [d[`habilidade_${i}_natureza`],d[`habilidade_${i}_dificuldade`],d[`habilidade_${i}_efeito`]||d[`habilidade_${i}_tipo`]])if(value){const tag=document.createElement('span');tag.className='file-tag';tag.textContent=value;tags.append(tag)}
  const desc=document.createElement('p');desc.textContent=d[`habilidade_${i}_descricao`]||'Sem descrição';li.append(header,tags,desc);ol.append(li);
 }
 if(!entries.length){const li=document.createElement('li');li.className='cas-empty-powers';li.textContent='Nenhuma habilidade descrita.';ol.append(li)}
 card.querySelector('.file-grimoire-title span:nth-of-type(2)').textContent=String(entries.length).padStart(2,'0')+' HABILIDADES';
 card.querySelector('.file-grimoire').open=true;
 previewNode.replaceChildren(card);
 fitPreviewName();
}
function fitPreviewName(){
 const el=previewNode.querySelector('.file-character-name');if(!el)return;
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
 const width=el.clientWidth;if(!width)return;
 const style=getComputedStyle(el);ctx.font=`400 20px ${style.fontFamily}`;
 const measured=ctx.measureText(el.textContent.trim()).width;
 el.style.fontSize=(measured?Math.min(20,20*Math.max(0,width-2)/measured):20).toFixed(2)+'px';
}
if(document.fonts?.ready)document.fonts.ready.then(fitPreviewName);
window.addEventListener('resize',fitPreviewName);
hist.addEventListener('input',()=>count.textContent=hist.value.length+' / 300');
document.getElementById('casPreviewButton').addEventListener('click',()=>{const review=previewNode.closest('.cas-accordion');if(review)review.open=true;preview()});
document.getElementById('casSave').addEventListener('click',()=>{try{localStorage.setItem('agt_cas_draft_v1',JSON.stringify(data()));feedback.textContent='Rascunho salvo neste navegador. Ele ainda não foi enviado ao narrador.'}catch{feedback.textContent='Não foi possível salvar neste navegador.'}preview()});
function restoreDraft(){try{const draft=JSON.parse(localStorage.getItem('agt_cas_draft_v1')||'null');if(draft&&typeof draft==='object'){for(const [key,value] of Object.entries(draft)){const el=form.elements.namedItem(key);if(el&&typeof value==='string')el.value=value;else if(key.endsWith('_tipo')&&typeof value==='string'){const old=form.elements.namedItem(key.replace('_tipo','_efeito'));if(old)old.value=value}}count.textContent=hist.value.length+' / 300';feedback.textContent='Rascunho local recuperado.'}}catch{}}
loadAbilityOptions();
preview();
})();