import { apiClient } from "../client.ts";
import type { EventCreateRequest, EventResponse, EventUpdateRequest, EventSummaryResponse, PageResponse } from "../types.ts";

export function createEvent(request: EventCreateRequest): Promise<EventResponse> {
  return apiClient.post<EventResponse>("/events", request);
}

export function updateEvent(id: number, request: EventUpdateRequest): Promise<EventResponse> {
  return apiClient.put<EventResponse>(`/events/${id}`, request);
}

export function deleteEvent(id: number): Promise<void> {
  return apiClient.delete<void>(`/events/${id}`);
}

export function getEvent(id: number): Promise<EventResponse> {
  return apiClient.get<EventResponse>(`/events/${id}`);
}

export interface ListEventsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export function listEvents(params: ListEventsParams = {}): Promise<PageResponse<EventSummaryResponse>> {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  if (params.sort !== undefined) search.set("sort", params.sort);
  const query = search.toString();
  return apiClient.get<PageResponse<EventSummaryResponse>>(`/events${query ? `?${query}` : ""}`);
}
