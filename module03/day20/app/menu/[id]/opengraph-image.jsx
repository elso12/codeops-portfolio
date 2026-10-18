import { ImageResponse } from "next/og";
import { getDishById } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Addis Eats Dish Preview";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = getDishById(id);

  const name = dish ? dish.name : "Authentic Habesha Dish";
  const price = dish ? `${dish.price} ETB` : "Addis Eats";
  const category = dish ? dish.category : "Menu";
  const description = dish
    ? dish.description
    : "Handcrafted traditional Ethiopian cuisine served fresh with 100% teff injera.";

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
                fontSize: "32px",
                fontWeight: "bold",
                color: "#fef3c7",
              }}
            >
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
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#d1d5db",
              lineHeight: 1.45,
              display: "flex",
            }}
          >
            {description}
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
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: "24px", color: "#9ca3af", marginRight: "12px" }}>
              Price:
            </span>
            <span style={{ fontSize: "56px", fontWeight: 900, color: "#f97316" }}>
              {price}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              padding: "12px 28px",
              borderRadius: "12px",
              background: "#e05624",
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Order on addiseats.et
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
