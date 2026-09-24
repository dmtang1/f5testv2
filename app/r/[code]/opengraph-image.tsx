import { getType } from "@/data/types";
import { decodeShareCode } from "@/lib/share-code";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ code: "DE-0-0" }];
}

export const dynamicParams = false;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "F5 Fiveprint card";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const decoded = decodeShareCode(code);
  const type = decoded ? getType(decoded.primary) : null;
  const style = decoded?.style ?? 50;
  const focus = decoded?.focus ?? 50;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f3efe6", padding: "48px", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#fffdf8", borderRadius: "32px", padding: "40px", border: "2px solid #1c1915" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#1f4d3a" }}>
            <span>F5</span>
            <span>{type ? type.code : "Fiveprint"}</span>
          </div>
          <div style={{ fontSize: 84, marginTop: 24, color: "#1c1915" }}>{type ? type.label : "F5 Test"}</div>
          <div style={{ fontSize: 28, color: "#4a453c", marginTop: 8 }}>{type ? type.headline : "Chemistry by Design"}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 36, gap: 16 }}>
            <div style={{ display: "flex", fontSize: 22, color: "#1c1915" }}>Style {style}</div>
            <div style={{ display: "flex", height: 18, width: 700, background: "#e6decd", borderRadius: 9 }}>
              <div style={{ display: "flex", width: `${Math.max(8, style * 7)}px`, height: 18, background: "#1f4d3a", borderRadius: 9 }} />
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#1c1915" }}>Focus {focus}</div>
            <div style={{ display: "flex", height: 18, width: 700, background: "#e6decd", borderRadius: 9 }}>
              <div style={{ display: "flex", width: `${Math.max(8, focus * 7)}px`, height: 18, background: "#1f4d3a", borderRadius: 9 }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
