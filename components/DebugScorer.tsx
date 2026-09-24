"use client";

import { questions } from "@/data/questions";
import { scoreAnswers } from "@/lib/scoring";
import { encodeShareCode } from "@/lib/share-code";
import { useMemo, useState } from "react";

export function DebugScorer() {
  const [answers, setAnswers] = useState<Record<string, 0 | 1>>(() =>
    Object.fromEntries(questions.map((question) => [question.id, 0])),
  );

  const result = useMemo(() => scoreAnswers(answers), [answers]);

  return (
    <main id="main" className="section">
      <div className="wrap">
        <h1>Scoring debug</h1>
        <p className="fine">Internal review tool. Not linked in the product.</p>
        {questions.map((question) => (
          <fieldset key={question.id} className="panel" style={{ marginTop: "0.75rem", padding: "0.8rem" }}>
            <legend>
              {question.id} · {question.axis}
            </legend>
            <label className="check">
              <input type="radio" name={question.id} checked={answers[question.id] === 0} onChange={() => setAnswers((current) => ({ ...current, [question.id]: 0 }))} />
              <span>{question.poleA}</span>
            </label>
            <label className="check">
              <input type="radio" name={question.id} checked={answers[question.id] === 1} onChange={() => setAnswers((current) => ({ ...current, [question.id]: 1 }))} />
              <span>{question.poleB}</span>
            </label>
          </fieldset>
        ))}
        <pre>{JSON.stringify({ ...result, code: encodeShareCode(result) }, null, 2)}</pre>
      </div>
    </main>
  );
}
