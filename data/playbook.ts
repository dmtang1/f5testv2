import type { TypeId } from "@/lib/model";
import { TYPE_IDS } from "@/lib/model";

/**
 * Rows = the other person. Columns = you.
 * Orientation reconstructed from the deck and flagged for client confirmation.
 * Spellings such as "flare" and "show" are preserved.
 */
export const playbook: Record<TypeId, Record<TypeId, readonly string[]>> = {
  director: {
    director: ["Don't impose view", "Give control", "Be receptive"],
    motivator: ["Less personal", "More practical", "Give options"],
    defender: ["Be more direct", "Stay private", "Not too much detail"],
    teammate: ["Be more direct", "Be less personal", "Get to the point"],
  },
  motivator: {
    director: ["Stay direct", "More open", 'More "show"'],
    motivator: ["Be disciplined", "Give structure", "Written summary"],
    defender: ["Be more direct", "Be more open", "More style"],
    teammate: ["Be more direct", "Stay personal", "Add flare"],
  },
  defender: {
    director: ["Less direct", "Stay private", "More detail/facts"],
    motivator: ["Less direct", "Less open", "More process"],
    defender: ["Control process", "Let client decide", "Accept imperfection"],
    teammate: ["Less personal", "Factual and detail oriented"],
  },
  teammate: {
    director: ["More personal", "Less direct", "Assure low risk"],
    motivator: ["Stay personal", "Less direct", "Assure low risk"],
    defender: ["Stay indirect", "More personal", "Informal"],
    teammate: ["Not too much small talk", "Initiate action", "Set deadlines"],
  },
};

export function tipsFor(you: TypeId, other: TypeId): readonly string[] {
  return playbook[other][you];
}

export function allCells(): { you: TypeId; other: TypeId; tips: readonly string[] }[] {
  const cells = [];
  for (const other of TYPE_IDS) {
    for (const you of TYPE_IDS) {
      cells.push({ you, other, tips: playbook[other][you] });
    }
  }
  return cells;
}
