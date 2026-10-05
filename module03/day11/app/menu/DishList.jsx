import Link from "next/link";

// Notice: Placed in app/menu/DishList.jsx.
// In the Next.js App Router, only 'page.js' defines a publicly reachable route.
// Colocated components like DishList are not routable, keeping feature code modular and organized.
export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-stone-800">
        <p className="text-stone-400">No dishes found matching this selection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <article
          key={dish.id}
          className="group relative flex flex-col justify-between bg-stone-900/70 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {dish.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-amber-300/80 font-serif tracking-wide">
                  {dish.amharic}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-400 block">
                  {dish.price} ETB
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  {dish.spiceLevel}
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm line-clamp-2 mt-3 leading-relaxed">
              {dish.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500">
              ID: <code className="bg-stone-800 px-1.5 py-0.5 rounded text-stone-300 font-mono">/menu/{dish.id}</code>
            </span>

            {/* Link to dynamic route using next/link */}
            <Link
              href={`/menu/${dish.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-white transition-all shadow-sm"
            >
              <span>View Dish</span>
              <span className="text-amber-400 group-hover:text-white">→</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
