import type { Question } from "@/lib/model";

export function optionFlip(questionId: string, seed: number): boolean {
  let hash = seed >>> 0;
  for (let i = 0; i < questionId.length; i += 1) {
    hash ^= questionId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 1;
}

export function displayOptions(question: Question, seed: number): { pole: 0 | 1; text: string }[] {
  if (optionFlip(question.id, seed)) {
    return [
      { pole: 1, text: question.poleB },
      { pole: 0, text: question.poleA },
    ];
  }
  return [
    { pole: 0, text: question.poleA },
    { pole: 1, text: question.poleB },
  ];
}

export function newSeed(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] || 1;
  }
  return Math.floor(Math.random() * 0xffffffff) || 1;
}
