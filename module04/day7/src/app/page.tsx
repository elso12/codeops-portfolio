"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUpcomingEvents } from "@/services/eventService";
import { Event } from "@/types/event";
import EventCard from "@/components/EventCard";
import Loading from "@/components/Loading";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUpcomingEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingEvents();
      setEvents(data || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load upcoming events. Please ensure the backend is running.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 md:py-20 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-6 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official University Platform
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Discover What&apos;s Happening on Campus
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
            Explore academic symposiums, tech hackathons, career fairs, cultural
            festivals, and student organization workshops all in one unified
            hub.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-blue-900 bg-white hover:bg-blue-50 active:bg-blue-100 rounded-xl transition shadow-md group"
            >
              <span>Explore Events</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            <Link
              href="/create-event"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-blue-600/60 hover:bg-blue-600/80 active:bg-blue-700/80 border border-blue-400/40 rounded-xl transition backdrop-blur-xs"
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
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Upcoming Events
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Browse sessions and campus activities scheduled for the coming days.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition group"
          >
            <span>View All Events</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {loading && (
          <div className="py-12">
            <Loading message="Loading upcoming campus events..." size="md" />
          </div>
        )}

        {!loading && error && (
          <div className="p-6 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200">
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
                  Unable to Connect to Campus API
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {error}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={loadUpcomingEvents}
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

        {!loading && !error && events.length === 0 && (
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No events found. Check back later!
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              There are currently no upcoming events scheduled on the university
              calendar. You can explore past listings or create a new event.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/events"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              >
                Browse All Events
              </Link>
              <Link
                href="/create-event"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs"
              >
                Create First Event
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/80 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Hosting a campus event or club workshop?
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
            Publish your agenda, schedule sessions, and connect directly with
            students across all departments.
          </p>
        </div>
        <Link
          href="/create-event"
          className="shrink-0 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
        >
          Publish Event Now
        </Link>
      </section>
    </div>
  );
}
