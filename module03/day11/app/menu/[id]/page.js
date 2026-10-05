import { notFound } from "next/navigation";
import Link from "next/link";
import { getDishById } from "@/lib/dishes";
import ClientNavButton from "@/app/components/ClientNavButton";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const dish = await getDishById(resolvedParams.id);
  if (!dish) return { title: "Dish Not Found | Addis Eats" };
  return {
    title: `${dish.name} (${dish.amharic}) | Addis Eats`,
    description: dish.description,
  };
}

// Next.js App Router Dynamic Route: app/menu/[id]/page.js
// Reads params directly from component props (Server Component friendly)
export default async function DishDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Requirement 7: call notFound() for a dish id that does not exist
  const dish = await getDishById(id);
  if (!dish) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Navigation using next/link */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-400">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/menu" className="hover:text-amber-400 transition-colors">
          Menu
        </Link>
        <span>/</span>
        <span className="text-amber-400 font-medium">{dish.name}</span>
      </nav>

      {/* Dynamic Route Info Card */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
          <span className="bg-amber-500/20 px-2 py-1 rounded">Dynamic Param Prop:</span>
          <span><code>params.id = &quot;{id}&quot;</code></span>
        </div>
        <span className="text-xs text-stone-400 font-mono">
          app/menu/[id]/page.js
        </span>
      </div>

      {/* Dish Details Card */}
      <article className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-stone-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
                {dish.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300">
                {dish.spiceLevel}
              </span>
              {dish.dietary.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] bg-stone-800/80 text-stone-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {dish.name}
            </h1>
            <p className="text-xl sm:text-2xl text-amber-400/90 font-serif mt-1">
              {dish.amharic}
            </p>
          </div>

          <div className="text-left md:text-right bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80 min-w-[160px]">
            <span className="text-xs uppercase tracking-wider text-stone-400 block">Price</span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400">
              {dish.price} ETB
            </span>
            <span className="text-[11px] text-stone-500 block mt-1">Includes Teff Injera</span>
          </div>
        </div>

        {/* Description & Preparation */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-200">Culinary Description</h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            {dish.description}
          </p>
          <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 text-xs text-amber-300/90 flex items-center gap-2">
            <span>⏱️</span>
            <span><strong>Preparation:</strong> {dish.prepTime}</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400">
            Heritage Ingredients
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-stone-300">
            {dish.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-center gap-2 bg-stone-950/30 p-2.5 rounded-lg border border-stone-800/50">
                <span className="text-amber-500">❖</span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Controls & Navigation */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/menu"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium transition-colors text-center"
          >
            ← Back to Full Menu
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Requirement 5: Client component pushing with useRouter */}
            <ClientNavButton
              href="/checkout"
              label="Order Now (useRouter.push)"
              variant="primary"
              className="w-full sm:w-auto"
            />
            <Link
              href="/cart"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-white text-stone-300 text-sm font-medium transition-colors text-center"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
