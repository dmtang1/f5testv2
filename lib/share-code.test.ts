import { sampleResult } from "@/data/sample";
import { describe, expect, it } from "vitest";
import { scoreAnswers } from "@/lib/scoring";
import { questions } from "@/data/questions";
import { buildSharePath, decodeShareCode, encodeShareCode, parseShareInput, sanitizeName } from "@/lib/share-code";

function all(pole: 0 | 1) {
  return Object.fromEntries(questions.map((question) => [question.id, pole])) as Record<string, 0 | 1>;
}

describe("share codes", () => {
  it("round-trips every quadrant", () => {
    for (const result of [
      scoreAnswers(all(0)),
      scoreAnswers(all(1)),
      scoreAnswers({ ...all(0), ...Object.fromEntries(questions.filter((q) => q.axis === "style").map((q) => [q.id, 1])) }),
      scoreAnswers({ ...all(1), ...Object.fromEntries(questions.filter((q) => q.axis === "style").map((q) => [q.id, 0])) }),
    ]) {
      const decoded = decodeShareCode(encodeShareCode(result));
      expect(decoded).toMatchObject({
        primary: result.primary,
        focus: result.focus,
        style: result.style,
      });
      expect(decoded?.secondary).toBe(result.secondary);
    }
  });

  it("accepts the sample code and rejects tampering", () => {
    expect(encodeShareCode(sampleResult)).toBe("DI-MO-78-41");
    expect(decodeShareCode("di-mo-78-41")?.primary).toBe("director");
    expect(decodeShareCode("DI-78-41")).toBeNull();
    expect(decodeShareCode("DI-0-0")).toBeNull();
    expect(decodeShareCode("NOPE")).toBeNull();
    expect(decodeShareCode("DE-DI-0-0")).toBeNull();
    expect(decodeShareCode("DE-0-0")?.primary).toBe("defender");
    expect(decodeShareCode("MO-100-100")?.primary).toBe("motivator");
  });

  it("keeps email-like names and private data out of the path", () => {
    expect(sanitizeName("Ada")).toBe("Ada");
    expect(sanitizeName("ada@example.com")).toBeUndefined();
    const path = buildSharePath({ ...sampleResult, name: "Ada", shareName: false });
    expect(path).not.toContain("Ada");
    expect(path).toContain("v=0.1-draft");
    const named = buildSharePath({ ...sampleResult, name: "Ada", shareName: true });
    expect(named).toContain("n=Ada");
    expect(parseShareInput(`https://example.com${named}`)).toEqual({ type: "director", name: "Ada" });
  });
});
