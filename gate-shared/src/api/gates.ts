import { apiClient } from "../client.ts";
import type { GateCreateRequest, GateResponse } from "../types.ts";

export function createGate(zoneId: number, request: GateCreateRequest): Promise<GateResponse> {
  return apiClient.post<GateResponse>(`/zones/${zoneId}/gates`, request);
}

export function listGatesByEvent(eventId: number): Promise<GateResponse[]> {
  return apiClient.get<GateResponse[]>(`/events/${eventId}/gates`);
}

export function listGatesByZone(zoneId: number): Promise<GateResponse[]> {
  return apiClient.get<GateResponse[]>(`/zones/${zoneId}/gates`);
}

export function deactivateGate(gateId: number): Promise<GateResponse> {
  return apiClient.patch<GateResponse>(`/gates/${gateId}/deactivate`);
}
