import { apiClient } from "../client.ts";
import type { ScanResponse } from "../types.ts";

export function scanGate(gateId: number, code: number): Promise<ScanResponse> {
  return apiClient.post<ScanResponse>(`/gates/${gateId}/scan`, { code });
}
