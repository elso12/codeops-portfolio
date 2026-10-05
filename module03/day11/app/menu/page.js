import Link from "next/link";
import { getDishes } from "@/lib/dishes";
import MenuExplorer from "./MenuExplorer";

export const metadata = {
  title: "Addis Eats Menu | Traditional Ethiopian Delicacies",
  description: "Browse our authentic Ethiopian menu featuring Doro Wat, Kitfo, Fasting Beyaynetu, Sizzling Tibs, and Shiro.",
};

// Next.js App Router Page: app/menu/page.js
// Server Component by default, rendering HTML directly on the server.
export default async function MenuPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const isErrorSimulated = resolvedSearchParams?.error === "true";
  const delay = resolvedSearchParams?.loading === "true" 
    ? 3000 
    : parseInt(resolvedSearchParams?.delay || "0", 10);

  // Requirement 6: Force loading.js or error.js to appear
  const dishes = await getDishes({
    delay: delay,
    error: isErrorSimulated,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 mb-2">
            <span>Route:</span>
            <code className="bg-stone-800 px-2 py-0.5 rounded text-stone-200">/menu (app/menu/page.js)</code>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Traditional Habesha Feast Menu
          </h1>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl">
            Simmered with century-old family recipes, rich niter kibbeh spiced butter, and fresh injera baked daily.
          </p>
        </div>

        {/* Dynamic Route Testing Quick Jump */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/menu/kitfo"
            className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Quick: /menu/kitfo →
          </Link>
          <Link
            href="/menu/doro-wat"
            className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Quick: /menu/doro-wat →
          </Link>
        </div>
      </div>

      {/* Special States Testing Bar (Required for Step 6 & Step 7) */}
      <section className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🧪</span> Next.js File-Based Routing State Tester
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              Click below to force <code className="text-amber-400">loading.js</code>, <code className="text-red-400">error.js</code>, or <code className="text-purple-400">not-found.js</code> to appear:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Force loading.js */}
            <Link
              href="/menu?loading=true"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
            >
              <span>⏳</span> Force loading.js (3s delay)
            </Link>

            {/* Force error.js */}
            <Link
              href="/menu?error=true"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-medium transition-all"
            >
              <span>💥</span> Force error.js
            </Link>

            {/* Force not-found.js */}
            <Link
              href="/menu/invalid-dish-xyz"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all"
            >
              <span>🔍</span> Force not-found.js
            </Link>

            {/* Clear Query Params */}
            {(resolvedSearchParams?.loading || resolvedSearchParams?.error) && (
              <Link
                href="/menu"
                className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Colocated components in action (DishList and CategoryBar) */}
      <MenuExplorer initialDishes={dishes} />

      {/* Colocation proof banner (Requirement 4) */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-4 text-xs text-stone-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">✓ Colocation Verified:</span>
          <span><code>DishList.jsx</code> and <code>CategoryBar.jsx</code> live in <code>app/menu/</code> without creating routes.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/menu/DishList" className="text-amber-400 hover:underline">
            Test /menu/DishList (404)
          </Link>
          <span className="text-stone-700">|</span>
          <Link href="/menu/CategoryBar" className="text-amber-400 hover:underline">
            Test /menu/CategoryBar (404)
          </Link>
        </div>
      </div>
    </div>
  );
}
