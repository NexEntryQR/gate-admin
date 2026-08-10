import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createZone,
  eventHasRegularZone,
  isValidationError,
  type ApiError,
  type ZoneResponse,
  type ZoneCreateRequest,
} from "gate-shared";
import { Field, inputClass } from "./Field.tsx";
import { ErrorBanner } from "./ErrorBanner.tsx";
import { Card } from "./Card.tsx";
import { Button } from "./Button.tsx";

const ZONE_TYPES = ["REGULAR", "VIP", "BACKSTAGE", "MEDIA", "CUSTOM"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  type: z.enum(ZONE_TYPES),
  regular: z.boolean(),
  capacity: z.coerce.number().int("Must be a whole number").min(1, "Must be at least 1"),
});

type FormValues = z.infer<typeof schema>;

export function ZoneCreateForm({
  eventId,
  zones,
  onCreated,
}: {
  eventId: number;
  zones: ZoneResponse[];
  onCreated: () => void;
}) {
  const queryClient = useQueryClient();
  const hasRegular = eventHasRegularZone(zones);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "REGULAR", regular: !hasRegular, capacity: 1 },
  });

  const mutation = useMutation<ZoneResponse, ApiError, ZoneCreateRequest>({
    mutationFn: (request) => createZone(eventId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", eventId] });
      onCreated();
    },
    onError: (error) => {
      if (isValidationError(error)) {
        for (const [field, message] of Object.entries(error.fieldErrors ?? {})) {
          setError(field as keyof FormValues, { message });
        }
      }
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-5">
        {mutation.isError && !isValidationError(mutation.error) && <ErrorBanner error={mutation.error} />}
        <Field label="Name" htmlFor="zone-name" error={errors.name?.message}>
          <input id="zone-name" className={inputClass} {...register("name")} />
        </Field>
        <Field label="Type" htmlFor="zone-type" error={errors.type?.message}>
          <select id="zone-type" className={inputClass} {...register("type")}>
            {ZONE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Capacity" htmlFor="zone-capacity" error={errors.capacity?.message}>
          <input id="zone-capacity" type="number" min={1} className={inputClass} {...register("capacity")} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            disabled={hasRegular}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
            {...register("regular")}
          />
          Regular zone (the venue's outer boundary)
        </label>
        {hasRegular && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This event already has a regular zone — only one is allowed.
          </p>
        )}
        <Button type="submit" disabled={isSubmitting || mutation.isPending} className="self-start">
          Add zone
        </Button>
      </form>
    </Card>
  );
}
