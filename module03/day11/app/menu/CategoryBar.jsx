"use client";

// Notice: Placed in app/menu/CategoryBar.jsx.
// Because its name is not 'page.js', Next.js does NOT create a route for /menu/CategoryBar!
export default function CategoryBar({ categories, selected, onSelect }) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar" aria-label="Menu categories">
      {categories.map((cat) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              isActive
                ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30 scale-105"
                : "bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
