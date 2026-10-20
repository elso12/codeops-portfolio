"use client";

import dynamic from "next/dynamic";

/**
 * MapPanel wraps DeliveryMap using Next.js dynamic import with ssr: false.
 * Leaflet references `window` on module execution, so ssr: false is essential
 * to prevent server-side render crashes during static prerendering or SSR.
 *
 * Sized placeholder (380px) guarantees zero Cumulative Layout Shift (0.000 CLS).
 */
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "380px",
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#94a3b8",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
      aria-label="Loading delivery map"
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid rgba(245, 158, 11, 0.2)",
          borderTopColor: "#f59e0b",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: "14px", fontSize: "0.875rem", letterSpacing: "0.02em" }}>
        Loading Addis Ababa delivery map...
      </p>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  ),
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}
