# Desafio técnico

Um gerente de marketing perguntou ao agente da plataforma qual canal trouxe mais vendas por real investido. O agente já respondeu com uma especificação de painel. Os dados vêm de uma API separada.

## A tarefa

1. Renderize o painel que o agente devolveu, com os estados de carregamento e erro.
2. O cliente pediu uma coisa a mais: quer ver, em cada canal, a variação do investimento contra o mesmo período do ano anterior. Inclua isso no painel.

Pense no gerente de marketing que vai olhar essa tela. Se encontrar algo estranho nos dados ou uma decisão que caberia ao cliente, escolha um caminho e explique por que escolheu.

Use a IA como você usaria no dia a dia. Pode instalar o que quiser.

Reserve até 3 horas. Não precisa ficar perfeito. Preferimos uma entrega menor e bem explicada.

## Como rodar

```sh
npm install
npm run dev
```

Abra o endereço que o Vite mostrar. Os testes rodam com `npm test`.

## A API

As duas rotas rodam dentro do servidor do Vite, sem rede. Os tipos estão em `src/types.ts` e as chamadas em `src/api.ts`.

- `GET /api/agent?q=...` devolve a resposta do agente: título, resumo, período, origem dos dados e a lista de gráficos. Cada gráfico tem tipo, métrica e quebra. Demora 1,5 s.
- `GET /api/data` devolve as linhas de investimento e vendas atribuídas, por canal e veículo.

Acrescente `&fail=1` a qualquer rota para simular uma falha.

## O que entregar

1. O código, num repositório privado no GitHub ou num zip sem `node_modules`.
2. Um arquivo `DECISOES.md` curto, com:
   - O que você construiu e o que deixou de fora.
   - As decisões que tomou e por quê.
   - Qualquer problema que encontrou nos dados e como tratou.
   - Como você usou a IA: o que pediu, o que aceitou e o que corrigiu.
3. Um print da tela final.

Depois da entrega, marcamos 30 minutos para você mostrar a solução e conversar sobre as decisões.
