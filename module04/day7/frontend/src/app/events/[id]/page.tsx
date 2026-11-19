"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getEventById,
  getEventSessions,
  getSessionById,
} from "@/services/eventService";
import { Event, Session } from "@/types/event";
import Loading from "@/components/Loading";

function EventDetailsContent() {
  const params = useParams();
  const eventId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  // Event & sessions data states
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // Session Details Modal state (Page 4 requirements)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [sessionModalOpen, setSessionModalOpen] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Fetch Event and its Sessions
  const loadEventAndSessions = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const eventData = await getEventById(eventId);
      setEvent(eventData);

      // Fetch sessions for this event
      try {
        const sessionsData = await getEventSessions(eventId);
        setSessions(sessionsData || []);
      } catch {
        setSessions([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes("404") ||
        msg.toLowerCase().includes("not found")
      ) {
        setIsNotFound(true);
      } else {
        setError(msg || "Failed to load event details.");
      }
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEventAndSessions();
  }, [loadEventAndSessions]);

  // Open Session Modal by fetching session details
  const handleOpenSessionModal = async (sessionId: string) => {
    if (!eventId) return;
    setLoadingSessionId(sessionId);
    setSessionError(null);

    try {
      const sessionData = await getSessionById(eventId, sessionId);
      setSelectedSession(sessionData);
      setSessionModalOpen(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not retrieve session details.";
      setSessionError(msg);
      // Fallback: look up in already loaded sessions array
      const local = sessions.find((s) => s.id === sessionId);
      if (local) {
        setSelectedSession(local);
        setSessionModalOpen(true);
      }
    } finally {
      setLoadingSessionId(null);
    }
  };

  const handleCloseSessionModal = () => {
    setSessionModalOpen(false);
    setSelectedSession(null);
    setSessionError(null);
  };

  // Helper date formatters
  const formatFullDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "N/A";
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return timeString;
    }
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return null;
    try {
      const s = new Date(start).getTime();
      const e = new Date(end).getTime();
      if (isNaN(s) || isNaN(e) || e <= s) return null;
      const minutes = Math.round((e - s) / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours === 0) return `${minutes} mins`;
      if (remainingMinutes === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
      return `${hours} hr${hours > 1 ? "s" : ""} ${remainingMinutes} mins`;
    } catch {
      return null;
    }
  };

  const getCategoryStyle = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "career":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "sports":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "arts":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "academic":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="py-20">
        <Loading message="Loading event details and session agenda..." size="lg" />
      </div>
    );
  }

  // 2. Not Found State
  if (isNotFound || !event) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
          <svg
            className="w-10 h-10"
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
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Event Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          The campus event with ID <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{eventId}</code> could not be found or may have been unpublished.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Return to All Events</span>
        </Link>
      </div>
    );
  }

  // 3. API Error State
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
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
              <h3 className="font-semibold text-base">Error Loading Event</h3>
              <p className="text-sm opacity-90 leading-relaxed">{error}</p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={loadEventAndSessions}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
                >
                  Retry Connection
                </button>
                <Link
                  href="/events"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition"
                >
                  Back to Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Success State: Render Event Details (Page 3) and Agenda Sessions (Page 4)
  return (
    <div className="space-y-10">
      {/* Navigation Breadcrumb / Back Link */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
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
          <span>All Events</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
          {event.title}
        </span>
      </nav>

      {/* Main Event Details Card */}
      <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Banner Top Accent */}
        <div className="h-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        <div className="p-6 sm:p-10 space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryStyle(
                  event.category
                )}`}
              >
                {event.category || "General"}
              </span>

              {event.isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  Draft
                </span>
              )}
            </div>

            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
              ID: {event.id}
            </span>
          </div>

          {/* Event Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          {/* Meta Details Box: Schedule & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            {/* Date & Time */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Scheduled Date & Time
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatFullDate(event.eventDate)}
                </p>
              </div>
            </div>

            {/* Location / Room */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Campus Location & Venue
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Event Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
              {event.description}
            </div>
          </div>
        </div>
      </article>

      {/* Sessions & Agenda Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Event Agenda & Sessions
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Explore specific agenda blocks, talks, and workshop tracks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {sessions.length} {sessions.length === 1 ? "Session" : "Sessions"}
          </span>
        </div>

        {/* Empty Sessions State */}
        {sessions.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              No sessions scheduled yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Detailed session tracks and room allocations will appear here once finalized by the organizer.
            </p>
          </div>
        ) : (
          /* Grid of Sessions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 group"
              >
                <div className="space-y-3">
                  {/* Room badge & ID */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <svg
                        className="w-3.5 h-3.5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {session.room}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {session.id}
                    </span>
                  </div>

                  {/* Session Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {session.title}
                  </h3>

                  {/* Time Schedule */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-indigo-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formatTime(session.startsAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Open Session Details Modal Button */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOpenSessionModal(session.id)}
                    disabled={loadingSessionId === session.id}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition"
                  >
                    {loadingSessionId === session.id ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        Fetching...
                      </span>
                    ) : (
                      <>
                        <span>View Session Details</span>
                        <svg
                          className="w-3.5 h-3.5"
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
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Session Details Modal (Page 4 Implementation) */}
      {sessionModalOpen && selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-modal-title"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Session Agenda Details
                </span>
                <h3
                  id="session-modal-title"
                  className="text-xl font-extrabold text-slate-900 dark:text-white"
                >
                  {selectedSession.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseSessionModal}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close session modal"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body: Displays all required fields */}
            <div className="p-6 space-y-4 text-sm">
              {/* Related Event Title */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                  Related Campus Event
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {event.title}
                </p>
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Starts At
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {formatFullDate(selectedSession.startsAt)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Ends At
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {formatFullDate(selectedSession.endsAt)}
                  </p>
                </div>
              </div>

              {/* Duration (if calculable) */}
              {calculateDuration(selectedSession.startsAt, selectedSession.endsAt) && (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-900/40">
                  <span>Estimated Session Duration:</span>
                  <span className="font-bold">
                    {calculateDuration(selectedSession.startsAt, selectedSession.endsAt)}
                  </span>
                </div>
              )}

              {/* Room Location */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Room / Hall
                  </p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedSession.room}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>

              {/* IDs reference */}
              <div className="text-xs text-slate-400 flex justify-between pt-1 font-mono">
                <span>Session ID: {selectedSession.id}</span>
                <span>Event ID: {selectedSession.eventId}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleCloseSessionModal}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20">
          <Loading message="Loading event details and session agenda..." size="lg" />
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
