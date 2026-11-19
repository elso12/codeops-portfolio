"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEvent } from "@/services/eventService";

export default function CreateEventPage() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Submission & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setApiError(null);
    setSuccessMessage(null);

    // 1. Validation of required fields
    if (!title.trim()) {
      setValidationError("Event title is required.");
      return;
    }
    if (!category.trim()) {
      setValidationError("Please select an event category.");
      return;
    }
    if (!location.trim()) {
      setValidationError("Event venue or location is required.");
      return;
    }
    if (!eventDate) {
      setValidationError("Event date and time are required.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Event description is required.");
      return;
    }

    // Convert datetime-local to valid ISO 8601 string
    let isoDate: string;
    try {
      const parsedDate = new Date(eventDate);
      if (isNaN(parsedDate.getTime())) {
        setValidationError("Please provide a valid date and time.");
        return;
      }
      isoDate = parsedDate.toISOString();
    } catch {
      setValidationError("Invalid date format provided.");
      return;
    }

    // 2. Submit to API via createEvent
    setIsSubmitting(true);
    try {
      const created = await createEvent({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        eventDate: isoDate,
        category: category.trim(),
        isPublished,
      });

      // 3. Success feedback & redirection
      setSuccessMessage("Event successfully created! Redirecting to event details...");
      router.refresh();

      setTimeout(() => {
        router.push(`/events/${created.id}`);
      }, 1200);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to create event. Please verify backend connection and try again.";
      setApiError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header & Breadcrumb */}
      <div>
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
          <Link
            href="/events"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            All Events
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">
            Create Event
          </span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create New Campus Event
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Publish an official university event, workshop, or student organization gathering.
        </p>
      </div>

      {/* Feedback Alerts */}
      {validationError && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
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
          <div className="text-sm font-medium">{validationError}</div>
        </div>
      )}

      {apiError && (
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm font-medium">
            <strong>Submission Error:</strong> {apiError}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm font-medium">{successMessage}</div>
        </div>
      )}

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="event-title"
            className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5"
          >
            Event Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="event-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI & Cloud Engineering Hackathon 2026"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
        </div>

        {/* Category & Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label
              htmlFor="event-category"
              className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5"
            >
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="event-category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Select category...
              </option>
              <option value="technology">Technology</option>
              <option value="career">Career & Networking</option>
              <option value="sports">Sports & Athletics</option>
              <option value="arts">Arts & Culture</option>
              <option value="academic">Academic & Research</option>
              <option value="student-life">Student Life</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Publication Status Toggle/Checkbox */}
          <div className="flex flex-col justify-end">
            <span className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Publication Status
            </span>
            <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/50 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-950 transition">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isPublished ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Publish immediately (Visible to students)
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    Save as Draft (Unpublished)
                  </span>
                )}
              </span>
            </label>
          </div>
        </div>

        {/* Schedule & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Event Date (datetime-local) */}
          <div>
            <label
              htmlFor="event-date"
              className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5"
            >
              Event Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              id="event-date"
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="mt-1 text-xs text-slate-400">
              Scheduled start time for this campus event.
            </p>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="event-location"
              className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5"
            >
              Location / Venue <span className="text-rose-500">*</span>
            </label>
            <input
              id="event-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Computer Science Building, Hall 201"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
            <p className="mt-1 text-xs text-slate-400">
              Campus building, hall, room, or arena.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="event-description"
            className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5"
          >
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="event-description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a comprehensive summary of the event agenda, target audience, registration requirements, and scheduled speakers..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm transition leading-relaxed"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            href="/events"
            className="w-full sm:w-auto px-5 py-2.5 text-center text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Event...</span>
              </>
            ) : (
              <>
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
                <span>{isPublished ? "Publish Event" : "Save Draft"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
