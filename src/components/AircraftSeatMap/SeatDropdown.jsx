import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { resolveSeatState, SEAT_STATES } from '../../utils/seatHelpers';

export default function SeatDropdown() {
  const {
    activePassenger,
    activePassengerId,
    seats,
    seatAssignments,
    seatToPassengerMap,
    seatLocks,
    sessionId,
    assignSeatToPassenger
  } = useBooking();

  if (!activePassenger) return null;

  const currentAssignedSeatId = seatAssignments[activePassengerId] || '';

  const seatEntries = Object.values(seats).sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.letter.localeCompare(b.letter);
  });

  const handleChange = (e) => {
    const chosenSeatId = e.target.value;
    if (chosenSeatId) {
      assignSeatToPassenger(chosenSeatId, activePassengerId);
    }
  };

  return (
    <div className="mt-space-md pt-space-sm border-t border-surface-variant/40">
      <label
        htmlFor="seat-select-dropdown"
        className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-xs font-bold text-xs"
      >
        Quick Pick for {activePassenger.name}
      </label>

      <div className="relative">
        <select
          id="seat-select-dropdown"
          value={currentAssignedSeatId}
          onChange={handleChange}
          aria-label={`Select seat for ${activePassenger.name}`}
          className="w-full appearance-none bg-surface-container-low text-on-surface rounded-xl py-space-sm pl-space-sm pr-space-lg font-label-md text-label-md font-semibold focus:outline-none focus:ring-2 focus:ring-secondary-container border border-surface-variant/40 cursor-pointer text-xs"
        >
          <option value="" disabled>
            -- Choose a seat for {activePassenger.name} --
          </option>

          {seatEntries.map((seat) => {
            const assignedPaxId = seatToPassengerMap[seat.seatId] || null;
            const lock = seatLocks[seat.seatId];
            const isLockedByOther = lock && lock.sessionId !== sessionId && lock.expiresAt > Date.now();

            const state = resolveSeatState({
              seatId: seat.seatId,
              isOccupied: seat.isOccupied,
              assignedToPassengerId: assignedPaxId,
              activePassengerId,
              isLockedByOther
            });

            const isAssignedToThisPax = state === SEAT_STATES.SELECTED;
            const isAssignedToOther = state === SEAT_STATES.ASSIGNED;
            const isOccupied = state === SEAT_STATES.OCCUPIED;
            const isLocked = state === SEAT_STATES.LOCKED;

            const isSelectable = !isOccupied && !isLocked && !isAssignedToOther;

            let statusLabel = '';
            if (isAssignedToThisPax) {
              statusLabel = '(Current Selection)';
            } else if (isOccupied) {
              statusLabel = '(Occupied)';
            } else if (isLocked) {
              statusLabel = '(Temporarily Held)';
            } else if (isAssignedToOther) {
              statusLabel = '(Assigned to Companion)';
            }

            const priceDisplay = seat.price === 0 ? 'Free' : `₹${seat.price}`;

            return (
              <option
                key={seat.seatId}
                value={seat.seatId}
                disabled={!isSelectable && !isAssignedToThisPax}
              >
                Seat {seat.seatId} — {seat.category} ({priceDisplay}) {statusLabel}
              </option>
            );
          })}
        </select>

        <span className="material-symbols-outlined text-on-surface-variant absolute right-space-sm top-1/2 -translate-y-1/2 pointer-events-none text-body-md">
          unfold_more
        </span>
      </div>
    </div>
  );
}

