/**
 * Seat availability states:
 * - AVAILABLE: Can be selected by the current active passenger.
 * - OCCUPIED: Already booked by external system (cannot be selected).
 * - SELECTED: Assigned to the currently selected active passenger in this booking.
 * - ASSIGNED: Assigned to a companion passenger in the current booking.
 * - LOCKED: Temporarily held by another active booking session.
 */
export const SEAT_STATES = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  SELECTED: 'SELECTED',
  ASSIGNED: 'ASSIGNED',
  LOCKED: 'LOCKED'
};

export function resolveSeatState({
  seatId,
  isOccupied = false,
  assignedToPassengerId = null,
  activePassengerId = null,
  isLockedByOther = false
}) {
  if (isOccupied) {
    return SEAT_STATES.OCCUPIED;
  }

  if (isLockedByOther) {
    return SEAT_STATES.LOCKED;
  }

  if (assignedToPassengerId) {
    if (assignedToPassengerId === activePassengerId) {
      return SEAT_STATES.SELECTED;
    }
    return SEAT_STATES.ASSIGNED;
  }

  return SEAT_STATES.AVAILABLE;
}

