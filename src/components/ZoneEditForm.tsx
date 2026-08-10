import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  updateZone,
  capacityBelowOccupied,
  isConflict,
  isValidationError,
  type ApiError,
  type ZoneResponse,
  type ZoneUpdateRequest,
} from "gate-shared";
import { Field, inputClass } from "./Field.tsx";
import { ErrorBanner } from "./ErrorBanner.tsx";
import { Card } from "./Card.tsx";
import { Button } from "./Button.tsx";

interface FormValues {
  name: string;
  capacity: string;
}

export function ZoneEditForm({ zone, onDone }: { zone: ZoneResponse; onDone: () => void }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({ defaultValues: { name: zone.name, capacity: String(zone.capacity) } });

  const mutation = useMutation<ZoneResponse, ApiError, ZoneUpdateRequest>({
    mutationFn: (request) => updateZone(zone.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", zone.eventId] });
      onDone();
    },
    onError: (error) => {
      if (isValidationError(error)) {
        for (const [field, message] of Object.entries(error.fieldErrors ?? {})) {
          setError(field as keyof FormValues, { message });
        }
      }
    },
  });

  const onSubmit = (values: FormValues) => {
    const request: ZoneUpdateRequest = {};
    let hasError = false;

    if (dirtyFields.name) {
      if (!values.name.trim()) {
        setError("name", { message: "Name is required" });
        hasError = true;
      } else {
        request.name = values.name.trim();
      }
    }

    if (dirtyFields.capacity) {
      const capacity = Number(values.capacity);
      if (!Number.isInteger(capacity) || capacity < 1) {
        setError("capacity", { message: "Must be a whole number of at least 1" });
        hasError = true;
      } else if (capacityBelowOccupied(capacity, zone.occupied)) {
        setError("capacity", {
          message: `Cannot be lower than the ${zone.occupied} codes currently occupying this zone`,
        });
        hasError = true;
      } else {
        request.capacity = capacity;
      }
    }

    if (hasError) return;
    if (Object.keys(request).length === 0) {
      onDone();
      return;
    }
    mutation.mutate(request);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {mutation.isError && (
          <ErrorBanner
            error={mutation.error}
            onRetry={
              isConflict(mutation.error)
                ? () => {
                    queryClient.invalidateQueries({ queryKey: ["zones", zone.eventId] });
                    onDone();
                  }
                : undefined
            }
          />
        )}
        <Field label="Name" htmlFor="zone-edit-name" error={errors.name?.message}>
          <input id="zone-edit-name" className={inputClass} {...register("name")} />
        </Field>
        <Field label="Capacity" htmlFor="zone-edit-capacity" error={errors.capacity?.message}>
          <input id="zone-edit-capacity" type="number" min={1} className={inputClass} {...register("capacity")} />
        </Field>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
