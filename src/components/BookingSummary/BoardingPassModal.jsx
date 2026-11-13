import React from 'react';
import { useBooking } from '../../context/BookingContext';

export default function BoardingPassModal({ isOpen, onClose }) {
  const { flightDetails, passengers, seatAssignments, pricingSummary, currentAircraftConfig, bookingId } = useBooking();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-surface-variant flex flex-col gap-6 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container font-extrabold">
              Reservation Authenticated & PNR Issued
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface">
              AeroLuxe Electronic Boarding Pass
            </h2>
          </div>
        </div>

        {/* Ticket Mockup */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/60 overflow-hidden shadow-sm">
          {/* Top Flight Banner */}
          <div className="bg-primary-container text-on-primary p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-2xl">
                flight_takeoff
              </span>
              <div>
                <span className="text-xs uppercase tracking-wider text-secondary-fixed block font-bold">
                  Flight {flightDetails.flightNumber}
                </span>
                <span className="font-extrabold text-lg text-on-primary">
                  {flightDetails.from} → {flightDetails.to}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-primary-container block font-mono">PNR / Ref</span>
              <span className="font-mono font-extrabold text-secondary-container text-base">
                {bookingId}
              </span>
            </div>
          </div>

          {/* Passenger & Seats List */}
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-surface-variant pb-4">
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">
                  Departure Date
                </span>
                <span className="font-bold text-on-surface">24 Oct 2024</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">
                  Boarding Time
                </span>
                <span className="font-bold text-on-surface">07:50 AM</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">
                  Gate / Terminal
                </span>
                <span className="font-bold text-on-surface">Gate 4 • T1</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">
                  Cabin Layout
                </span>
                <span className="font-bold text-on-surface">{currentAircraftConfig.category}</span>
              </div>
            </div>

            {/* Travelers Manifest Cards */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Passenger Seat Allocations:
              </span>
              {pricingSummary.passengerBreakdown.map((item, idx) => (
                <div
                  key={item.passengerId}
                  className="p-3 rounded-xl bg-surface-container-lowest border border-surface-variant flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-on-surface">{item.name}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {item.type} • Meal: {item.mealShortName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                      Seat
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-primary-container text-secondary-container font-extrabold font-mono text-sm">
                      {item.seatId || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Perforated Barcode Stripe */}
            <div className="pt-2 flex flex-col items-center justify-center gap-1">
              <div className="font-mono text-[9px] text-outline tracking-widest uppercase">
                ||| | ||||| ||| ||||||| ||||| |||| |||||||| |||||| ||||| |||
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono">
                AEROLUXE-ETIX-{bookingId}-2024
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-on-surface-variant">
            Assessment demonstration • Simulates airline booking completion
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print Pass</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm"
            >
              Close Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

