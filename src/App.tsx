import { useState } from "react";

const DEFAULT_QUESTION = "Qual canal trouxe mais vendas por real investido no último trimestre?";

export function App() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);

  return (
    <main className="page">
      <h1>Media Hero</h1>

      <form
        className="ask"
        onSubmit={(event) => {
          event.preventDefault();
          // TODO: perguntar ao agente e renderizar o painel
        }}
      >
        <input value={question} onChange={(event) => setQuestion(event.target.value)} />
        <button type="submit">Perguntar</button>
      </form>

      <section className="dashboard">{/* O painel entra aqui */}</section>
    </main>
  );
}
