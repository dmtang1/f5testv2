import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: 32, height: 32, background: "#1f4d3a", color: "#f7f4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
        F5
      </div>
    ),
    size,
  );
}
