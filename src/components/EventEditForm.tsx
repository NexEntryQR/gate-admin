import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent, isValidationError, type ApiError, type EventResponse, type EventUpdateRequest } from "gate-shared";
import { Field, inputClass } from "./Field.tsx";
import { ErrorBanner } from "./ErrorBanner.tsx";
import { Card } from "./Card.tsx";
import { Button } from "./Button.tsx";
import { toDatetimeLocalValue, isFutureDatetimeLocal } from "../lib/datetime.ts";
import { applyFieldErrors } from "../lib/formErrors.ts";

interface FormValues {
  name: string;
  venue: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
}

export function EventEditForm({ event, onDone }: { event: EventResponse; onDone: () => void }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: {
      name: event.name,
      venue: event.venue,
      description: event.description ?? "",
      startDatetime: toDatetimeLocalValue(event.startDatetime),
      endDatetime: toDatetimeLocalValue(event.endDatetime),
    },
  });

  const mutation = useMutation<EventResponse, ApiError, EventUpdateRequest>({
    mutationFn: (request) => updateEvent(event.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      onDone();
    },
    onError: (error) => {
      if (isValidationError(error)) {
        applyFieldErrors<FormValues>(error.fieldErrors, setError);
      }
    },
  });

  // Only send fields the user actually touched. Untouched date fields must NOT be
  // resent as-is: an event's original start time can drift into the past between load
  // and edit, and the server re-validates @Future on any provided value, not just changes.
  const onSubmit = (values: FormValues) => {
    const request: EventUpdateRequest = {};
    let hasError = false;

    if (dirtyFields.name) {
      if (!values.name.trim()) {
        setError("name", { message: "Name is required" });
        hasError = true;
      } else {
        request.name = values.name.trim();
      }
    }
    if (dirtyFields.venue) {
      if (!values.venue.trim()) {
        setError("venue", { message: "Venue is required" });
        hasError = true;
      } else {
        request.venue = values.venue.trim();
      }
    }
    if (dirtyFields.description) {
      request.description = values.description;
    }
    if (dirtyFields.startDatetime) {
      if (!isFutureDatetimeLocal(values.startDatetime)) {
        setError("startDatetime", { message: "Must be in the future" });
        hasError = true;
      } else {
        request.startDatetime = values.startDatetime;
      }
    }
    if (dirtyFields.endDatetime) {
      if (!isFutureDatetimeLocal(values.endDatetime)) {
        setError("endDatetime", { message: "Must be in the future" });
        hasError = true;
      } else {
        request.endDatetime = values.endDatetime;
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
        {mutation.isError && !isValidationError(mutation.error) && <ErrorBanner error={mutation.error} />}
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <input id="name" className={inputClass} {...register("name")} />
        </Field>
        <Field label="Venue" htmlFor="venue" error={errors.venue?.message}>
          <input id="venue" className={inputClass} {...register("venue")} />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description?.message}>
          <textarea id="description" rows={3} className={inputClass} {...register("description")} />
        </Field>
        <Field label="Starts" htmlFor="startDatetime" error={errors.startDatetime?.message}>
          <input id="startDatetime" type="datetime-local" className={inputClass} {...register("startDatetime")} />
        </Field>
        <Field label="Ends" htmlFor="endDatetime" error={errors.endDatetime?.message}>
          <input id="endDatetime" type="datetime-local" className={inputClass} {...register("endDatetime")} />
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
