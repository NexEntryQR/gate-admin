export function OccupancyGauge({ occupied, capacity }: { occupied: number; capacity: number }) {
  const pct = capacity > 0 ? Math.min(100, Math.round((occupied / capacity) * 100)) : 0;
  const color = pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {occupied} / {capacity} occupied
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
