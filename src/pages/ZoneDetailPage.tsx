import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listZonesByEvent,
  deleteZone,
  listGatesByZone,
  createGate,
  deactivateGate,
  isValidationError,
  type ApiError,
  type GateResponse,
  type GateCreateRequest,
} from "gate-shared";
import { ArrowLeft, ArrowLeftRight, ArrowRight, DoorClosed, DoorOpen, Pencil, Plus, X } from "lucide-react";
import { ErrorBanner } from "../components/ErrorBanner.tsx";
import { ConfirmButton } from "../components/ConfirmButton.tsx";
import { Field, inputClass } from "../components/Field.tsx";
import { ZoneEditForm } from "../components/ZoneEditForm.tsx";
import { Card } from "../components/Card.tsx";
import { Button } from "../components/Button.tsx";
import { OccupancyGauge } from "../components/OccupancyGauge.tsx";
import { EmptyState } from "../components/EmptyState.tsx";
import { Skeleton } from "../components/Skeleton.tsx";
import { applyFieldErrors } from "../lib/formErrors.ts";

const DIRECTION_MODES = ["IN", "OUT", "BOTH"] as const;

const DIRECTION_ICONS = {
  IN: ArrowRight,
  OUT: ArrowLeft,
  BOTH: ArrowLeftRight,
};

const gateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  directionMode: z.enum(DIRECTION_MODES),
});
type GateFormValues = z.infer<typeof gateSchema>;

export function ZoneDetailPage() {
  const { eventId: eventIdParam, zoneId: zoneIdParam } = useParams();
  const eventId = Number(eventIdParam);
  const zoneId = Number(zoneIdParam);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [addingGate, setAddingGate] = useState(false);

  const zonesQuery = useQuery({ queryKey: ["zones", eventId], queryFn: () => listZonesByEvent(eventId) });
  const gatesQuery = useQuery({ queryKey: ["gates", zoneId], queryFn: () => listGatesByZone(zoneId) });

  const deleteMutation = useMutation<void, ApiError, void>({
    mutationFn: () => deleteZone(zoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", eventId] });
      navigate(`/events/${eventId}`);
    },
  });

  const gateForm = useForm<GateFormValues>({ resolver: zodResolver(gateSchema), defaultValues: { directionMode: "BOTH" } });
  const createGateMutation = useMutation<GateResponse, ApiError, GateCreateRequest>({
    mutationFn: (request) => createGate(zoneId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gates", zoneId] });
      gateForm.reset({ name: "", directionMode: "BOTH" });
      setAddingGate(false);
    },
    onError: (error) => {
      if (isValidationError(error)) {
        applyFieldErrors<GateFormValues>(error.fieldErrors, gateForm.setError);
      }
    },
  });

  const deactivateMutation = useMutation<GateResponse, ApiError, number>({
    mutationFn: (gateId) => deactivateGate(gateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gates", zoneId] }),
  });

  if (zonesQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (zonesQuery.isError) return <ErrorBanner error={zonesQuery.error} onRetry={() => zonesQuery.refetch()} />;

  const zone = zonesQuery.data.find((z) => z.id === zoneId);
  if (!zone) {
    return <EmptyState icon={DoorClosed} title="This zone no longer exists" description="It may have been deleted from another session." />;
  }

  return (
    <div className="flex flex-col gap-8">
      {editing ? (
        <ZoneEditForm zone={zone} onDone={() => setEditing(false)} />
      ) : (
        <Card className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{zone.name}</h1>
              <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {zone.type}
                </span>
                {zone.regular && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    regular zone
                  </span>
                )}
              </div>
            </div>
            <div className="w-40">
              <OccupancyGauge occupied={zone.occupied} capacity={zone.capacity} />
            </div>
          </div>
          <div className="flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button variant="secondary" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <ConfirmButton label="Delete zone" onConfirm={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} />
          </div>
          {deleteMutation.isError && <ErrorBanner error={deleteMutation.error} />}
        </Card>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Gates</h2>
          <Button
            variant="secondary"
            size="sm"
            icon={addingGate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            onClick={() => setAddingGate((v) => !v)}
          >
            {addingGate ? "Cancel" : "Add gate"}
          </Button>
        </div>
        {addingGate && (
          <Card>
            <form onSubmit={gateForm.handleSubmit((values) => createGateMutation.mutate(values))} className="flex flex-col gap-5">
              {createGateMutation.isError && !isValidationError(createGateMutation.error) && (
                <ErrorBanner error={createGateMutation.error} />
              )}
              <Field label="Name" htmlFor="gate-name" error={gateForm.formState.errors.name?.message}>
                <input id="gate-name" className={inputClass} {...gateForm.register("name")} />
              </Field>
              <Field label="Direction" htmlFor="gate-direction" error={gateForm.formState.errors.directionMode?.message}>
                <select id="gate-direction" className={inputClass} {...gateForm.register("directionMode")}>
                  {DIRECTION_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </Field>
              <Button type="submit" disabled={gateForm.formState.isSubmitting || createGateMutation.isPending} className="self-start">
                Add gate
              </Button>
            </form>
          </Card>
        )}
        {gatesQuery.isPending ? (
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : gatesQuery.isError ? (
          <ErrorBanner error={gatesQuery.error} onRetry={() => gatesQuery.refetch()} />
        ) : gatesQuery.data.length === 0 ? (
          <EmptyState icon={DoorOpen} title="No gates yet" description="Add a gate so operators can start scanning codes here." />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {gatesQuery.data.map((gate) => {
              const DirectionIcon = DIRECTION_ICONS[gate.directionMode];
              return (
                <li
                  key={gate.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        gate.active
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      {gate.active ? <DoorOpen className="h-4 w-4" /> : <DoorClosed className="h-4 w-4" />}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">{gate.name}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <DirectionIcon className="h-3 w-3" />
                        {gate.directionMode}
                      </span>
                      {!gate.active && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                          deactivated
                        </span>
                      )}
                    </div>
                  </div>
                  {gate.active && (
                    <ConfirmButton
                      label="Deactivate"
                      confirmLabel="Deactivate"
                      onConfirm={() => deactivateMutation.mutate(gate.id)}
                      disabled={deactivateMutation.isPending}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {deactivateMutation.isError && <ErrorBanner error={deactivateMutation.error} />}
      </div>
    </div>
  );
}
