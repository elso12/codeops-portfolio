import Link from "next/link";
import ClientNavButton from "@/app/components/ClientNavButton";
import { getDishes } from "@/lib/dishes";

export const metadata = {
  title: "Addis Eats | Authentic Ethiopian Feast on Next.js",
  description: "Experience genuine Ethiopian cuisine powered by the modern Next.js App Router.",
};

export default async function HomePage() {
  const allDishes = await getDishes();
  const featured = allDishes.slice(0, 3);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 p-8 sm:p-14 shadow-2xl">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span>✨</span>
            <span>Module 3 Day 36 · Next.js File-Based Routing & App Router</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Authentic Ethiopian Dining, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              Zero-Configuration Routing.
            </span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Welcome to Addis Eats on Next.js. The entire route tree — Home, Menu, Dynamic Dish Detail, Cart, and Checkout — is governed directly by folders and reserved files. Server rendering brings content instantly with zero client waterfall.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Navigation with next/link */}
            <Link
              href="/menu"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
            >
              Explore Full Menu →
            </Link>

            {/* Client Component navigating programmatically with useRouter */}
            <ClientNavButton
              href="/checkout"
              label="Instant Checkout (useRouter)"
              variant="secondary"
            />

            <Link
              href="/cart"
              className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white font-medium text-sm border border-stone-800 transition-colors"
            >
              View Cart (2 items)
            </Link>
          </div>
        </div>

        {/* Amharic Decorative Element */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-10 select-none pointer-events-none text-9xl font-black text-amber-400">
          እንጀራ
        </div>
      </section>

      {/* Route Architecture Checklist (From Reading Sheet) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Addis Eats Route Tree & Reserved Files
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Every route and state declared strictly through the Next.js file system convention.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            5 Routes Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/"
            className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>app/page.js</span>
              <span className="text-emerald-400 font-bold">○ Static</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Home Route (/)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Root landing page with hero overview and navigation links.
            </p>
          </Link>

          <Link
            href="/menu"
            className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>app/menu/page.js</span>
              <span className="text-emerald-400 font-bold">○ Server</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Menu Route (/menu)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Colocated DishList & CategoryBar, with loading.js & error.js states.
            </p>
          </Link>

          <Link
            href="/cart"
            className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>app/cart/page.js</span>
              <span className="text-emerald-400 font-bold">○ Static</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Cart Route (/cart)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Active basket, order summary, and client router checkout pusher.
            </p>
          </Link>

          <Link
            href="/checkout"
            className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
              <span>app/checkout/page.js</span>
              <span className="text-emerald-400 font-bold">○ Static</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Checkout Route (/checkout)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Delivery details, payment method selection, and order completion.
            </p>
          </Link>
        </div>
      </section>

      {/* Featured Dishes Section (Linking to dynamic /menu/[id]) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Featured Habesha Dishes
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Click any dish to test the dynamic route: <code>app/menu/[id]/page.js</code>
            </p>
          </div>
          <Link
            href="/menu"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            View All ({allDishes.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((dish) => (
            <article
              key={dish.id}
              className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all hover:shadow-xl group"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {dish.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-amber-300/80 font-serif mt-0.5">{dish.amharic}</p>
                <p className="text-xs text-stone-400 mt-3 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-lg font-black text-amber-400">{dish.price} ETB</span>
                <Link
                  href={`/menu/${dish.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
