export type TypeId = "director" | "motivator" | "defender" | "teammate";
export type Axis = "focus" | "style";
export type Strength = "slight" | "moderate" | "strong";
export type LetterCode = "ST" | "NT" | "SF" | "NF";

export interface Question {
  id: string;
  axis: Axis;
  poleA: string;
  poleB: string;
}

export interface Result {
  version: string;
  focus: number;
  style: number;
  primary: TypeId;
  secondary?: TypeId;
  focusStrength: Strength;
  styleStrength: Strength;
  name?: string;
  shareName?: boolean;
  completedAt: string;
}

export interface SpotCues {
  telephone: string;
  appearance: string;
  office: string;
  written: string;
  leisure: string;
  pace: string;
}

export interface TypeContent {
  id: TypeId;
  label: string;
  code: LetterCode;
  quadrant: string;
  /** Synthesized from the trait list. Draft — needs review. */
  headline: string;
  headlineDraft: true;
  traits: string[];
  spot: SpotCues;
}

export interface Lead {
  email: string;
  name?: string;
  type?: TypeId;
  focus?: number;
  style?: number;
  consent: true;
  source: "landing" | "results";
  createdAt: string;
}

export const TYPE_IDS: TypeId[] = ["director", "motivator", "defender", "teammate"];

/** Quadrant reading order: top-left, top-right, bottom-left, bottom-right. */
export const QUADRANT_IDS: TypeId[] = ["defender", "director", "teammate", "motivator"];
