import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, isValidationError, type ApiError, type EventResponse, type EventCreateRequest } from "gate-shared";
import { Field, inputClass } from "../components/Field.tsx";
import { ErrorBanner } from "../components/ErrorBanner.tsx";
import { Card } from "../components/Card.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { Button } from "../components/Button.tsx";
import { isFutureDatetimeLocal } from "../lib/datetime.ts";
import { applyFieldErrors } from "../lib/formErrors.ts";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  venue: z.string().trim().min(1, "Venue is required").max(200),
  description: z.string().optional(),
  startDatetime: z.string().min(1, "Start date/time is required").refine(isFutureDatetimeLocal, "Must be in the future"),
  endDatetime: z.string().min(1, "End date/time is required").refine(isFutureDatetimeLocal, "Must be in the future"),
});

type FormValues = z.infer<typeof schema>;

export function EventCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation<EventResponse, ApiError, EventCreateRequest>({
    mutationFn: createEvent,
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate(`/events/${event.id}`);
    },
    onError: (error) => {
      if (isValidationError(error)) {
        applyFieldErrors<FormValues>(error.fieldErrors, setError);
      }
    },
  });

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <PageHeader title="New event" subtitle="Set the basics — you can add zones and gates once it's created." />
      <Card>
        {mutation.isError && !isValidationError(mutation.error) && (
          <div className="mb-4">
            <ErrorBanner error={mutation.error} />
          </div>
        )}
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-5">
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
          <Button type="submit" disabled={isSubmitting || mutation.isPending} className="self-start">
            Create event
          </Button>
        </form>
      </Card>
    </div>
  );
}
