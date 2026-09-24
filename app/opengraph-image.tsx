import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "F5 Test — Chemistry by Design";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#1f4d3a", color: "#f7f4ec", padding: "72px", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 42 }}>F5 · Chemistry by Design</div>
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.1 }}>A smarter way to understand how you work with people.</div>
      </div>
    ),
    size,
  );
}
