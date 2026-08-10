// Mirrors com.eventaccess DTOs/entities 1:1 — verified against gate-mgt source, not guessed.

export type EventStatus = "DRAFT" | "ACTIVE" | "CLOSED";
export type ZoneType = "REGULAR" | "VIP" | "BACKSTAGE" | "MEDIA" | "CUSTOM";
export type GateDirectionMode = "IN" | "OUT" | "BOTH";
export type AttendanceDirection = "IN" | "OUT";

// LocalDateTime serializes as an ISO-8601 string without a timezone offset (e.g. "2026-08-01T18:00:00").
export type LocalDateTimeString = string;

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface EventResponse {
  id: number;
  name: string;
  venue: string;
  description: string | null;
  startDatetime: LocalDateTimeString;
  endDatetime: LocalDateTimeString;
  status: EventStatus;
  createdAt: LocalDateTimeString;
  updatedAt: LocalDateTimeString;
}

export interface EventSummaryResponse {
  id: number;
  name: string;
  status: EventStatus;
  startDatetime: LocalDateTimeString;
  endDatetime: LocalDateTimeString;
}

export interface EventCreateRequest {
  name: string;
  venue: string;
  description?: string | null;
  startDatetime: LocalDateTimeString;
  endDatetime: LocalDateTimeString;
}

export interface EventUpdateRequest {
  name?: string;
  venue?: string;
  description?: string | null;
  startDatetime?: LocalDateTimeString;
  endDatetime?: LocalDateTimeString;
}

export interface ZoneResponse {
  id: number;
  eventId: number;
  name: string;
  type: ZoneType;
  regular: boolean;
  capacity: number;
  occupied: number;
  available: number;
  createdAt: LocalDateTimeString;
  updatedAt: LocalDateTimeString;
}

export interface ZoneCreateRequest {
  name: string;
  type: ZoneType;
  regular: boolean;
  capacity: number;
}

export interface ZoneUpdateRequest {
  name?: string;
  capacity?: number;
}

export interface ZoneOccupancyResponse {
  id: number;
  name: string;
  capacity: number;
  occupied: number;
  available: number;
}

export interface GateResponse {
  id: number;
  zoneId: number;
  name: string;
  directionMode: GateDirectionMode;
  active: boolean;
}

export interface GateCreateRequest {
  name: string;
  directionMode: GateDirectionMode;
}

export interface ScanRequest {
  code: number;
}

export interface ScanResponse {
  attendanceId: number;
  code: number;
  zoneId: number;
  zoneName: string;
  gateId: number;
  gateName: string;
  direction: AttendanceDirection;
  scannedAt: LocalDateTimeString;
  occupied: number;
  capacity: number;
}
