"use client";

import { useEffect } from "react";
import Link from "next/link";

// In Next.js App Router, error boundaries are defined by error.js.
// Because it manages error state and user interactions (like retry), it MUST be a Client Component.
export default function MenuError({ error, reset }) {
  useEffect(() => {
    // Log error for telemetry/debugging
    console.error("[app/menu/error.js caught error]:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-red-950/40 border border-red-800/80 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-900/60 border border-red-700/60 flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
          ⚠️
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-red-900/40 text-red-300 border border-red-800/60 mb-3">
          app/menu/error.js Boundary Triggered
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Unable to Load Addis Eats Menu
        </h2>

        <p className="text-stone-300 text-sm mb-4 leading-relaxed">
          {error?.message || "An unexpected error occurred while fetching the menu items."}
        </p>

        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3 mb-6 text-left font-mono text-xs text-red-400 overflow-x-auto">
          <code>{error?.stack ? error.stack.split("\n")[0] : error?.message}</code>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* reset() attempts to re-render the segment */}
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
          >
            🔄 Try Again (reset())
          </button>

          <Link
            href="/menu"
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm border border-stone-700 transition-all"
          >
            Reset URL to /menu
          </Link>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white font-medium text-sm transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
