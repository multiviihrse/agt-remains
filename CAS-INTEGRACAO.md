# CAS — primeira etapa

Esta entrega implementa a interface de criação, pré-visualização e salvamento de rascunho LOCAL no navegador. **Não envia dados ao Google** e não gera links privados. O botão de envio fica desabilitado intencionalmente.

## Próxima etapa: integração real
1. Criar uma Planilha Google privada para o registro de fichas, versões e estados.
2. Criar um modelo privado de Google Docs com os campos do personagem.
3. Criar um projeto Apps Script com operações de criar, consultar, editar e solicitar revisão.
4. Gerar tokens aleatórios e independentes para leitura e edição; guardar apenas hashes no backend, não publicar tokens no GitHub.
5. Autorizar as ações do narrador por identidade Google no backend (sem exigir login do jogador), ou por um painel administrativo protegido, nunca por segredo exposto no JS.
6. Implementar a ponte segura entre GitHub Pages e Apps Script. Chamadas fetch diretas ao Apps Script podem encontrar restrições CORS e redirecionamentos; testar a estratégia antes de habilitar envio.
7. Criar/atualizar Google Docs apenas após validação dos dados no servidor; registrar histórico e aprovação.

Importante: um link privado funciona como chave de acesso; qualquer pessoa com o link pode usá-lo. A planilha e os Docs não devem ser públicos.

## Atualização de campos
Situação removida; jogador renomeado para ID de player; natureza/efeito e dificuldade agora são listas fechadas. A dificuldade tem cinco níveis (Iniciante, Básico, Intermediário, Avançado, Especialista) e ainda não aplica cálculos de dano. Pré-visualização utiliza o layout de ficha do Fichário.


Cada habilidade agora tem natureza (afinidade mágica), dificuldade (nível futuro de cálculo) e efeito (função mecânica) como campos independentes. Os dados serão persistidos com as chaves `habilidade_N_natureza`, `habilidade_N_dificuldade` e `habilidade_N_efeito`.
