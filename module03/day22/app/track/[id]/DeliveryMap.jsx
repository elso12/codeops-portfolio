"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom high-contrast SVG / DivIcon pins for crisp cross-platform rendering
const createIcon = (emoji, bgColor, borderColor = "#ffffff") => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background: ${bgColor};
        color: white;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
        border: 2.5px solid ${borderColor};
        font-size: 18px;
        transition: transform 0.3s ease;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const courierIcon = createIcon("🛵", "#f59e0b", "#fef3c7");
const destinationIcon = createIcon("📍", "#ef4444", "#fee2e2");
const restaurantIcon = createIcon("🍽️", "#10b981", "#d1fae5");

/**
 * Helper component inside MapContainer to dynamically fit bounds
 * to encompass both the courier and destination coordinates.
 */
function MapBoundsUpdater({ courierPos, destPos, restaurantPos }) {
  const map = useMap();

  useEffect(() => {
    if (!courierPos || !destPos) return;

    try {
      const points = [courierPos, destPos];
      if (restaurantPos) points.push(restaurantPos);
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
        animate: true,
      });
    } catch (e) {
      console.warn("Could not fit map bounds:", e);
    }
  }, [courierPos, destPos, restaurantPos, map]);

  return null;
}

export default function DeliveryMap({
  courierPosition = [8.9985, 38.7830],
  destinationPosition = [8.9950, 38.7896],
  restaurantPosition = [9.0080, 38.7750],
  courierName = "Almaz Worku",
  destinationLabel = "Customer Destination",
  status = "on_the_way",
  etaMinutes = 8,
}) {
  // Center roughly halfway between courier and destination
  const centerLat = (courierPosition[0] + destinationPosition[0]) / 2;
  const centerLng = (courierPosition[1] + destinationPosition[1]) / 2;
  const center = [centerLat, centerLng];

  // Route path line: restaurant -> courier -> destination
  const routePoints = [restaurantPosition, courierPosition, destinationPosition];

  return (
    <div
      style={{
        position: "relative",
        height: "380px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", backgroundColor: "#0f172a" }}
      >
        {/* OpenStreetMap TileLayer with strict license attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Bounds Auto-Fitter */}
        <MapBoundsUpdater
          courierPos={courierPosition}
          destPos={destinationPosition}
          restaurantPos={restaurantPosition}
        />

        {/* Route Corridor Polyline */}
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: "#3b82f6",
            weight: 4,
            opacity: 0.7,
            dashArray: "6, 8",
          }}
        />

        {/* Restaurant Pin */}
        {restaurantPosition && (
          <Marker position={restaurantPosition} icon={restaurantIcon}>
            <Popup>
              <strong>Mesob House</strong>
              <br />
              Bole Atlas Branch (Origin)
            </Popup>
          </Marker>
        )}

        {/* Courier Pin */}
        {courierPosition && (
          <Marker position={courierPosition} icon={courierIcon}>
            <Popup>
              <strong>{courierName} (Courier)</strong>
              <br />
              Status: {status.replace(/_/g, " ")}
              <br />
              ETA: ~{etaMinutes} min
            </Popup>
          </Marker>
        )}

        {/* Delivery Destination Pin */}
        {destinationPosition && (
          <Marker position={destinationPosition} icon={destinationIcon}>
            <Popup>
              <strong>Delivery Address</strong>
              <br />
              {destinationLabel}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(8px)",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          color: "#cbd5e1",
          display: "flex",
          gap: "12px",
          zIndex: 1000,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>🍽️</span> Restaurant
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
