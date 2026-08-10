import type { ZoneResponse } from "./types.ts";

/**
 * Mirrors ZoneServiceImpl.update: the server rejects shrinking capacity below the current
 * occupied count with a 409. Checking client-side avoids a round trip for the common case.
 */
export function capacityBelowOccupied(nextCapacity: number, occupied: number): boolean {
  return nextCapacity < occupied;
}

/**
 * Mirrors ZoneServiceImpl.create: an event may have at most one regular zone, enforced
 * server-side as a 409. Used to disable/warn on the "regular" checkbox before submitting.
 */
export function eventHasRegularZone(zones: ZoneResponse[]): boolean {
  return zones.some((zone) => zone.regular);
}
