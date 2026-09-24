import type { Question } from "@/lib/model";

/** Draft — needs review by the client / a qualified psychometrician. */
export const QUESTION_BANK_VERSION = "0.1-draft";

export const QUESTION_PROMPT = "Which sounds more like you, most of the time?";

/** Interleaved Focus, Style, Focus, Style… Option order is randomized at runtime. */
export const questions: Question[] = [
  {
    id: "F1",
    axis: "focus",
    poleA: "When I make a tough call, I lean on objective analysis, policy, and facts.",
    poleB: "When I make a tough call, I lean on the circumstances and how people will be affected.",
  },
  {
    id: "S1",
    axis: "style",
    poleA: "In meetings I ask questions to draw out others' views before sharing mine.",
    poleB: "In meetings I state my view right away.",
  },
  {
    id: "F2",
    axis: "focus",
    poleA: "I'd rather be known as just and firm.",
    poleB: "I'd rather be known as humane and merciful.",
  },
  {
    id: "S2",
    axis: "style",
    poleA: "I work at a deliberate pace and don't like to be hurried.",
    poleB: "I work at a fast pace and want quick action.",
  },
  {
    id: "F3",
    axis: "focus",
    poleA: "In a disagreement, I favor clarity even if it's blunt.",
    poleB: "In a disagreement, I favor harmony even if it softens the message.",
  },
  {
    id: "S3",
    axis: "style",
    poleA: "I need time and low risk before I commit to a decision.",
    poleB: "I decide quickly and want options to move on.",
  },
  {
    id: "F4",
    axis: "focus",
    poleA: "I tend to keep my personal life and feelings to myself at work.",
    poleB: "I tend to be open about my personal life and feelings at work.",
  },
  {
    id: "S4",
    axis: "style",
    poleA: "I tend to avoid conflict and keep the peace.",
    poleB: "I'm comfortable with opposition and can even thrive on it.",
  },
  {
    id: "F5",
    axis: "focus",
    poleA: "On the phone I'm strictly business and brief.",
    poleB: "On the phone I'm warm and conversational.",
  },
  {
    id: "S5",
    axis: "style",
    poleA: "I'm slow to get upset and keep my cool.",
    poleB: "I speak up quickly when something needs correcting.",
  },
  {
    id: "F6",
    axis: "focus",
    poleA: "My workspace is organized around the work, with achievements on display.",
    poleB: "My workspace is personal and friendly, open to people dropping in.",
  },
  {
    id: "S6",
    axis: "style",
    poleA: "To get someone moving I suggest and invite.",
    poleB: "To get someone moving I tell them what needs to happen.",
  },
  {
    id: "F7",
    axis: "focus",
    poleA: "I give critique readily when something isn't right.",
    poleB: "I lead with appreciation before anything else.",
  },
  {
    id: "S7",
    axis: "style",
    poleA: "I prefer steady, structured routines and schedules.",
    poleB: "I prefer spontaneity and change.",
  },
  {
    id: "F8",
    axis: "focus",
    poleA: "To convince someone, I use logic, standards, and precedent.",
    poleB: "To convince someone, I appeal to people's values and situation.",
  },
  {
    id: "S8",
    axis: "style",
    poleA: "I'm quiet and reserved until I know the room.",
    poleB: "I'm expressive and energetic in most rooms.",
  },
  {
    id: "F9",
    axis: "focus",
    poleA: "I stay detached when emotions run high.",
    poleB: "I get involved when emotions run high.",
  },
  {
    id: "S9",
    axis: "style",
    poleA: "In my free time I prefer relaxed, non-competitive activities.",
    poleB: "In my free time I prefer competitive or high-energy activities.",
  },
  {
    id: "F10",
    axis: "focus",
    poleA: "In a first meeting I want to get straight to the task.",
    poleB: "In a first meeting I want to get to know the person first.",
  },
  {
    id: "S10",
    axis: "style",
    poleA: "I like to take the time to do it right, even if it's slower.",
    poleB: "I like to decide fast and adjust as I go.",
  },
  {
    id: "F11",
    axis: "focus",
    poleA: "My emails are precise and to the point.",
    poleB: "My emails are warm and friendly.",
  },
  {
    id: "S11",
    axis: "style",
    poleA: "I usually let others set the direction and support it.",
    poleB: "I usually set the direction and expect others to follow.",
  },
];
