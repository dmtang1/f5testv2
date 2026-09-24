import { QUESTION_BANK_VERSION } from "@/data/questions";
import type { Result, TypeId } from "@/lib/model";

const PROGRESS = "f5-progress-v1";
const RESULT = "f5-result-v1";
const TEAM = "f5-team-v1";

export interface ProgressState {
  version: string;
  seed: number;
  index: number;
  answers: Record<string, 0 | 1>;
  name: string;
  shareName: boolean;
  phase: "intro" | "question";
}

export interface TeamMember {
  id: string;
  name: string;
  type: TypeId;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function storageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = "__f5_probe";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function loadProgress(): ProgressState | null {
  const saved = read<ProgressState>(PROGRESS);
  if (!saved || saved.version !== QUESTION_BANK_VERSION) return null;
  return saved;
}

export function saveProgress(state: ProgressState): boolean {
  return write(PROGRESS, state);
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PROGRESS);
  } catch {
    /* ignore */
  }
}

export function loadResult(): Result | null {
  const saved = read<Result>(RESULT);
  if (!saved || saved.version !== QUESTION_BANK_VERSION) return null;
  if (typeof saved.focus !== "number" || typeof saved.style !== "number") return null;
  return saved;
}

export function saveResult(result: Result): boolean {
  return write(RESULT, result);
}

export function clearResult(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RESULT);
  } catch {
    /* ignore */
  }
}

export function loadTeam(): TeamMember[] {
  const saved = read<TeamMember[]>(TEAM);
  return Array.isArray(saved) ? saved.slice(0, 12) : [];
}

export function saveTeam(members: TeamMember[]): boolean {
  return write(TEAM, members);
}
