# Decisões

## O que construí

- **Tarefa 1 — painel do agente:** o painel é montado a partir da especificação de `/api/agent` e dos números de `/api/data`. Ele mostra o título, o resumo e o período devolvidos pelo agente, além dos três gráficos especificados: vendas por real investido por canal, investimento por veículo e participação nas vendas por canal. Há estados de carregamento com skeletons, erro com "Tentar novamente", layout responsivo, valores exatos acessíveis por teclado e suporte a movimento reduzido.
- **Tarefa 2 — variação anual do investimento:** depois dos gráficos, o agente oferece a comparação com o mesmo período do ano anterior. Ela aparece num gráfico de barras agrupadas por canal, com valores e variação percentual.
- **Qualidade:** TypeScript estrito, ESLint, hooks de pre-commit e pre-push e 61 testes unitários para cálculos, validação e cliente da API. Os fluxos de tela foram verificados manualmente no navegador.

## Problemas nos dados e decisões

### 1. Totais por canal, detalhes por veículo

**Problema:** os dados misturam duas granularidades na mesma lista: uma linha de total por canal (`vehicle: null`) e linhas de detalhe por veículo. O total da TV (R$ 1,6 mi) já é a soma de Globo (R$ 1,2 mi) e SBT (R$ 0,4 mi). Somar todas as linhas dobraria o investimento, de R$ 3,7 mi para R$ 7,4 mi, e também as vendas.

**Decisão:** os gráficos por canal usam só as linhas de total, e o gráfico por veículo usa só os detalhes. O ROI de cada canal vem do próprio total (vendas ÷ investimento), não da média dos veículos: a TV dá 2,25×, enquanto a média simples de Globo e SBT daria 2,0×.

**Como cheguei:** pedi à IA uma análise inicial dos dados, notei o conflito e discuti as alternativas com o agente como faria com um colega. Escolhi usar os números como a fonte os entrega, sem recalcular agregados no front-end. O resultado bate com o título e o resumo do agente (R$ 3,7 mi investidos e R$ 4,00 por real no Google Search).

**ROI não é lucro:** o contrato define `roi` como vendas atribuídas ÷ investimento. Mantive o nome do agente, "Vendas por real investido", e acrescentei a nota "não representa lucro". Um gerente pode ler 4,00× como R$ 4 de lucro por real, quando é receita atribuída por um modelo, antes de custos. Quando o investimento é zero ou inválido, o canal continua no gráfico como "Indisponível", sem uma barra zero falsa. Já zero vendas com investimento positivo continua sendo zero, porque é um resultado real.

**Validação:** o painel exige um único total por canal e confere se investimento e vendas atribuídas fecham com os detalhes, com tolerância de um centavo após arredondamento monetário. Se faltar um total, houver duplicação ou divergência além dessa tolerância, o painel mostra um erro com contexto do canal. Essa checagem não valida o histórico do ano anterior.

### 2. TikTok sem histórico: ausente não é zero

**Problema:** o TikTok não tem investimento do ano anterior (`baseline: null`), nem no total nem no detalhe.

**Decisão:** o TikTok mostra a barra de investimento atual, sem barra do ano anterior e sem percentual, com uma explicação de que a comparação não está disponível. Também não mostro uma variação total do investimento, porque a base de 2025 ficaria incompleta e o número seria enganoso.

**Por quê:** cheguei a essa conclusão ao auditar os dados: `null` é diferente de zero. Dizer que o investimento foi zero poderia ser enganoso conforme o contexto. Talvez a ferramenta não fosse usada pelo cliente naquele período, ou o cliente tenha escolhido não investir no canal, e essas são situações com leituras diferentes. Pelo mesmo motivo, um histórico zero é tratado como valor real, mas sem percentual possível, porque não há variação percentual sobre zero.

**Falha local, não global:** um dado pontual ausente ou inválido não deveria invalidar toda a composição. Se só um elemento falha, o restante do painel continua útil, e o gerente pode pedir o que falta novamente mais tarde, quando uma falha transitória pode já ter passado. Já falhas reais da API ou dados atuais inválidos continuam mostrando erro com "Tentar novamente", porque aí o painel inteiro não seria confiável.

**O que eu perguntaria ao cliente:** "O TikTok não era usado em 2025, ou o dado de investimento não foi registrado?" A resposta muda a mensagem exibida, mas não muda a decisão de não inventar um valor.

### 3. O painel se comporta como um agente, inclusive na comparação anual

**Contexto:** o painel nasce de uma pergunta feita a um agente, então montei a tela como uma interação com ele. A pergunta fica num campo fixo no rodapé, o painel aparece acima e há skeletons enquanto as respostas chegam.

**Decisão:** a comparação com o ano anterior não aparece de cara. Depois dos três gráficos, o agente oferece: "Você deseja comparar o investimento por canal com o mesmo período do ano anterior?", com o botão "Comparar investimentos". Ao clicar, a oferta some sem deslocar o layout, a tela vai até o novo card, o foco do teclado vai para o título dele e o gráfico é revelado.

**Por quê:** minha primeira opção seria o usuário pedir a comparação num novo prompt, mas interpretar texto livre fugiria do escopo, já que o mock sempre devolve a mesma especificação. A segunda opção mais fiel a um agente é o follow-up, um padrão comum hoje: o agente responde à pergunta original e sugere o próximo passo. Assim, os três gráficos continuam sendo a resposta do agente, e a comparação, que é o pedido extra do cliente, entra como continuação natural da conversa.

**O que isso não é:** não há nova requisição nem raciocínio simulado. Os dados do ano anterior já vêm na resposta de `/api/data`; o skeleton é só uma transição visual. Uma nova pergunta descarta a comparação, e a oferta volta quando o novo painel fica pronto.

