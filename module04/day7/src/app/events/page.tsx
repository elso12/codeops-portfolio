"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { getEvents } from "@/services/eventService";
import { PaginatedEvents, EventQueryParams } from "@/types/event";
import EventCard from "@/components/EventCard";
import Loading from "@/components/Loading";

export default function EventsPage() {
  // Backend query states
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isPublished, setIsPublished] = useState<string>("all"); // "all" | "true" | "false"
  const [sortBy, setSortBy] = useState<"eventDate" | "title">("eventDate");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState<number>(1);
  const limit = 6;

  // Frontend-only title search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data & request states
  const [data, setData] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from backend API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: EventQueryParams = {
        page,
        limit,
        sortBy,
        order,
      };

      if (category.trim()) {
        params.category = category.trim();
      }

      if (location.trim()) {
        params.location = location.trim();
      }

      if (isPublished === "true") {
        params.isPublished = true;
      } else if (isPublished === "false") {
        params.isPublished = false;
      }

      const response = await getEvents(params);
      setData(response);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load events. Please verify the backend is running.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [category, location, isPublished, sortBy, order, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Frontend-only title search: filters the fetched page's items in memory without calling backend
  const displayedEvents = useMemo(() => {
    if (!data?.items) return [];
    if (!searchQuery.trim()) return data.items;
    const term = searchQuery.toLowerCase().trim();
    return data.items.filter((event) =>
      event.title.toLowerCase().includes(term)
    );
  }, [data?.items, searchQuery]);

  // Filter change handlers that reset page to 1
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setIsPublished(newStatus);
    setPage(1);
  };

  const handleSortByChange = (newSortBy: "eventDate" | "title") => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleOrderChange = (newOrder: "asc" | "desc") => {
    setOrder(newOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setCategory("");
    setLocation("");
    setIsPublished("all");
    setSortBy("eventDate");
    setOrder("asc");
    setSearchQuery("");
    setPage(1);
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Campus Events Directory
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Browse, filter, and search academic schedules, workshops, and extracurriculars.
          </p>
        </div>

        <Link
          href="/create-event"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Control Panel: Filters, Sorting, and Frontend Title Search */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
        {/* Row 1: Frontend-Only Title Search Input */}
        <div>
          <label
            htmlFor="title-search"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
          >
            Search by Title (Instant Frontend Filter)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="title-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter events by title (e.g. Hackathon, Bootcamp, Symposium)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear title search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Backend Query Controls (Category, Location, Publication, Sort, Order) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="filter-category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="career">Career</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label
              htmlFor="filter-location"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Location
            </label>
            <input
              id="filter-location"
              type="text"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="e.g. Auditorium, Lab..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Publication Status Filter */}
          <div>
            <label
              htmlFor="filter-status"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Status
            </label>
            <select
              id="filter-status"
              value={isPublished}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="all">All Events</option>
              <option value="true">Published Only</option>
              <option value="false">Drafts Only</option>
            </select>
          </div>

          {/* Sort By Field */}
          <div>
            <label
              htmlFor="filter-sort"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Sort By
            </label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) =>
                handleSortByChange(e.target.value as "eventDate" | "title")
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="eventDate">Event Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Sort Direction / Order */}
          <div>
            <label
              htmlFor="filter-order"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
            >
              Order
            </label>
            <select
              id="filter-order"
              value={order}
              onChange={(e) =>
                handleOrderChange(e.target.value as "asc" | "desc")
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="asc">Ascending (A-Z / Earliest)</option>
              <option value="desc">Descending (Z-A / Latest)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Reset */}
        {(category || location || isPublished !== "all" || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-medium text-slate-500 dark:text-slate-400">
              Active Filters:
            </span>
            {category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                Category: {category}
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  className="hover:text-blue-900 ml-1 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                Location: {location}
                <button
                  type="button"
                  onClick={() => handleLocationChange("")}
                  className="hover:text-blue-900 ml-1 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {isPublished !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                Status: {isPublished === "true" ? "Published" : "Draft"}
                <button
                  type="button"
                  onClick={() => handleStatusChange("all")}
                  className="hover:text-blue-900 ml-1 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                Title: &quot;{searchQuery}&quot;
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900 ml-1 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline ml-auto font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <section className="space-y-6">
        {/* Results Count & Meta Indicator */}
        {!loading && !error && data && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200">{displayedEvents.length}</strong> of{" "}
              <strong className="text-slate-800 dark:text-slate-200">{data.total}</strong> total events (Page {data.page} of {totalPages})
            </span>
            {searchQuery && (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Filtered by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-16">
            <Loading message="Fetching campus events..." size="md" />
          </div>
        )}

        {/* Error Alert with Retry Button */}
        {!loading && error && (
          <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-base">
                  Failed to Load Events
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {error}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={fetchEvents}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Retry Connection</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State: No events match backend criteria or frontend search */}
        {!loading && !error && displayedEvents.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {searchQuery
                ? `No events matching "${searchQuery}"`
                : "No events found. Check back later!"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {searchQuery
                ? "Try searching with a different term or clear the title filter to see all results."
                : "There are currently no events matching the selected filter criteria. Try adjusting your filters or create a new event."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {(category || location || isPublished !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  Clear All Filters
                </button>
              )}
              <Link
                href="/create-event"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
              >
                Create Event
              </Link>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && displayedEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && data && data.total > 0 && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Page <strong className="text-slate-800 dark:text-slate-200">{page}</strong> of{" "}
              <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Previous</span>
              </button>

              <span className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages || loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs"
              >
                <span>Next</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
