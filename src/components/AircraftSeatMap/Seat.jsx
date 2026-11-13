import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { resolveSeatState, SEAT_STATES } from '../../utils/seatHelpers';

export default function Seat({ seat, configId = '3-2' }) {
  const {
    activePassengerId,
    passengers,
    seatToPassengerMap,
    seatLocks,
    sessionId,
    assignSeatToPassenger,
    addToast
  } = useBooking();

  const assignedPaxId = seatToPassengerMap[seat.seatId] || null;
  const assignedPax = assignedPaxId
    ? passengers.find((p) => p.id === assignedPaxId)
    : null;

  const lock = seatLocks[seat.seatId];
  const isLockedByOther = lock && lock.sessionId !== sessionId && lock.expiresAt > Date.now();

  const state = resolveSeatState({
    seatId: seat.seatId,
    isOccupied: seat.isOccupied,
    assignedToPassengerId: assignedPaxId,
    activePassengerId,
    isLockedByOther
  });

  const isSelectedByActivePax = state === SEAT_STATES.SELECTED;
  const isAssignedToCompanion = state === SEAT_STATES.ASSIGNED;
  const isOccupied = state === SEAT_STATES.OCCUPIED;
  const isLocked = state === SEAT_STATES.LOCKED;
  const isExtraLegroom = seat.category === 'Extra Legroom';

  const handleClick = () => {
    // If user clicks the seat they already currently hold, don't trigger repeated toast
    if (isSelectedByActivePax) {
      return;
    }

    if (isOccupied) {
      addToast('Seat Occupied', `Seat ${seat.seatId} is already booked and unavailable.`, 'error');
      return;
    }

    if (isLocked) {
      addToast(
        'Seat Temporarily Held',
        `Seat ${seat.seatId} is currently reserved by another booking session. Please select another seat.`,
        'warning'
      );
      return;
    }

    if (isAssignedToCompanion) {
      addToast(
        'Seat Assigned',
        `Seat ${seat.seatId} is already assigned to ${assignedPax ? assignedPax.name : 'another passenger'}.`,
        'warning'
      );
      return;
    }

    assignSeatToPassenger(seat.seatId);
  };

  // Base sizing based on configuration
  const seatWidthClass = configId === '3-2' ? 'w-9 sm:w-10 h-10 sm:h-11' : 'w-7 sm:w-8 h-9 sm:h-10 text-[11px]';

  // Dynamic styling based on state
  let visualClasses = '';
  let content = null;

  if (isOccupied) {
    visualClasses = 'bg-surface-variant text-outline cursor-not-allowed opacity-60';
    content = (
      <>
        <span className="font-label-sm text-label-sm">{seat.seatId}</span>
        <span className="material-symbols-outlined text-[10px]">close</span>
      </>
    );
  } else if (isLocked) {
    visualClasses = 'bg-secondary-fixed/40 border-2 border-secondary text-on-secondary-fixed cursor-not-allowed seat-locked-strobe';
    content = (
      <>
        <span className="font-label-sm text-label-sm font-bold">{seat.seatId}</span>
        <span className="material-symbols-outlined text-[11px] text-secondary" title="Held by another user">
          lock
        </span>
      </>
    );
  } else if (isSelectedByActivePax) {
    visualClasses = 'bg-primary-container text-on-primary ring-2 ring-secondary-container shadow-md transform scale-105 seat-selected-active z-10';
    content = (
      <>
        <span className="font-label-sm text-label-sm font-bold text-secondary-container">
          {seat.seatId}
        </span>
        <span className="text-[9px] font-bold text-on-primary uppercase tracking-tight">
          {assignedPax?.initials || 'ME'}
        </span>
      </>
    );
  } else if (isAssignedToCompanion) {
    visualClasses = 'bg-surface-container-highest text-on-surface ring-1 ring-on-surface hover:ring-2';
    content = (
      <>
        <span className="font-label-sm text-label-sm font-bold">{seat.seatId}</span>
        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tight">
          {assignedPax?.initials || 'PX'}
        </span>
      </>
    );
  } else if (isExtraLegroom) {
    visualClasses = 'bg-surface-container-lowest border-2 border-secondary text-on-surface hover:bg-secondary-fixed/50 hover:shadow transition-all shadow-xs';
    content = (
      <>
        <span className="font-label-sm text-label-sm font-bold">{seat.seatId}</span>
        <span className="material-symbols-outlined text-[10px] text-secondary">add</span>
      </>
    );
  } else {
    // Standard Available (Middle, Window, Aisle)
    visualClasses = 'bg-surface-container-low text-on-surface hover:bg-surface-container-high hover:border-secondary hover:shadow transition-all shadow-xs border border-surface-variant/40';
    content = (
      <>
        <span className="font-label-sm text-label-sm font-semibold">{seat.seatId}</span>
        {seat.price === 0 && (
          <span className="text-[8px] text-on-tertiary-container font-bold leading-none">FREE</span>
        )}
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOccupied || isLocked}
      aria-label={`Seat ${seat.seatId}, Category: ${seat.category}, Price: ₹${seat.price}, Status: ${state}`}
      className={`${seatWidthClass} rounded-t-lg rounded-b flex flex-col items-center justify-center transition-all duration-150 select-none ${visualClasses}`}
      title={`${seat.seatId} • ${seat.category} (₹${seat.price}) - ${state}`}
    >
      {content}
    </button>
  );
}

