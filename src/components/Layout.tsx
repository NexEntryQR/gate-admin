import { Link, Outlet } from "react-router";
import { Plus, Ticket } from "lucide-react";
import { buttonClasses } from "../lib/buttonStyles.ts";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Ticket className="h-4 w-4" strokeWidth={2.25} />
            </span>
            Gate Admin
          </Link>
          <Link to="/events/new" className={buttonClasses("primary", "sm")}>
            <Plus className="h-4 w-4" />
            New event
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
