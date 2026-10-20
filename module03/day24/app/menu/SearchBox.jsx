"use client";

import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useDebounce } from "@/lib/hooks";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

/**
 * app/menu/SearchBox.jsx — Client Component
 *
 * Implements Exercise 5 & 6 (Slide 22):
 * 1. Debounced search box (300ms) stops firing requests on every keystroke.
 * 2. Uses a `null` key when term is empty (`debounced ? ... : null`) -> zero unnecessary network calls.
 * 3. `keepPreviousData: true` holds old results while the next search query runs -> no list flashing.
 * 4. Automatic race-condition handling: SWR guarantees only the latest key's result is displayed.
 */
export default function SearchBox({ onSearchStateChange }) {
  const [term, setTerm] = useState("");
  const debounced = useDebounce(term, 300);

  // Key is null when debounced is empty.
  // keepPreviousData keeps existing results mounted during next fetch.
  const queryKey = debounced.trim()
    ? `/api/dishes?q=${encodeURIComponent(debounced.trim())}`
    : null;

  const { data: dishes, error, isLoading, isValidating } = useSWR(
    queryKey,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false, // Menu searches don't need instant focus refetches
    }
  );

  const hasSearch = Boolean(debounced.trim());
  const dishList = Array.isArray(dishes) ? dishes : dishes?.dishes || [];

  return (
    <div className="search-box-container" style={{ marginBottom: "2.5rem" }}>
      {/* Search Input Bar */}
      <div
        style={{
          position: "relative",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--card-bg, rgba(255, 255, 255, 0.05))",
            border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
            borderRadius: "12px",
            padding: "0.5rem 1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
        >
          <span style={{ fontSize: "1.25rem", marginRight: "0.75rem", opacity: 0.7 }}>
            🔍
          </span>
          <input
            id="dish-search-input"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setTerm("");
              }
            }}
            placeholder="Search Ethiopian dishes (e.g. Doro Wat, Tibs, Shiro, Kitfo)..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-main, #fff)",
              fontSize: "1.05rem",
              fontFamily: "inherit",
              minHeight: "44px",
            }}
          />

          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.5rem",
                minWidth: "44px",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
              title="Clear search (Escape)"
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}

          {isValidating && (
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.8rem",
                color: "var(--color-paprika, #e05a2b)",
                fontWeight: 600,
              }}
            >
              Searching...
            </span>
          )}
        </div>

        {/* Live Debug/Verification Pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0.5rem",
            padding: "0 0.5rem",
            fontSize: "0.78rem",
            color: "var(--text-dim, #888)",
            fontFamily: "monospace",
          }}
        >
          <span>
            SWR Key:{" "}
            <strong style={{ color: queryKey ? "var(--color-paprika)" : "var(--text-dim)" }}>
              {queryKey ? queryKey : "null (idle — no fetch)"}
            </strong>
          </span>
          <span>
            {isValidating
              ? "⚡ Fetching..."
              : hasSearch
              ? `✓ ${dishList.length} results (keepPreviousData active)`
              : "Type to search"}
          </span>
        </div>
      </div>

      {/* Search Results Display (Rendered when debounced term exists) */}
      {hasSearch && (
        <div style={{ marginTop: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "0.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--text-main)" }}>
              Live Search Results for &ldquo;{debounced}&rdquo;
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Showing {dishList.length} dishes
            </span>
          </div>

          {error && (
            <div className="form-error-banner" role="alert">
              Error fetching search results. Please try again.
            </div>
          )}

          {dishList.length === 0 && !isValidating && (
            <div
              className="empty-state"
              style={{
                padding: "2.5rem 1rem",
                textAlign: "center",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <span className="emoji" style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>
                🍲
              </span>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "1rem" }}>
                No dishes match &ldquo;{debounced}&rdquo;. Try &ldquo;Wat&rdquo;, &ldquo;Tibs&rdquo;, or &ldquo;Injera&rdquo;.
              </p>
            </div>
          )}

          {dishList.length > 0 && (
            <div className="dish-grid" style={{ opacity: isValidating ? 0.75 : 1, transition: "opacity 0.2s" }}>
              {dishList.map((dish) => (
                <article key={dish.id} className="card-figma" data-category={dish.category}>
                  <div className="card-figma__image-wrap">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="card-figma__img"
                      loading="lazy"
                    />
                    <span className="card-figma__tag">{dish.category}</span>
                  </div>
                  <div className="card-figma__body">
                    <div className="card-figma__header">
                      <div>
                        <h3 className="card-figma__title">{dish.name}</h3>
                        <span className={`status-pill ${dish.available ? "status-pill--available" : "status-pill--soldout"}`}>
                          {dish.available ? "● Available Fresh" : "○ Sold Out"}
                        </span>
                      </div>
                      <span className="card-figma__price">
                        {dish.price} <small>ETB</small>
                      </span>
                    </div>
                    <p className="card-figma__desc">{dish.description}</p>
                    <div className="card-figma__footer">
                      <Link
                        href={`/menu/${dish.id}`}
                        className="btn-link"
                        id={`search-view-${dish.id}`}
                      >
                        Details &rarr;
                      </Link>
                      <div className="card-figma__actions">
                        <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price, currency: dish.currency }} />
                        <Link
                          href={`/checkout?dishId=${dish.id}`}
                          className="btn-figma btn-figma--primary btn-figma--sm"
                          id={`search-order-${dish.id}`}
                        >
                          Order
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
