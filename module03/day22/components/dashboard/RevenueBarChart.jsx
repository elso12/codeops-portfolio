"use client";
import { useState } from "react";
import { etb } from "@/lib/format";

/**
 * RevenueBarChart
 *
 * Requirements:
 * 1. Fixed-height container (prevents Cumulative Layout Shift).
 * 2. Axis strictly starts at zero (0 ETB).
 * 3. Ticks formatted in ETB.
 * 4. Readable without colour (monochrome / color-blind accessible with SVG pattern fills + bold direct data labels).
 * 5. Every chart accompanied by the same data in an accessible HTML table beneath it.
 */
export default function RevenueBarChart({ data = [], currency = "ETB" }) {
  const [showTable, setShowTable] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);

  // If no data, render graceful placeholder within fixed height
  if (!data || data.length === 0) {
    return (
      <div className="chart-card" style={{ height: "380px" }}>
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Revenue by Neighbourhood</h3>
            <p className="chart-subtitle">Unit: {currency} • Baseline: 0 {currency}</p>
          </div>
        </div>
        <div className="chart-empty-box" style={{ height: "280px" }}>
          <p>No neighbourhood revenue recorded yet.</p>
        </div>
      </div>
    );
  }

  // Calculate scales — Baseline MUST start at zero
  const maxVal = Math.max(...data.map((d) => d.revenue), 100);
  // Round up to clean tick increments (e.g., 500, 1000, 2000)
  const tickStep = maxVal > 3000 ? 1000 : maxVal > 1500 ? 500 : 250;
  const yMax = Math.ceil(maxVal / tickStep) * tickStep;
  const numTicks = 5;
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => Math.round((yMax / numTicks) * i));

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingLeft = 75;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const barCount = data.length;
  const slotWidth = chartWidth / barCount;
  const barWidth = Math.min(Math.max(slotWidth * 0.65, 24), 54);

  // SVG Texture Patterns for color-blind / monochrome readability
  const patterns = [
    { id: "pat-stripes-diag", label: "Diagonal Stripes" },
    { id: "pat-dots", label: "Dot Matrix" },
    { id: "pat-crosshatch", label: "Crosshatch" },
    { id: "pat-horizontal", label: "Horizontal Lines" },
    { id: "pat-dense-stripes", label: "Dense Stripes" },
    { id: "pat-checkers", label: "Checkered" },
    { id: "pat-zigzag", label: "Zigzag" },
    { id: "pat-stipple", label: "Stipple" },
  ];

  return (
    <section className="chart-card" aria-labelledby="revenue-chart-heading">
      <div className="chart-header">
        <div>
          <h3 id="revenue-chart-heading" className="chart-title">
            Revenue by Neighbourhood
          </h3>
          <p className="chart-subtitle">
            Unit: <strong>{currency} (Ethiopian Birr)</strong> • Y-Axis Baseline:{" "}
            <strong>0 {currency}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          className="btn-figma btn-figma--outline btn-sm"
          aria-expanded={showTable}
          aria-controls="revenue-companion-table"
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
          aria-label={`Bar chart of revenue by neighbourhood in ${currency}. Highest neighbourhood is ${data[0]?.area} with ${data[0]?.revenue} ${currency}.`}
          className="chart-svg"
        >
          <title>Revenue by Neighbourhood Bar Chart</title>
          <desc>
            Displays revenue generated in Ethiopian Birr across Addis Ababa neighbourhoods. Axis
            starts strictly at zero.
          </desc>

          {/* Pattern Definitions for non-color identification */}
          <defs>
            <pattern id="pat-stripes-diag" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ffffff" strokeWidth="2.5" />
            </pattern>
            <pattern id="pat-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2" fill="#ffffff" />
            </pattern>
            <pattern id="pat-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="8" y2="8" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="8" y1="0" x2="0" y2="8" stroke="#ffffff" strokeWidth="1.5" />
            </pattern>
            <pattern id="pat-horizontal" width="8" height="8" patternUnits="userSpaceOnUse">
              <line x1="0" y1="4" x2="8" y2="4" stroke="#ffffff" strokeWidth="2" />
            </pattern>
            <pattern id="pat-dense-stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeWidth="2" />
            </pattern>
            <pattern id="pat-checkers" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="5" height="5" fill="#ffffff" />
              <rect x="5" y="5" width="5" height="5" fill="#ffffff" />
            </pattern>
            <pattern id="pat-zigzag" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 5 5 L 10 0" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </pattern>
            <pattern id="pat-stipple" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffffff" />
              <circle cx="5" cy="5" r="1" fill="#ffffff" />
            </pattern>
          </defs>

          {/* Grid lines and ETB Y-axis ticks */}
          {ticks.map((tickVal) => {
            const y = paddingTop + chartHeight - (tickVal / yMax) * chartHeight;
            const isZero = tickVal === 0;
            return (
              <g key={`y-tick-${tickVal}`} className="chart-grid-group">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke={isZero ? "#1f1916" : "rgba(0, 0, 0, 0.1)"}
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
                  {etb.format(tickVal)}
                </text>
              </g>
            );
          })}

          {/* Bars with both Pattern Fill and Direct Value Labels */}
          {data.map((item, idx) => {
            const barHeight = (item.revenue / yMax) * chartHeight;
            const x = paddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
            const y = paddingTop + chartHeight - barHeight;
            const patId = patterns[idx % patterns.length].id;
            const isHovered = hoveredBar === item.area;

            // Brand accent colors paired with patterns
            const baseColors = [
              "#8f2a15", // Paprika
              "#b87a18", // Turmeric
              "#1c5836", // Forest
              "#6a3512", // Roasted Coffee
              "#ad3921", // Paprika Light
              "#e09b2d", // Turmeric Light
              "#287a4c", // Forest Light
              "#4a2810", // Dark Teff
            ];
            const fillColor = baseColors[idx % baseColors.length];

            return (
              <g
                key={`bar-${item.area}`}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${item.area}: ${item.revenue} ${currency} from ${item.orderCount} orders`}
                onMouseEnter={() => setHoveredBar(item.area)}
                onMouseLeave={() => setHoveredBar(null)}
                onFocus={() => setHoveredBar(item.area)}
                onBlur={() => setHoveredBar(null)}
                style={{ cursor: "pointer", outline: "none" }}
              >
                {/* Base colored solid bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={fillColor}
                  stroke="#1f1916"
                  strokeWidth="1.5"
                  rx="3"
                  opacity={isHovered ? 1 : 0.92}
                />
                {/* Pattern overlay for monochrome / colorblind readability */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#${patId})`}
                  opacity="0.35"
                  rx="3"
                  pointerEvents="none"
                />

                {/* Direct Numeric Label on Top of Every Bar (Readable without color) */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill="#1f1916"
                >
                  {item.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(1)}k` : item.revenue}
                </text>

                {/* X-axis label: Neighbourhood Name */}
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + chartHeight + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? "700" : "600"}
                  fill="#1f1916"
                >
                  {item.area.split(" ")[0]}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + chartHeight + 29}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#5c5248"
                >
                  {item.orderCount} ord
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Focus Tooltip Overlay */}
        {hoveredBar && (
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
            <strong>{hoveredBar}</strong>:{" "}
            {data.find((d) => d.area === hoveredBar)?.revenue.toLocaleString()} {currency} (
            {data.find((d) => d.area === hoveredBar)?.orderCount} orders)
          </div>
        )}
      </div>

      {/* Accessible Table Companion: Always present in DOM, visibly toggleable */}
      <div
        id="revenue-companion-table"
        className={`companion-table-wrapper ${showTable ? "companion-table--visible" : ""}`}
        style={{ display: showTable ? "block" : "none", marginTop: "1.25rem" }}
      >
        <table className="dashboard-table dashboard-table--compact">
          <caption className="table-caption">
            Revenue by Neighbourhood — Raw Summary Data ({currency})
          </caption>
          <thead>
            <tr>
              <th scope="col">Neighbourhood</th>
              <th scope="col" style={{ textAlign: "right" }}>
                Total Revenue ({currency})
              </th>
              <th scope="col" style={{ textAlign: "right" }}>
                Order Count
              </th>
              <th scope="col" style={{ textAlign: "right" }}>
                Average / Order
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={`raw-row-${row.area}`}>
                <th scope="row" style={{ fontWeight: 600 }}>
                  {row.area}
                </th>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {etb.format(row.revenue)}
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {row.orderCount}
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {row.orderCount > 0
                    ? etb.format(Math.round(row.revenue / row.orderCount))
                    : etb.format(0)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 700, borderTop: "2px solid #1f1916" }}>
              <th scope="row">All Neighbourhoods Total</th>
              <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {etb.format(data.reduce((sum, r) => sum + r.revenue, 0))}
              </td>
              <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {data.reduce((sum, r) => sum + r.orderCount, 0)}
              </td>
              <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {etb.format(
                  Math.round(
                    data.reduce((sum, r) => sum + r.revenue, 0) /
                      Math.max(1, data.reduce((sum, r) => sum + r.orderCount, 0))
                  )
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
