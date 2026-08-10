import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvent, deleteEvent, listZonesByEvent, type ApiError } from "gate-shared";
import { CalendarClock, MapPin, MapPinned, Pencil, Plus, X } from "lucide-react";
import { ErrorBanner } from "../components/ErrorBanner.tsx";
import { ConfirmButton } from "../components/ConfirmButton.tsx";
import { StatusBadge } from "../components/StatusBadge.tsx";
import { EventEditForm } from "../components/EventEditForm.tsx";
import { ZoneCreateForm } from "../components/ZoneCreateForm.tsx";
import { ZonesList } from "../components/ZonesList.tsx";
import { Card } from "../components/Card.tsx";
import { Button } from "../components/Button.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { Skeleton } from "../components/Skeleton.tsx";
import { formatDateTime } from "../lib/datetime.ts";

export function EventDetailPage() {
  const { eventId: eventIdParam } = useParams();
  const eventId = Number(eventIdParam);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [addingZone, setAddingZone] = useState(false);

  const eventQuery = useQuery({ queryKey: ["event", eventId], queryFn: () => getEvent(eventId) });
  const zonesQuery = useQuery({ queryKey: ["zones", eventId], queryFn: () => listZonesByEvent(eventId) });

  const deleteMutation = useMutation<void, ApiError, void>({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/");
    },
  });

  if (eventQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (eventQuery.isError) return <ErrorBanner error={eventQuery.error} onRetry={() => eventQuery.refetch()} />;

  const event = eventQuery.data;

  return (
    <div className="flex flex-col gap-8">
      {editing ? (
        <EventEditForm event={event} onDone={() => setEditing(false)} />
      ) : (
        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{event.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.venue}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatDateTime(event.startDatetime)} — {formatDateTime(event.endDatetime)}
                </span>
              </div>
            </div>
            <StatusBadge status={event.status} />
          </div>
          {event.description && (
            <p className="border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {event.description}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button variant="secondary" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <ConfirmButton label="Delete event" onConfirm={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} />
          </div>
          {deleteMutation.isError && <ErrorBanner error={deleteMutation.error} />}
        </Card>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Zones</h2>
          <Button
            variant="secondary"
            size="sm"
            icon={addingZone ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            onClick={() => setAddingZone((v) => !v)}
          >
            {addingZone ? "Cancel" : "Add zone"}
          </Button>
        </div>
        {addingZone && zonesQuery.data && (
          <ZoneCreateForm eventId={eventId} zones={zonesQuery.data} onCreated={() => setAddingZone(false)} />
        )}
        {zonesQuery.isPending ? (
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : zonesQuery.isError ? (
          <ErrorBanner error={zonesQuery.error} onRetry={() => zonesQuery.refetch()} />
        ) : zonesQuery.data.length === 0 ? (
          <EmptyState icon={MapPinned} title="No zones yet" description="Add a regular zone first, then any sub-zones like VIP or backstage." />
        ) : (
          <ZonesList eventId={eventId} zones={zonesQuery.data} />
        )}
      </div>
    </div>
  );
}
