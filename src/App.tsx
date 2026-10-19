import { useRef, useState } from "react";
import { DashboardAnnouncements, DashboardWorkspace } from "./DashboardWorkspace";
import { useDashboard } from "./useDashboard";
import { useComposerClearance } from "./useComposerClearance";

const DEFAULT_QUESTION = "Qual canal trouxe mais vendas por real investido no último trimestre?";

export function App() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const { state, submit, retry } = useDashboard();
  const composerRef = useComposerClearance();
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = state.status === "loading";
  function retryFromComposer() {
    inputRef.current?.focus();
    retry();
  }

  return (
    <>
      <nav className="navbar" aria-label="Principal">
        <span className="brand">Media Hero<span className="brand-dot">.</span></span>
        <span className="navbar-note">Inteligência de marketing</span>
      </nav>
      <main className="page">
        <DashboardAnnouncements state={state} />
        <DashboardWorkspace state={state} retry={retryFromComposer} />
      </main>
      <div className="composer-shell" ref={composerRef}>
        <form className="ask" onSubmit={(event) => {
          event.preventDefault();
          void submit(question);
        }}>
          <label htmlFor="question">O que você quer descobrir?</label>
          <div className="ask-controls">
            <input
              ref={inputRef}
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <button type="submit" disabled={pending || !question.trim()}>
              {pending ? "Carregando…" : "Perguntar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
