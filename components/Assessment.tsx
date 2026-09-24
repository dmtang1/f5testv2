"use client";

import { QUESTION_BANK_VERSION, QUESTION_PROMPT, questions } from "@/data/questions";
import { t } from "@/data/locale/en";
import { track } from "@/lib/analytics";
import { displayOptions, newSeed } from "@/lib/options";
import { scoreAnswers } from "@/lib/scoring";
import { clearProgress, loadProgress, saveProgress, saveResult, storageAvailable, type ProgressState } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const total = questions.length;

export function Assessment() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [storageOff, setStorageOff] = useState(false);
  const [state, setState] = useState<ProgressState>({
    version: QUESTION_BANK_VERSION,
    seed: 1,
    index: 0,
    answers: {},
    name: "",
    shareName: false,
    phase: "intro",
  });
  const [highlight, setHighlight] = useState<0 | 1 | null>(null);
  const [calculating, setCalculating] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const saved = loadProgress();
    if (!storageAvailable()) setStorageOff(true);
    if (saved && Object.keys(saved.answers).length === total) {
      router.replace("/results");
      return;
    }
    setState(saved ?? { ...state, seed: newSeed() });
    setReady(true);
    // initial seed only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    if (!saveProgress(state)) setStorageOff(true);
  }, [state, ready]);

  useEffect(() => {
    if (state.phase === "question") headingRef.current?.focus();
  }, [state.index, state.phase]);

  useEffect(() => {
    if (!calculating) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => router.push("/results"), reduce ? 200 : 1100);
    return () => window.clearTimeout(timer);
  }, [calculating, router]);

  const question = questions[state.index];
  const options = question ? displayOptions(question, state.seed) : [];

  function commit(pole: 0 | 1) {
    if (!question || calculating) return;
    const answers = { ...state.answers, [question.id]: pole };
    track("question_answered", { index: state.index + 1 });
    if (state.index === total - 1) {
      const result = scoreAnswers(answers, questions, {
        name: state.name,
        shareName: state.shareName,
      });
      saveResult(result);
      clearProgress();
      track("test_complete", {
        type: result.primary,
        focusStrength: result.focusStrength,
        styleStrength: result.styleStrength,
      });
      setCalculating(true);
      return;
    }
    setHighlight(null);
    setState((current) => ({ ...current, answers, index: current.index + 1, phase: "question" }));
  }

  useEffect(() => {
    if (state.phase !== "question") return;
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "1" || event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight(0);
      } else if (event.key === "2" || event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight(1);
      } else if ((event.key === "Enter" || event.key === " ") && highlight !== null) {
        event.preventDefault();
        commit(options[highlight].pole);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!ready || calculating) {
    return (
      <main id="main" className="test-main">
        <p role="status">{calculating ? t.test.calculating : t.test.loading}</p>
      </main>
    );
  }

  if (state.phase === "intro") {
    return (
      <main id="main" className="test-main">
        <h1>{t.test.title}</h1>
        <p>{t.test.measures}</p>
        <p>{t.test.noRight}</p>
        {storageOff ? <p className="notice">{t.test.storageOff}</p> : null}
        <div className="field">
          <label htmlFor="first-name">{t.test.nameLabel}</label>
          <input
            id="first-name"
            value={state.name}
            maxLength={40}
            autoComplete="given-name"
            onChange={(event) => setState((current) => ({ ...current, name: event.target.value, shareName: event.target.value.trim() ? current.shareName : false }))}
          />
          <p className="fine">{t.test.namePrivacy}</p>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={state.shareName}
            disabled={!state.name.trim()}
            onChange={(event) => setState((current) => ({ ...current, shareName: event.target.checked }))}
          />
          <span>{t.test.shareName}</span>
        </label>
        <button
          className="btn"
          type="button"
          onClick={() => {
            track("test_start");
            setState((current) => ({ ...current, phase: "question", index: 0 }));
          }}
        >
          {t.test.start}
        </button>
      </main>
    );
  }

  return (
    <main id="main" className="test-main">
      <div className="question-screen" data-testid="question-screen">
        <div>
          <div className="progress-copy">
            <span>{t.test.questionOf(state.index + 1, total)}</span>
          </div>
          <div className="track" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={state.index + 1} aria-valuetext={t.test.progress(state.index + 1, total)}>
            <span style={{ width: `${((state.index + 1) / total) * 100}%` }} />
          </div>
        </div>
        <h1 tabIndex={-1} ref={headingRef}>
          {QUESTION_PROMPT}
        </h1>
        <div className="options" role="radiogroup" aria-labelledby="q-heading">
          <span id="q-heading" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
            {QUESTION_PROMPT}
          </span>
          {options.map((option, index) => (
            <button
              key={option.pole}
              type="button"
              className="option"
              role="radio"
              aria-checked={highlight === index}
              data-pole={option.pole === 0 ? "a" : "b"}
              onClick={() => commit(option.pole)}
              onFocus={() => setHighlight(index as 0 | 1)}
            >
              {option.text}
            </button>
          ))}
        </div>
        {state.index > 0 ? (
          <button type="button" className="btn-secondary" onClick={() => setState((current) => ({ ...current, index: current.index - 1 }))}>
            {t.test.back}
          </button>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => setState((current) => ({ ...current, phase: "intro" }))}>
            {t.test.back}
          </button>
        )}
      </div>
    </main>
  );
}
