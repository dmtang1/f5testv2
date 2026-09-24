import { questions } from "@/data/questions";
import { describe, expect, it } from "vitest";
import { displayOptions } from "@/lib/options";
import { axisScore, scoreAnswers, secondaryType, strength, typeFromScores } from "@/lib/scoring";

function answers(pole: 0 | 1, axis?: "focus" | "style", axisPole?: 0 | 1): Record<string, 0 | 1> {
  const out: Record<string, 0 | 1> = {};
  for (const question of questions) {
    if (axis && question.axis === axis) out[question.id] = axisPole ?? pole;
    else out[question.id] = pole;
  }
  return out;
}

function withCounts(focusB: number, styleB: number): Record<string, 0 | 1> {
  let f = 0;
  let s = 0;
  const out: Record<string, 0 | 1> = {};
  for (const question of questions) {
    if (question.axis === "focus") {
      out[question.id] = f < focusB ? 1 : 0;
      f += 1;
    } else {
      out[question.id] = s < styleB ? 1 : 0;
      s += 1;
    }
  }
  return out;
}

describe("scoring", () => {
  it("maps the four quadrants from the poles", () => {
    expect(scoreAnswers(answers(0)).primary).toBe("defender");
    expect(scoreAnswers(answers(0))).toMatchObject({ focus: 0, style: 0 });
    expect(scoreAnswers(answers(1)).primary).toBe("motivator");
    expect(scoreAnswers(answers(1))).toMatchObject({ focus: 100, style: 100 });
    expect(scoreAnswers(answers(0, "style", 1)).primary).toBe("director");
    expect(scoreAnswers(answers(1, "style", 0)).primary).toBe("teammate");
  });

  it("scores 6 of 11 as 55 and slight", () => {
    expect(axisScore(6)).toBe(55);
    expect(strength(55)).toBe("slight");
  });

  it("labels strength at the 14/15 and 34/35 boundaries", () => {
    expect(strength(50 - 14)).toBe("slight");
    expect(strength(50 + 14)).toBe("slight");
    expect(strength(50 - 15)).toBe("moderate");
    expect(strength(50 + 15)).toBe("moderate");
    expect(strength(50 - 34)).toBe("moderate");
    expect(strength(50 + 34)).toBe("moderate");
    expect(strength(50 - 35)).toBe("strong");
    expect(strength(50 + 35)).toBe("strong");
  });

  it("flips the closer axis and breaks ties toward style", () => {
    expect(secondaryType(60, 40)).toBe("motivator");
    expect(typeFromScores(60, 40)).toBe("teammate");
    expect(secondaryType(55, 100)).toBe("director");
    expect(secondaryType(0, 18)).toBeUndefined();
    expect(secondaryType(74, 100)).toBe("director");
    expect(secondaryType(75, 100)).toBeUndefined();
    expect(secondaryType(74, 26)).toBe("motivator");
    expect(secondaryType(75, 25)).toBeUndefined();
  });

  it("omits a strong secondary and keeps a near-midpoint one", () => {
    const strong = scoreAnswers(withCounts(0, 0));
    expect(strong.secondary).toBeUndefined();
    const near = scoreAnswers(withCounts(6, 11));
    expect(near.primary).toBe("motivator");
    expect(near.secondary).toBe("director");
    expect(near.focus).toBe(55);
  });

  it("does not let display order change the stored pole", () => {
    const question = questions[0];
    let seed = 1;
    while (!displayOptions(question, seed)[0] || displayOptions(question, seed)[0].pole !== 1) {
      seed += 1;
      if (seed > 50) break;
    }
    const shown = displayOptions(question, seed);
    expect(shown.map((option) => option.pole).sort()).toEqual([0, 1]);
    const picked = shown[0].pole;
    const result = scoreAnswers({ ...answers(0), [question.id]: picked });
    expect(result.focus).toBe(picked === 1 ? axisScore(1) : 0);
  });
});
