import { getType } from "@/data/types";
import type { Result } from "@/lib/model";

function token(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function drawFiveprint(canvas: HTMLCanvasElement, result: Result): void {
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const bg = token("--bg", "#f3efe6");
  const card = token("--bg-elevated", "#fffdf8");
  const ink = token("--ink", "#1c1915");
  const muted = token("--ink-soft", "#4a453c");
  const accent = token("--accent", "#1f4d3a");
  const bar = token("--bar", "#e6decd");
  const type = getType(result.primary);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  roundRect(ctx, 64, 64, 952, 952, 48);
  ctx.fillStyle = card;
  ctx.fill();

  ctx.fillStyle = accent;
  roundRect(ctx, 112, 112, 92, 92, 20);
  ctx.fill();
  ctx.fillStyle = "#f7f4ec";
  ctx.font = "700 36px Georgia, serif";
  ctx.fillText("F5", 132, 170);

  ctx.fillStyle = muted;
  ctx.font = "600 28px Georgia, serif";
  ctx.fillText("FIVEPRINT", 230, 168);

  ctx.fillStyle = ink;
  ctx.font = "700 92px Georgia, serif";
  ctx.fillText(type.label, 112, 340);
  ctx.fillStyle = muted;
  ctx.font = "500 32px Georgia, serif";
  ctx.fillText(`${type.code}  ·  ${type.quadrant}`, 112, 400);
  wrapText(ctx, type.headline, 112, 470, 820, 44, "500 36px Georgia, serif", ink);

  drawBar(ctx, 112, 620, 820, "Style", result.style, bar, card, ink);
  drawBar(ctx, 112, 730, 820, "Focus", result.focus, bar, card, ink);

  ctx.fillStyle = muted;
  ctx.font = "500 28px Georgia, serif";
  ctx.fillText("Do unto others as they would like to be done unto.", 112, 900);
}

function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  label: string,
  value: number,
  track: string,
  card: string,
  ink: string,
) {
  ctx.fillStyle = ink;
  ctx.font = "600 28px Georgia, serif";
  ctx.fillText(`${label}  ${value}`, x, y);
  roundRect(ctx, x, y + 22, width, 14, 7);
  ctx.fillStyle = track;
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.fillRect(x + width / 2 - 1, y + 16, 2, 26);
  ctx.beginPath();
  ctx.arc(x + (value / 100) * width, y + 29, 14, 0, Math.PI * 2);
  ctx.fillStyle = ink;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = card;
  ctx.stroke();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  max: number,
  lineHeight: number,
  font: string,
  color: string,
) {
  ctx.font = font;
  ctx.fillStyle = color;
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > max && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = trial;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
}
