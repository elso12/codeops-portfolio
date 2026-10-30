"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom high-contrast SVG / DivIcon pins for crisp cross-platform rendering
const createIcon = (emoji, bgColor, borderColor = "#ffffff", pulse = false) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        position: relative;
        background: ${bgColor};
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        border: 2.5px solid ${borderColor};
        font-size: 20px;
        transition: transform 0.4s ease;
      ">
        ${emoji}
        ${pulse ? `<span style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid ${bgColor};
          animation: markerPulse 1.6s ease-out infinite;
          pointer-events: none;
        "></span>` : ""}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
};

const courierIcon = createIcon("🛵", "#f59e0b", "#fef3c7", true);
const destinationIcon = createIcon("📍", "#ef4444", "#fee2e2");
const restaurantIcon = createIcon("🍽️", "#10b981", "#d1fae5");

/**
 * MapBoundsUpdater: Fits the map bounds on initial load and when destination changes,
 * without interrupting the user when they pan or zoom.
 */
function MapBoundsUpdater({ courierPos, destPos, restaurantPos, recenterTrigger }) {
  const map = useMap();
  const hasFittedRef = useRef(false);
  const prevDestRef = useRef(null);

  useEffect(() => {
    if (!courierPos || !destPos) return;

    const destKey = `${destPos[0]},${destPos[1]}`;
    const isNewDest = prevDestRef.current !== destKey;

    if (!hasFittedRef.current || isNewDest) {
      try {
        const points = [courierPos, destPos];
        if (restaurantPos) points.push(restaurantPos);
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: true,
        });
        hasFittedRef.current = true;
        prevDestRef.current = destKey;
      } catch (e) {
        console.warn("Could not fit map bounds:", e);
      }
    }
  }, [courierPos, destPos, restaurantPos, map]);

  // Handle explicit recenter button clicks
  useEffect(() => {
    if (!recenterTrigger || !courierPos || !destPos) return;
    try {
      const points = [courierPos, destPos];
      if (restaurantPos) points.push(restaurantPos);
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
      });
    } catch (_) {}
  }, [recenterTrigger, courierPos, destPos, restaurantPos, map]);

  return null;
}

export default function DeliveryMap({
  courierPosition = [9.0060, 38.7770],
  destinationPosition = [8.9950, 38.7896],
  restaurantPosition = [9.0080, 38.7750],
  courierName = "Almaz Worku",
  destinationLabel = "Customer Destination",
  status = "on_the_way",
  etaMinutes = 8,
}) {
  const centerLat = (courierPosition[0] + destinationPosition[0]) / 2;
  const centerLng = (courierPosition[1] + destinationPosition[1]) / 2;
  const center = [centerLat, centerLng];

  // Completed segment: Restaurant -> Current Courier Location
  const completedSegment = [restaurantPosition, courierPosition];
  // Remaining segment: Current Courier Location -> Destination
  const remainingSegment = [courierPosition, destinationPosition];

  return (
    <div
      style={{
        position: "relative",
        height: "390px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        backgroundColor: "#0f172a",
      }}
    >
      <style jsx global>{`
        .custom-leaflet-marker,
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
        @keyframes markerPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", backgroundColor: "#0f172a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Bounds updater */}
        <MapBoundsUpdater
          courierPos={courierPosition}
          destPos={destinationPosition}
          restaurantPos={restaurantPosition}
        />

        {/* Traveled Route: Solid Emerald Green */}
        <Polyline
          positions={completedSegment}
          pathOptions={{
            color: "#10b981",
            weight: 5,
            opacity: 0.85,
          }}
        />

        {/* Remaining Route: Dashed Amber Corridor */}
        <Polyline
          positions={remainingSegment}
          pathOptions={{
            color: "#f59e0b",
            weight: 4,
            opacity: 0.8,
            dashArray: "6, 8",
          }}
        />

        {/* Origin Restaurant Pin */}
        {restaurantPosition && (
          <Marker position={restaurantPosition} icon={restaurantIcon}>
            <Popup>
              <div style={{ color: "#0f172a", fontSize: "0.85rem" }}>
                <strong style={{ color: "#059669" }}>🍽️ Mesob House</strong>
                <br />
                Bole Atlas Branch (Hearth Origin)
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live Courier Motorcycle Pin */}
        {courierPosition && (
          <Marker position={courierPosition} icon={courierIcon}>
            <Popup>
              <div style={{ color: "#0f172a", fontSize: "0.85rem" }}>
                <strong style={{ color: "#d97706" }}>🛵 {courierName}</strong>
                <br />
                Status: {status.replace(/_/g, " ")}
                <br />
                ETA: ~{etaMinutes} min
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Pin */}
        {destinationPosition && (
          <Marker position={destinationPosition} icon={destinationIcon}>
            <Popup>
              <div style={{ color: "#0f172a", fontSize: "0.85rem" }}>
                <strong style={{ color: "#dc2626" }}>📍 Delivery Destination</strong>
                <br />
                {destinationLabel}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          background: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(8px)",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          color: "#cbd5e1",
          display: "flex",
          gap: "12px",
          zIndex: 1000,
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>🍽️</span> Origin
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>🛵</span> Courier
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>📍</span> You
        </span>
      </div>
    </div>
  );
}
