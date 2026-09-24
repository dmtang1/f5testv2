import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { allCells } from "@/data/playbook";
import { questions } from "@/data/questions";
import { comparison, framework, teasers } from "@/data/site";
import { types } from "@/data/types";

const banned = ["mohegan", "foxwoods", "bob barker", "letterman", "myers-briggs", "mbti"];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git" || entry === "test-results" || entry === "playwright-report") {
      continue;
    }
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe("content integrity", () => {
  it("keeps 22 interleaved questions", () => {
    expect(questions).toHaveLength(22);
    questions.forEach((question, index) => {
      expect(question.axis).toBe(index % 2 === 0 ? "focus" : "style");
    });
    expect(questions[0].poleA).toContain("objective analysis");
    expect(questions.at(-1)?.poleB).toContain("set the direction");
  });

  it("keeps all 16 playbook cells, including the two-tip teammate cell", () => {
    expect(allCells()).toHaveLength(16);
    const short = allCells().find((cell) => cell.you === "teammate" && cell.other === "defender");
    expect(short?.tips).toEqual(["Less personal", "Factual and detail oriented"]);
    expect(allCells().filter((cell) => !(cell.you === "teammate" && cell.other === "defender")).every((cell) => cell.tips.length === 3)).toBe(true);
    expect(types.director.traits).toContain("Want options");
    expect(types.motivator.traits).toContain("Don't hold grudges");
    expect(types.defender.traits).toContain("Like graphs, charts, figures, lists");
    expect(types.teammate.traits).toContain("Cool, calm, collected");
  });

  it("labels unfinished framework items and limits comparison claims", () => {
    expect(framework.find((item) => item.id === "F1")?.status).toBe("Live");
    expect(framework.find((item) => item.id === "F4")?.status).toBe("Partly live");
    for (const id of ["F2", "F3", "F5"]) expect(framework.find((item) => item.id === id)?.status).toBe("Coming soon");
    expect(teasers.every((item) => item.status === "Coming soon")).toBe(true);
    const blob = JSON.stringify(comparison).toLowerCase();
    expect(blob).not.toContain("mbti");
    expect(blob).not.toContain("famous five");
    expect(blob).not.toContain("30-day");
  });

  it("does not ship excluded workshop content in app source", () => {
    const files = walk(process.cwd()).filter((file) => {
      if (file.endsWith("requirements-4.md")) return false;
      if (file.endsWith(".test.ts")) return false;
      return [".ts", ".tsx", ".css", ".json", ".svg"].includes(path.extname(file));
    });
    const haystack = files
      .filter((file) => !file.includes(`${path.sep}lib${path.sep}content.test.ts`))
      .map((file) => readFileSync(file, "utf8").toLowerCase())
      .join("\n");
    for (const term of banned) expect(haystack).not.toContain(term);
  });
});
