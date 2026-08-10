import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { listEvents } from "gate-shared";
import { CalendarRange, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge.tsx";
import { ErrorBanner } from "../components/ErrorBanner.tsx";
import { Card } from "../components/Card.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { Skeleton } from "../components/Skeleton.tsx";
import { buttonClasses } from "../lib/buttonStyles.ts";
import { formatDateTime } from "../lib/datetime.ts";

const PAGE_SIZE = 20;

export function EventsListPage() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["events", page],
    queryFn: () => listEvents({ page, size: PAGE_SIZE, sort: "startDatetime,asc" }),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Events" subtitle="Every event configured for gate access control." />
      {isError && <ErrorBanner error={error} onRetry={() => refetch()} />}

      {isPending || !data ? (
        <Card className="flex flex-col gap-3 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </Card>
      ) : data.content.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="No events yet"
          description="Create your first event to start configuring zones and gates."
          action={
            <Link to="/events/new" className={buttonClasses("primary", "sm")}>
              <Plus className="h-4 w-4" />
              New event
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Starts</th>
                <th className="px-5 py-3">Ends</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.content.map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/events/${event.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400"
                    >
                      {event.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{formatDateTime(event.startDatetime)}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{formatDateTime(event.endDatetime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span>
            Page {data.page + 1} of {data.totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
