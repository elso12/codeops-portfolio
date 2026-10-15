"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

/**
 * app/menu/PagedDishList.jsx — Client Component
 *
 * Implements Exercise 7 (Slide 23):
 * 1. Simple paging — the page number is part of the key:
 *    `useSWR('/api/dishes?page=' + page, fetcher, { fallbackData: initialData, keepPreviousData: true })`
 * 2. `keepPreviousData: true` holds the previous page's dishes visible while the next page loads,
 *    preventing any flashing or jumping on screen.
 * 3. `fallbackData: initialData` seeds the first paint from the server (zero spinner).
 * 4. Page number is synchronized with the URL query string (`/menu?page=2`), making every page
 *    fully linkable, bookmarkable, and shareable.
 */
export default function PagedDishList({ initialData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);

  // SWR query key includes page number: changes in ?page= trigger a refetch
  const { data, isValidating } = useSWR(
    `/api/dishes?page=${currentPage}`,
    fetcher,
    {
      fallbackData: initialData?.page === currentPage ? initialData : undefined,
      keepPreviousData: true, // Prevents list from flashing empty between page switches
    }
  );

  const dishes = data?.dishes || data?.items || initialData?.dishes || [];
  const totalPages = data?.totalPages || initialData?.totalPages || 1;
  const total = data?.total || initialData?.total || dishes.length;

  function goToPage(p) {
    if (p < 1 || p > totalPages || p === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/menu?${params.toString()}`);
  }

  return (
    <div className="paged-dish-list-container">
      {/* Header with paging metadata */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.4rem", margin: "0 0 0.25rem 0", color: "var(--text-main)" }}>
            Full Banquet Dishes
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing page {currentPage} of {totalPages} ({total} total delicacies)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isValidating && (
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--color-paprika)",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-paprika)",
                  display: "inline-block",
                  animation: "pulse 1.5s infinite",
                }}
              />
              Loading page {currentPage}...
            </span>
          )}

          <div
            style={{
              fontSize: "0.78rem",
              fontFamily: "monospace",
              background: "rgba(255, 255, 255, 0.04)",
              padding: "0.3rem 0.65rem",
              borderRadius: "6px",
              color: "var(--text-dim)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            Key: /api/dishes?page={currentPage}
          </div>
        </div>
      </div>

      {/* Grid of Dishes */}
      <div
        className="dish-grid"
        style={{
          opacity: isValidating ? 0.75 : 1,
          transition: "opacity 0.25s ease",
        }}
      >
        {dishes.map((dish) => (
          <article key={dish.id} className="card-figma" data-category={dish.category}>
            <div className="card-figma__image-wrap">
              <img
                src={dish.image}
                alt={dish.name}
                className="card-figma__img"
                loading="lazy"
              />
              <span className="card-figma__tag">{dish.category}</span>
            </div>
            <div className="card-figma__body">
              <div className="card-figma__header">
                <div>
                  <h3 className="card-figma__title">{dish.name}</h3>
                  <span
                    className={`status-pill ${
                      dish.available ? "status-pill--available" : "status-pill--soldout"
                    }`}
                  >
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
                  id={`view-${dish.id}`}
                >
                  Details &rarr;
                </Link>
                <div className="card-figma__actions">
                  <AddToCartButton
                    dish={{
                      id: dish.id,
                      name: dish.name,
                      price: dish.price,
                      currency: dish.currency,
                    }}
                  />
                  <Link
                    href={`/checkout?dishId=${dish.id}`}
                    className="btn-figma btn-figma--primary btn-figma--sm"
                    id={`order-${dish.id}`}
                  >
                    Order
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      <nav
        aria-label="Dish pagination"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "3rem",
          flexWrap: "wrap",
        }}
      >
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-figma btn-figma--sand btn-figma--sm"
          style={{ opacity: currentPage <= 1 ? 0.45 : 1, cursor: currentPage <= 1 ? "not-allowed" : "pointer" }}
          id="pagination-prev"
        >
          &larr; Previous
        </button>

        {/* Numbered Page Buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`btn-figma ${isActive ? "btn-figma--primary" : "btn-figma--sand"} btn-figma--sm`}
              style={{
                minWidth: "38px",
                fontWeight: isActive ? 700 : 500,
                boxShadow: isActive ? "0 0 10px rgba(224, 90, 43, 0.4)" : "none",
              }}
              id={`pagination-page-${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-figma btn-figma--sand btn-figma--sm"
          style={{
            opacity: currentPage >= totalPages ? 0.45 : 1,
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
          }}
          id="pagination-next"
        >
          Next &rarr;
        </button>
      </nav>
    </div>
  );
}
