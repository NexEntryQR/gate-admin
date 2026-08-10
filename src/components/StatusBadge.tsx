import type { EventStatus } from "gate-shared";

const styles: Record<EventStatus, { pill: string; dot: string }> = {
  DRAFT: {
    pill: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  ACTIVE: {
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  CLOSED: {
    pill: "bg-slate-100 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400",
    dot: "bg-slate-400",
  },
};

export function StatusBadge({ status }: { status: EventStatus }) {
  const style = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
