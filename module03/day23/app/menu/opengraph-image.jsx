import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Addis Eats Full Banquet Menu";

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
            <span style={{ fontSize: "32px", fontWeight: "bold", color: "#fef3c7" }}>
              Addis Eats · Mesob House
            </span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 22px",
              borderRadius: "999px",
              background: "#d97706",
              color: "#180c07",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            Full Banquet Catalog
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
              color: "#ffffff",
              lineHeight: 1.15,
              marginBottom: "16px",
              display: "flex",
            }}
          >
            Authentic Habesha Menu
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#d1d5db",
              lineHeight: 1.45,
              display: "flex",
            }}
          >
            Royal Doro Wat, Sizzling Tibs, Velvety Kitfo, Fasting Beyaynetu, and 100% Teff Injera.
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
            Slow-Simmered Wats Delivered Across Addis Ababa
          </div>
          <div style={{ display: "flex", fontSize: "24px", fontWeight: "bold", color: "#e05624" }}>
            addiseats.et/menu
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
