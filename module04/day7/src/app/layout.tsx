import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAMPUS EVENTS | University Event Discovery Platform",
  description:
    "Explore university events, academic conferences, workshops, and campus life agendas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Clean College Platform Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand and Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-bold tracking-wider text-base text-blue-900 dark:text-blue-400">
                    CAMPUS EVENTS
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  The centralized university platform for discovering hackathons,
                  guest lectures, cultural festivals, and student activities.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Quick Navigation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      Home Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/events"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      Browse All Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create-event"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      Create & Publish Event
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Campus Portal Info */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Campus Resources
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Connected to Campus API Service. All published schedules and session
                  rooms are coordinated through academic services.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  API Status: Connected
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <p>
                &copy; 2026 Campus Events Discovery Platform. All rights reserved.
              </p>
              <p className="text-slate-400 dark:text-slate-500">
                Next.js App Router &bull; TypeScript &bull; Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
