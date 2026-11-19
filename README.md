# AGT: Remains — protótipo GitHub Pages

Site estático com navegação responsiva e áreas preparadas para Google Forms e Planilhas.

## Publicação
1. Crie um repositório no GitHub (ex.: `agt-remains`).
2. Envie os arquivos desta pasta para a raiz do repositório.
3. Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Acesse o endereço informado pelo GitHub Pages após a publicação.

## Formulários
Edite `config.js` e preencha as URLs públicas dos Google Forms. A seção **Links** passará a exibir os formulários clicáveis.

## Importante
- As imagens em `assets/` são **recortes da captura de referência**, usados apenas para testar o layout. Substitua por artes originais exportadas separadamente para evitar textos duplicados e melhorar a nitidez.
- O site não tem login ou aprovação automatizada nesta versão.
- Para publicação de dados aprovados, configure uma fonte pública filtrada (por exemplo, Apps Script). Nunca publique a planilha administrativa com respostas pessoais.
- Os textos internos são um ponto de partida e devem ser revisados antes do lançamento.

## Banners originais Midjourney
Os seis banners fornecidos foram inseridos diretamente via URL do CDN Midjourney: 1 na capa, 4 nos cartões de navegação e 1 como fundo das páginas internas. Os arquivos não foram baixados e não estão incluídos no ZIP; é necessária conexão com a internet e disponibilidade dos URLs. Para hospedagem independente, baixe os seis arquivos e altere as referências em `index.html` e `styles.css`. A correspondência é provisória e pode ser ajustada conforme a arte de cada imagem.

## Ajustes visuais
- Primeiro e segundo links do Midjourney invertidos (hero e Sistema).
- Gradiente preto/transparente até 50% da largura do banner principal.
- Filete vermelho inferior com 50% de opacidade no centro e desaparecendo nas extremidades.
- Cartões de cantos retos com contornos de opacidade reduzida nas quinas.
- Fases da lua extraídas da referência enviada em `assets/fases-da-lua.png`.


Atualização: banner 544px com object-fit: cover (preenche verticalmente, com recorte lateral quando necessário); barra de atalhos alinhada à largura dos cartões; links Central, Personagens, Dados e Outros links na barra e no menu lateral.


### Atualização visual
- Logo em `assets/titulo-agt-remains.png` extraído da referência enviada.
- Ornamento inferior da sidebar em `assets/ornamento-lateral.png`.
- Fundo externo carregado por URL `https://iili.io/o2QeASs.md.png`, com máscara de opacidade progressiva.
- Bordas dos cartões com iluminação superior esquerda.


## Atualização visual
- Banner: localização Rosehound Falls · Minnesota sob a logo.
- Cartões: CAS, Ambientação, Sistema e Combate.
- Barra de atalhos inferior removida; navegação lateral usa Fichário.
- Fundo e barra lateral #001106; arte de fundo limitada a 80% de opacidade.
- Cor base única de contornos: #986953.


## Atualização: painel de trama
A página inicial usa cartões 2×2 à esquerda e um painel de resumo da trama à direita, com rolagem vertical independente e barra de 1 px em navegadores WebKit. Em telas estreitas, o painel passa para baixo dos cartões. Edite o texto em `index.html`, na seção `story-panel`.


## Edição dos textos no navegador



A transparência máxima da imagem de fundo da main está em 50%. A caixa de resumo utiliza a mesma borda iluminada dos cartões.

## Refinamento visual das páginas internas

- Fundo com intensidade de até 80% nas páginas internas; home permanece em 50%.
- Subtítulos internos no mesmo estilo da legenda de localização do banner.
- Cartões de conteúdo com cantos retos e borda iluminada de cima à esquerda.
- Divisórias dos títulos com transparência nas duas extremidades.
- Menor espaçamento vertical dos títulos e textos.
- Nenhuma alteração feita no GitHub.


## Atualização da página Sistema

Texto integral em sete seções, destaques em negrito, ênfases em itálico e lista de resultados de testes. Ícones da barra lateral limitados a 24×24 px.

## Atualização de imagens (R2)
O banner principal e o background são servidos pelos URLs do Cloudflare R2 informados pelo autor. O asset decorativo do rodapé da barra lateral foi removido.

## Tipografia desta versão

Títulos: IM Fell Double Pica (com IM Fell Double Pica SC para destaques); subtítulos: Bitter; corpo: Special Gothic. As fontes são carregadas por CSS via Google Fonts, sem arquivos de fonte incluídos no pacote. O logo central permanece como imagem original, centralizada junto da legenda ROSEHOUND FALLS · MINNESOTA.


Atualização tipográfica: IM Fell Double Pica nos títulos; títulos das páginas internas em caixa alta; títulos menores sem itálico.

## Ajustes de fundo e títulos — 18/11/2026
- Páginas internas: imagem R2 em parallax por `background-attachment: fixed` (desktop), com máscara vertical de 0% no topo até 80% na base da página. Em dispositivos móveis, o fundo é estático para compatibilidade.
- Página inicial: mantida como antes, com opacidade máxima de 50%.
- Todos os `h3` internos: 22 px fixos.


## Ícones da barra lateral

Os nove ícones rúnicos estão em `assets/runas/` e são carregados localmente, com tamanho fixo de 24 × 24 px. O SVG consolidado `todos-os-icones.svg` foi omitido pois o site utiliza os símbolos individuais.

### Logotipo principal

O cabeçalho utiliza `assets/agt-remains-logo.svg`, exibido em branco via CSS. O SVG original foi preservado sem alteração.

- Logo da barra lateral: 25px do topo, com 15px até a divisória e 20px até o menu.
- Favicon recortado e ampliado para privilegiar a rosa e o monograma, incluindo versões SVG, PNG e ICO. Original preservado em assets/agt-rosa-logo-original.svg.


### Ajustes finais
- Títulos dos cartões da página inicial: 22 px e branco.
- Logo do banner: 10 px para a esquerda; legenda Rosehound Falls: 14 px.
- Logo da sidebar: reduzida a 93% (170×76 → 158,1×70,68 px), com ajustes proporcionais nos breakpoints.
- Favicon: novo SVG preto enviado pelo autor, com derivados PNG e ICO e versão de cache v3.


Atualização: somatório do log com MOD verde e SAN vermelho; bordas 0,5px. A parcela SAN representa 2 lados por dado, exibidos como desconto contábil do subtotal reconstruído, preservando o sorteio uniforme dos dados de lados reduzidos.
