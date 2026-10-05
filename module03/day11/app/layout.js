import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Addis Eats | Authentic Ethiopian Dining on Next.js",
  description: "Next.js App Router implementation of Addis Eats featuring file-based routing, server rendering, dynamic routes, and built-in error/loading states.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
        {/* Top Notification Banner */}
        <div className="bg-amber-600/15 border-b border-amber-500/20 text-xs py-1.5 px-4 text-center text-amber-200">
          <span>🇪🇹 <strong>Addis Eats Next.js App Router</strong> · Module 3 Day 36 · File-Based Routing in Action</span>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-stone-950/80 border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo with next/link */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                🍽️
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block group-hover:text-amber-400 transition-colors">
                  Addis Eats
                </span>
                <span className="text-[10px] tracking-widest uppercase text-amber-500 font-semibold block -mt-1">
                  አዲስ ኢትስ · Next.js
                </span>
              </div>
            </Link>

            {/* Navigation Links (strictly next/link, no <a>) */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/menu"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/cart"
                className="px-3 py-1.5 text-sm font-medium rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors flex items-center gap-1.5"
              >
                <span>Cart</span>
                <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full font-bold">2</span>
              </Link>
              <Link
                href="/checkout"
                className="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 transition-all hover:shadow-lg hover:shadow-amber-500/40"
              >
                Checkout
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-stone-800 bg-stone-900/60 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div>
              <p className="font-semibold text-stone-300">Addis Eats Restaurant · File-Based Routing System</p>
              <p className="mt-1">All routes served through Next.js App Router convention (`page.js`, `loading.js`, `error.js`, `not-found.js`).</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home (/)</Link>
              <span className="text-stone-700">•</span>
              <Link href="/menu" className="hover:text-amber-400 transition-colors">Menu (/menu)</Link>
              <span className="text-stone-700">•</span>
              <Link href="/cart" className="hover:text-amber-400 transition-colors">Cart (/cart)</Link>
              <span className="text-stone-700">•</span>
              <Link href="/checkout" className="hover:text-amber-400 transition-colors">Checkout (/checkout)</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