### 4. Barras agrupadas e neutras, não tabela

**Decisão:** cada canal tem duas barras lado a lado, investimento atual e mesmo período do ano anterior, com as datas exatas dos dois períodos no cabeçalho e a legenda curta “Atual”/“Anterior”. Abaixo do gráfico, cada canal mostra os valores e a variação em `pt-BR` com sinal e duas casas decimais (TV +3,23%, YouTube +66,67%, Meta +25,00%, Google Search −7,69%). As barras ficam verticais no desktop e horizontais no celular, que no mobile são mais legíveis com os nomes dos canais.

**Por quê:** considerei uma tabela e a descartei para manter a continuidade com a linguagem gráfica do painel. Comparar duas barras é mais imediato do que comparar duas colunas de números. As duas casas decimais seguem o padrão de "R$ 4,00 por real" do próprio agente e evitam que variações pequenas, como a da TV, pareçam arredondadas.

**Neutralidade:** as cores não usam verde para aumento nem vermelho para queda, e uma nota avisa que "percentuais indicam variação do investimento, sem avaliar desempenho". Gastar mais não é bom nem ruim por si; a pergunta original do gerente era sobre retorno, e esse julgamento é dele.

### 5. O painel só aparece quando está inteiro e coerente

**Decisão:** a especificação do agente e os dados são buscados em paralelo, e o painel só é exibido quando as duas respostas chegam válidas e com o mesmo período. Se uma falhar, a outra é cancelada e a tela explica qual serviço falhou e oferece "Tentar novamente" com a mesma pergunta. Durante uma nova consulta, o resultado anterior é escondido, e o botão fica bloqueado para evitar envios duplicados.

**Por quê:** o pior cenário para o gerente é um painel que parece completo mas mistura a especificação de uma pergunta com dados de outra, ou mostra o resultado antigo como se respondesse à pergunta nova. Isso se complementa com a decisão 2: falha em algo essencial derruba o painel com uma explicação clara, e falta de um dado pontual degrada só aquele elemento.

## Como usei a IA

Não escrevi código manualmente: atuei como líder técnico, decidindo, revisando e corrigindo o trabalho de agentes com papéis separados, cada um num chat próprio do Codex.

| Papel | Onde rodou | Responsabilidade |
| --- | --- | --- |
| Coordenador | Codex, por voz | Entender o enunciado, organizar as tarefas e encaminhar o trabalho aos outros chats |
| Código do desafio técnico | Codex | Pesquisa no código, ferramentas (ESLint, TypeScript, hooks do Git) e planos por entrega |
| Implementador | Codex | Execução das entregas, uma de cada vez, com testes |
| Revisor adversarial | Codex, com gpt-6.1-sol (high) | Revisão independente de cada entrega; só avançávamos quando não restavam achados |
| Design | Codex, com geração de imagens | Referências visuais das opções de layout e dos estados da comparação |
| Documentação e contexto | Codex | Instruções para agentes, arquitetura, padrões e quality gates |
| Journalist | Codex | Registro das minhas decisões e interações em `journal.md` |
| Revisor externo | Cursor, com Claude Opus 5.5 | Revisão de código da tarefa 01, julgada pelo implementador com evidências |

**O que pedi:** análise dos dados antes de qualquer código, opções com fatos em vez de perguntas abstratas, planos em entregas pequenas e executáveis uma de cada vez, e revisão a cada entrega.

**O que aceitei:** as decisões de dados e de produto descritas acima, depois de discuti-las com o agente como faria com um colega. Das múltiplas revisões adversariais, li os julgamentos e as justificativas e escolhi corrigir os achados que eu via que faziam sentido.

**O que corrigi:**

- O agente propôs o TypeScript 7, incompatível com o typescript-eslint; escolhi o 6.
- Uma regra global de Next.js foi copiada para as instruções de um projeto Vite; mandei remover.
- O designer relatou três opções de layout prontas quando só uma existia; conferi os arquivos e pedi as que faltavam.
- Trechos de código de origem desconhecida apareceram num plano de commit; retirei-os antes do commit.
- A comparação, primeiro proposta como tabela, foi trocada por barras agrupadas.

**Sobre o tempo:** a entrega em si caberia em bem menos tempo do que usei. Fui além do sugerido de propósito, para mostrar como trabalho no dia a dia com IA: instruções de projeto para os agentes, quality gates, guardrails no Git, documentação por tarefa em Markdown, legível por qualquer ferramenta de IA, e revisão independente de cada entrega. Considero essa estrutura parte do resultado, porque é o que permite delegar código à IA sem perder controle sobre a qualidade.

## Apêndice: escopo que deixei de fora

Foram escolhas minhas para controlar o escopo, concentrando o tempo no que julguei que traria mais conteúdo para avaliação neste teste:

- **Renderização genérica de gráficos:** o painel aceita só as três combinações que o agente devolve; outro tipo de gráfico gera erro de contrato em vez de uma tentativa de desenho.
- **Testes de integração, de componente e E2E:** os testes são unitários, para cálculos, validação e cliente da API; os fluxos de tela foram verificados manualmente no navegador em várias larguras, com teclado e movimento reduzido.
- **Variação em reais e variação total anual:** a absoluta ficou opcional e foi omitida; a total foi descartada pelo motivo da decisão 2.
- **Build e preview de produção:** o mock só roda no servidor de desenvolvimento do Vite.
- **Texto técnico de fonte e modelo:** removido da tela por escolha estética; os metadados continuam no contrato.

---

Um log completo das minhas ações, decisões e interações com os agentes está em [`journal.md`](journal.md). Ele foi mantido para que agentes de IA possam ajudar os avaliadores a analisar o trabalho feito. O detalhamento técnico de cada tarefa, com planos, evidências e revisões, está em [`tasks/`](tasks/README.md).
