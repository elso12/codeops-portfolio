"use client";

import { useRouter } from "next/navigation";

export default function ClientNavButton({
  href = "/checkout",
  label = "Proceed with useRouter",
  className = "",
  variant = "primary"
}) {
  const router = useRouter();

  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium text-sm rounded-lg transition-all duration-150 cursor-pointer active:scale-95";
  
  const variants = {
    primary: "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30 px-5 py-2.5",
    secondary: "bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2",
    accent: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 px-5 py-2.5",
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      type="button"
      onClick={() => {
        console.log(`[useRouter] Programmatic navigation pushing to: ${href}`);
        router.push(href);
      }}
      className={`${baseStyles} ${selectedVariant} ${className}`}
    >
      <span>⚡</span>
      <span>{label}</span>
    </button>
  );
}
