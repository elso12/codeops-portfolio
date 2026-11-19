interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingProps) {
  const spinnerSizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6"
    : "flex flex-col items-center justify-center py-12 px-4 w-full";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div
        className={`${spinnerSizes[size]} rounded-full border-blue-600 border-t-transparent animate-spin`}
        aria-hidden="true"
      />
      {message && (
        <p
          className={`mt-3 font-medium text-slate-600 dark:text-slate-300 ${textSizes[size]}`}
        >
          {message}
        </p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
}
