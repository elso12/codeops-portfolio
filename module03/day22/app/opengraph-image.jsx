import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Addis Eats · Authentic Habesha Dining";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "#180c07",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#fef3c7",
              }}
            >
              Addis Eats
            </span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 24px",
              borderRadius: "999px",
              background: "#e05624",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Addis Ababa, Ethiopia
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              marginBottom: "20px",
              display: "flex",
            }}
          >
            Communal Warmth, Slow-Cooked Heritage.
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#d1d5db",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Handcrafted wats, stone-ground 100% teff injera, sizzling tibs, and ceremonial coffee.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #3d1b11",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: "22px", color: "#fbd38d" }}>
            Fresh Kitchen Delivery Across Bole &amp; Kazanchis
          </div>
          <div style={{ display: "flex", fontSize: "24px", fontWeight: "bold", color: "#e05624" }}>
            addiseats.et
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
