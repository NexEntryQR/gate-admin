import { apiClient } from "../client.ts";
import type { ZoneCreateRequest, ZoneOccupancyResponse, ZoneResponse, ZoneUpdateRequest } from "../types.ts";

export function createZone(eventId: number, request: ZoneCreateRequest): Promise<ZoneResponse> {
  return apiClient.post<ZoneResponse>(`/events/${eventId}/zones`, request);
}

export function updateZone(id: number, request: ZoneUpdateRequest): Promise<ZoneResponse> {
  return apiClient.put<ZoneResponse>(`/zones/${id}`, request);
}

export function deleteZone(id: number): Promise<void> {
  return apiClient.delete<void>(`/zones/${id}`);
}

export function listZonesByEvent(eventId: number): Promise<ZoneResponse[]> {
  return apiClient.get<ZoneResponse[]>(`/events/${eventId}/zones`);
}

export function getZoneOccupancy(id: number): Promise<ZoneOccupancyResponse> {
  return apiClient.get<ZoneOccupancyResponse>(`/zones/${id}/occupancy`);
}
