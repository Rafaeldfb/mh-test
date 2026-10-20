# Code review da tarefa 02

Não encontrei nenhum bug que impeça a entrega. A lógica de dados está correta e bem testada, e o fluxo de ativação limpa o próprio estado direito. Typecheck, lint e os 44 testes (8 arquivos) passam. Medi tamanho de função e complexidade com regras ESLint aplicadas só na execução da revisão, e tudo fica abaixo dos máximos de [Quality gates](../../docs/quality-gates.md). Os pontos que valem atenção são de produto/UX e de modelagem, não de corretude. A revisão não alterou código.

Uma limitação: a revisão foi só estática, sem verificação no navegador. Os comentários sobre renderização vêm da leitura do código, da [referência visual v2](design/state-3-grouped-bars-v2.png) e das evidências manuais já registradas em [03-comparison-flow.md](deliverables/03-comparison-flow.md#execution-and-review-evidence).

## Pontos fortes

- **Cálculo puro e bem tipado.** `src/investment-comparison.ts` usa uniões discriminadas (`positive`/`zero`/`missing`/`invalid` e `available`/`zero`/`overflow`). O `switch` de `changeLabel` cobre todos os casos e o TypeScript garante isso. Ausente, inválido e zero continuam separados, como pede a política.
- **Sem dupla contagem.** Só entram linhas com `vehicle === null`. A unicidade de canal (importante para `key={point.channel}`) já é garantida por `validateChannelTotals`.
- **Testes de borda.** Cobrem entrada congelada (o cálculo não altera os dados), `undefined`/`"100"`/`NaN`/`±Infinity`, −100%, 0/0, overflow e o isolamento de histórico defeituoso em relação aos gráficos existentes.
- **Ciclo de vida do fluxo.** Os dois `requestAnimationFrame` são cancelados e protegidos pela flag `active`, o que funciona também com o StrictMode. O ref síncrono impede ativação dupla. O convite some com `visibility: hidden` + `inert` + `aria-hidden`, sem colapsar o espaço. O foco vai para um heading estável antes do scroll.
- **Tooltip.** O `Tooltip` do Recharts 3 vem com `filterNull: true` por padrão (conferido no pacote instalado). Então o `Number(null)` do formatter não vira "R$ 0,00" para o TikTok.
- **29 de fevereiro** é tratado em `comparisonPeriods` e tem teste.

## Achados (do mais para o menos relevante)

**1. O percentual e a falta de histórico não aparecem no gráfico (média, UX).** Na referência v2, o percentual fica sob cada canal e há o texto "Histórico indisponível" no espaço do TikTok. Na implementação, o gráfico mostra só valores em reais, e o tooltip também. Variação e explicações ficam apenas na lista abaixo. Isso cumpre o texto do design ("labels and accessible tooltip/detail content"), mas o gerente precisa cruzar o gráfico com a lista. Pior: dentro do gráfico, a barra ausente do TikTok fica sem explicação e pode ser lida como zero, justamente o que a política quer evitar. Sugestão: um tick de duas linhas (canal + variação) no desktop, um label no lugar da barra ausente e a variação dentro do tooltip.

**2. O skeleton dura cerca de dois frames, uns 33 ms (média-baixa, UX).** Na prática, aparece como um flash de um bloco cinza de 340/500 px antes do gráfico, e não como um estado de preparação percebido. Além disso, a altura está fixa no CSS (`.comparison-skeleton` 340px / 500px no mobile) e acoplada a `points.length * 100` no TSX. Com uma quantidade de canais diferente de 5, o layout pula na troca:

```tsx
// src/InvestmentComparison.tsx
<div className="comparison-plot" style={{ height: mobile ? points.length * 100 : 340 }}>
```

Vale registrar no `DECISOES.md` por que o skeleton existe, já que os dados são locais, ou derivar as duas alturas da mesma fonte.

**3. `baseline: unknown` no tipo de domínio (média-baixa, modelagem).** `ContributionRow` circula por `chart-data`, `data-integrity` e pelo fluxo carregando um campo sem validação. Hoje só `compareInvestments` o lê, mas qualquer consumidor futuro pode usar o campo sem passar por `classifyHistory`. Também se perdeu a documentação do significado do campo:

```ts
// src/types.ts
/** Histórico recebido; classificar antes de calcular a comparação anual. */
baseline: unknown;
```

O comentário original ("investimento no mesmo período do ano anterior, em reais") dizia o que é o campo e em que unidade. A alternativa é classificar já no parser (`baseline: HistoricalInvestment`): mantém o "inválido" separado sem derrubar o painel e tira o `unknown` do domínio. O [plano](plan.md#technical-defaults-for-execution) escolheu de propósito preservar o valor bruto, mas esse trade-off merece ser contestado na conversa.

**4. JSDoc no símbolo errado (baixa).** Em `src/format.ts`, o comentário "Receives a fraction: 0.25 means +25,00%" está acima de `unchangedInvestment`, então o hover da IDE o mostra na constante e não em `formatInvestmentChange`. O `.slice(1)` também supõe que a saída do `Intl` começa com o caractere de sinal. Os testes cobrem isso, mas a construção é frágil.

**5. Variação dentro do `<h3>` (baixa, acessibilidade).** O heading de cada canal fica, por exemplo, "TikTok Comparação indisponível: histórico não informado." Para quem navega por headings, isso fica longo. E "TV +3,23%" não tem rótulo "Variação". Sugestão: `<h3>{channel}</h3>` e, em seguida, um parágrafo "Variação: …".

**6. Período repetido três vezes (baixa, UX).** O período completo aparece no parágrafo do card, na legenda e no nome das séries no tooltip. A referência usa uma forma compacta ("Jul–Set 2026 × Jul–Set 2025", "Atual · 2026").

**7. Duplicações pequenas (baixa).**

- O breakpoint `"(max-width: 720px)"` aparece duas vezes no TSX, além do CSS.
- As cores `#365f4b`/`#79739a` estão no TSX e em `.current-dot`/`.prior-dot`.
- `"amount" in point.history ? … : …` se repete em dois lugares. Um helper `historicalAmount()` em `src/investment-comparison.ts` resolveria.

**8. Assimetria com investimento atual negativo (baixa, política).** O parser aceita investimento atual negativo (`amount()` só exige número finito), enquanto `classifyHistory` rejeita baseline negativo. Um atual de −50 contra baseline 100 mostraria "−150,00%" como se fosse normal, enquanto o gráfico de ROI trata investimento não positivo como indisponível. É um caso defensivo, mas vale decidir.

## Testes

- **O fluxo não tem teste automatizado.** Ativação dupla, cancelamento dos frames ao desmontar e revelação após dois frames são a parte mais delicada e só têm evidência manual. Essa limitação está documentada. Ainda assim, o [README do desafio](../../README.md) permite instalar dependências, e `@testing-library/react` com jsdom e `requestAnimationFrame` falso cobriria isso com poucos casos.
- Os testes de `formatInvestmentChange` estão em `src/investment-comparison.test.ts`, embora exista `src/format.test.ts`. Isso quebra a convenção de manter o teste ao lado do código.
- Em `src/history-validation.test.ts`, a parte com `loadDashboard` acaba testando o `JSON.stringify` (`NaN`/`Infinity` viram `null`), e não o código da aplicação. Os loops dentro de um único `it` escondem qual caso falhou; `it.each` seria mais claro.

## Métricas medidas

| Função | Linhas | Complexidade |
| --- | ---: | ---: |
| `ComparisonBars` | 45 | 8 |
| `InvestmentComparisonFlow` | 43 | 4 |
| `changeLabel` | — | 6 |
| `classifyHistory` | — | 6 |

Todas passam dos alvos (40 linhas, complexidade 5), mas ficam dentro dos máximos (60–100 linhas, complexidade 10), e as justificativas estão nos registros das entregas.

## Prioridade sugerida

Antes da entrega, o item a atacar primeiro é o 1: mostrar o percentual e o "histórico indisponível" no próprio gráfico. É o que o gerente vai olhar primeiro.
