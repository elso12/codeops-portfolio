import Link from "next/link";
import { Event } from "@/types/event";

const CATEGORY_STYLES: Record<string, string> = {
  technology: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  career: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  sports: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  arts: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  academic: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
};

const DEFAULT_CATEGORY_STYLE =
  "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const categoryStyle =
    CATEGORY_STYLES[event.category?.toLowerCase()] || DEFAULT_CATEGORY_STYLE;

  return (
    <article className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border ${categoryStyle}`}
          >
            {event.category || "General"}
          </span>

          {event.isPublished ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
              Draft
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>
      </div>

      <div className="px-5 pb-4 flex-1 flex flex-col justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
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
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
              {formatDate(event.eventDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-rose-500 shrink-0"
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
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={`/events/${event.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs group/btn"
        >
          <span>View Details</span>
          <svg
            className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform"
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
      </div>
    </article>
  );
}
