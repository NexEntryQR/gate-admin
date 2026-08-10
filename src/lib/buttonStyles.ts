type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

const variants: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500",
  secondary:
    "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  danger:
    "border border-rose-300 bg-white text-rose-700 shadow-sm hover:bg-rose-50 focus-visible:ring-rose-500 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950",
  ghost:
    "text-slate-600 hover:bg-slate-100 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}
