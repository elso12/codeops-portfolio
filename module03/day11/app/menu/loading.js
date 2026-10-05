export default function MenuLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading Addis Eats menu">
      {/* Loading banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-amber-300">
            [loading.js in action] Streaming Addis Eats menu from the server...
          </span>
        </div>
        <span className="text-xs text-stone-400 font-mono hidden sm:inline">
          app/menu/loading.js
        </span>
      </div>

      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-9 w-64 bg-stone-800 rounded-lg" />
        <div className="h-4 w-96 max-w-full bg-stone-800/60 rounded" />
      </div>

      {/* CategoryBar skeleton */}
      <div className="flex gap-2 py-2 overflow-x-auto">
        {[80, 120, 110, 95, 130, 85].map((width, idx) => (
          <div
            key={idx}
            className="h-8 bg-stone-800 rounded-full flex-shrink-0"
            style={{ width: `${width}px` }}
          />
        ))}
      </div>

      {/* Dish cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-stone-800 rounded-full" />
                <div className="h-6 w-36 bg-stone-800 rounded-md" />
              </div>
              <div className="h-6 w-16 bg-stone-800 rounded-md" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-stone-800/70 rounded" />
              <div className="h-3 w-4/5 bg-stone-800/70 rounded" />
            </div>
            <div className="pt-4 border-t border-stone-800/60 flex justify-between items-center">
              <div className="h-4 w-24 bg-stone-800 rounded" />
              <div className="h-7 w-24 bg-stone-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
