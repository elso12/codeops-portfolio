import Link from "next/link";

// Next.js App Router Root Not-Found Boundary: app/not-found.js
// Rendered when an unmatched URL is requested, or when notFound() is explicitly called from a page.
export const metadata = {
  title: "404 - Page Not Found | Addis Eats",
  description: "The requested route or dish could not be found in the Addis Eats kitchen.",
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-4xl mx-auto">
          🏺
        </div>

        <div className="inline-block px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
          app/not-found.js rendered
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Dish or Route Not Found
        </h1>

        <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          We looked through every clay pot, injera basket, and file route, but could not find the requested dish or destination.
        </p>

        <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4 text-xs text-stone-400 text-left font-mono space-y-1">
          <p className="text-amber-400 font-semibold">{"// How you arrived here:"}</p>
          <p>1. Visited an unrecognized route URL, OR</p>
          <p>2. A dynamic route segment called <span className="text-white">notFound()</span> from <span className="text-white">&quot;next/navigation&quot;</span></p>
          <p>3. Tried visiting a colocated component like <span className="text-white">/menu/DishList</span> which has no <span className="text-white">page.js</span></p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/30"
          >
            ← Explore Authentic Menu
          </Link>

          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm border border-stone-700 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
