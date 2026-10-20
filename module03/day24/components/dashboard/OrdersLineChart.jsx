"use client";
import { useState } from "react";

/**
 * OrdersLineChart
 *
 * Requirements:
 * 1. Heading naming the range and the unit: "Daily Order Volume (Oct 10 – Oct 20, 2026) · Unit: Orders / Day".
 * 2. Fixed-height container.
 * 3. Readable without colour (geometric data point markers + high contrast stroke + direct numeric labels).
 * 4. Put the same chart data in an accessible HTML table beneath it for anyone who cannot see the SVG.
 */
export default function OrdersLineChart({
  data = [],
  range = { label: "Oct 10 – Oct 20, 2026", unit: "Orders / Day" },
}) {
  const [showTable, setShowTable] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="chart-card" style={{ height: "380px" }}>
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Daily Order Volume</h3>
            <p className="chart-subtitle">
              Range: {range.label} • Unit: {range.unit}
            </p>
          </div>
        </div>
        <div className="chart-empty-box" style={{ height: "280px" }}>
          <p>No timeline data available for this range.</p>
        </div>
      </div>
    );
  }

  // Calculate scales — Baseline MUST start at zero
  const maxCount = Math.max(...data.map((d) => d.count), 4);
  const yMax = Math.ceil(maxCount / 2) * 2; // Clean even intervals
  const numTicks = Math.min(yMax, 6);
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) =>
    Math.round((yMax / numTicks) * i)
  );

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingLeft = 65;
  const paddingRight = 25;
  const paddingTop = 30;
  const paddingBottom = 45;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const pointCount = data.length;
  const stepX = pointCount > 1 ? chartWidth / (pointCount - 1) : chartWidth;

  // Calculate coordinates for points
  const points = data.map((item, idx) => {
    const x = paddingLeft + idx * stepX;
    const y = paddingTop + chartHeight - (item.count / yMax) * chartHeight;
    return { ...item, x, y };
  });

  // Build SVG path d string
  const linePathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  // Area path for subtle backdrop
  const areaPathD =
    points.length > 0
      ? `${linePathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  // Geometric markers alternating for non-color identification
  const markerShapes = ["circle", "diamond", "square"];

  return (
    <section className="chart-card" aria-labelledby="orders-line-chart-heading">
      <div className="chart-header">
        <div>
          <h3 id="orders-line-chart-heading" className="chart-title">
            Daily Order Volume Timeline
          </h3>
          <p className="chart-subtitle">
            Range: <strong>{range.label}</strong> • Unit: <strong>{range.unit}</strong> • Baseline:{" "}
            <strong>0 Orders</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          className="btn-figma btn-figma--outline btn-sm"
          aria-expanded={showTable}
          aria-controls="orders-line-companion-table"
        >
          {showTable ? "Hide Raw Table" : "View Raw Table"}
        </button>
      </div>

      {/* Fixed-height container to guarantee zero Cumulative Layout Shift (CLS) */}
      <div
        className="chart-container"
        style={{ height: "260px", position: "relative", width: "100%" }}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`Line chart of daily orders over time. Range: ${range.label}. Unit: ${range.unit}. Total volume is ${data.reduce((s, d) => s + d.count, 0)} orders.`}
          className="chart-svg"
        >
          <title>Daily Order Volume Line Chart</title>
          <desc>
            Line graph illustrating order volume per day across Addis Ababa. Baseline begins at 0.
          </desc>

          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b87a18" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b87a18" stopOpacity="0.02" />
            </linearGradient>
            <pattern id="line-dots-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.2" fill="#5c5248" />
            </pattern>
          </defs>

          {/* Grid lines and Y-axis ticks */}
          {ticks.map((tickVal) => {
            const y = paddingTop + chartHeight - (tickVal / yMax) * chartHeight;
            const isZero = tickVal === 0;
            return (
              <g key={`y-grid-${tickVal}`} className="chart-grid-group">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke={isZero ? "#1f1916" : "rgba(0, 0, 0, 0.08)"}
                  strokeWidth={isZero ? 2 : 1}
                  strokeDasharray={isZero ? "none" : "3 3"}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight={isZero ? "700" : "500"}
                  fill={isZero ? "#1f1916" : "#5c5248"}
                >
                  {tickVal} ord
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaPathD} fill="url(#areaGradient)" pointerEvents="none" />

          {/* Main trend line (high contrast stroke) */}
          <path
            d={linePathD}
            fill="none"
            stroke="#8f2a15"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points with distinct geometric shapes + numeric labels (readable without color) */}
          {points.map((pt, idx) => {
            const shape = markerShapes[idx % markerShapes.length];
            const isHovered = hoveredPoint === pt.date;

            return (
              <g
                key={`point-${pt.date}`}
                role="graphics-symbol"
                aria-label={`${pt.label}: ${pt.count} orders (${pt.revenue} ETB)`}
                tabIndex={0}
                onMouseEnter={() => setHoveredPoint(pt.date)}
                onMouseLeave={() => setHoveredPoint(null)}
                onFocus={() => setHoveredPoint(pt.date)}
                onBlur={() => setHoveredPoint(null)}
                style={{ cursor: "pointer", outline: isHovered ? "3px solid var(--color-paprika)" : "none", outlineOffset: "2px" }}
              >
                {/* Geometric Markers */}
                {shape === "circle" && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 7 : 5.5}
                    fill="#1f1916"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                )}
                {shape === "diamond" && (
                  <polygon
                    points={`${pt.x},${pt.y - (isHovered ? 8 : 6.5)} ${pt.x + (isHovered ? 8 : 6.5)},${pt.y} ${pt.x},${pt.y + (isHovered ? 8 : 6.5)} ${pt.x - (isHovered ? 8 : 6.5)},${pt.y}`}
                    fill="#b87a18"
                    stroke="#1f1916"
                    strokeWidth="2"
                  />
                )}
                {shape === "square" && (
                  <rect
                    x={pt.x - (isHovered ? 6 : 5)}
                    y={pt.y - (isHovered ? 6 : 5)}
                    width={isHovered ? 12 : 10}
                    height={isHovered ? 12 : 10}
                    fill="#1c5836"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}

                {/* Direct Number Label printed above node (monochrome readable) */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#1f1916"
                >
                  {pt.count}
                </text>

                {/* X-axis date label */}
                <text
                  x={pt.x}
                  y={paddingTop + chartHeight + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered ? "700" : "500"}
                  fill="#1f1916"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Focus Tooltip */}
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              position: "absolute",
              top: "10px",
              right: "15px",
              background: "rgba(25, 19, 17, 0.95)",
              color: "#faf4ec",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            <strong>{data.find((d) => d.date === hoveredPoint)?.label}</strong>:{" "}
            {data.find((d) => d.date === hoveredPoint)?.count} orders (
            {data.find((d) => d.date === hoveredPoint)?.revenue.toLocaleString()} ETB)
          </div>
        )}
      </div>

      {/* Accessible Companion Table: For screen readers and spreadsheet copying */}
      <div
        id="orders-line-companion-table"
        className={`companion-table-wrapper ${showTable ? "companion-table--visible" : ""}`}
        style={{ display: showTable ? "block" : "none", marginTop: "1.25rem" }}
      >
        <table className="dashboard-table dashboard-table--compact">
          <caption className="table-caption">
            Daily Order Volume Timeline Data — {range.label} ({range.unit})
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col" style={{ textAlign: "right" }}>
                Order Volume ({range.unit})
              </th>
              <th scope="col" style={{ textAlign: "right" }}>
                Daily Revenue (ETB)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={`raw-timeline-${row.date}`}>
                <th scope="row" style={{ fontWeight: 600 }}>
                  {row.label} ({row.date})
                </th>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {row.count} orders
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {row.revenue.toLocaleString()} ETB
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 700, borderTop: "2px solid #1f1916" }}>
              <th scope="row">Total Period Orders</th>
              <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {data.reduce((sum, r) => sum + r.count, 0)} orders
              </td>
              <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {data.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()} ETB
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
