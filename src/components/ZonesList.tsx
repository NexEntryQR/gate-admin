import { Link } from "react-router";
import { ChevronRight, MapPin } from "lucide-react";
import type { ZoneResponse } from "gate-shared";
import { OccupancyGauge } from "./OccupancyGauge.tsx";

export function ZonesList({ eventId, zones }: { eventId: number; zones: ZoneResponse[] }) {
  if (zones.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {zones.map((zone) => (
        <li key={zone.id}>
          <Link
            to={`/events/${eventId}/zones/${zone.id}`}
            className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <MapPin className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-white">{zone.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {zone.type}
                  </span>
                  {zone.regular && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      regular
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <OccupancyGauge occupied={zone.occupied} capacity={zone.capacity} />
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400 dark:text-slate-600" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
