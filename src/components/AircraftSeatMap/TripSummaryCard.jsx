import React from 'react';
import { useBooking } from '../../context/BookingContext';

export default function TripSummaryCard() {
  const {
    flightDetails,
    passengers,
    pricingSummary,
    setStep
  } = useBooking();

  return (
    <div className="flex flex-col gap-space-md sticky top-20">
      {/* Trip Details Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-surface-variant/40">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-variant/30">
          <h2 className="text-base sm:text-lg font-bold text-on-surface">
            Your Trip
          </h2>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            Modify
          </button>
        </div>

        {/* Trip Subtitle Meta */}
        <div className="bg-surface-container-low p-space-sm rounded-xl mb-space-md">
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Flight Option
            </span>
            <span className="text-[11px] font-semibold text-on-surface">
              One way • {passengers.length} Travelers
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-on-surface">
              <span>{flightDetails.from}</span>
              <span className="material-symbols-outlined text-body-md text-secondary">
                flight_takeoff
              </span>
              <span>{flightDetails.to}</span>
            </div>
            <span className="text-xs font-semibold text-on-surface font-mono">
              {flightDetails.flightNumber}
            </span>
          </div>

          <div className="text-on-surface-variant mt-1 flex items-center gap-1 text-[11px] font-normal">
            <span className="material-symbols-outlined text-xs">event</span>
            <span>Thursday, 24 Oct 2024 • Non-stop ({flightDetails.duration})</span>
          </div>
        </div>

        {/* Itemized Breakdown */}
        <div className="flex flex-col gap-space-sm text-xs">
          {/* Base Airfare */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-on-surface block">
                Airfare ({passengers.length} Travelers)
              </span>
              <span className="text-[11px] font-normal text-on-surface-variant">
                Economy Classic Base
              </span>
            </div>
            <span className="text-xs font-semibold text-on-surface tabular-nums">
              ₹{pricingSummary.baseAirfare.toLocaleString('en-IN')}
            </span>
          </div>

          {pricingSummary.cabinConfigurationSurcharge > 0 && (
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-normal">Wide-Body Surcharge</span>
              <span className="font-semibold text-on-surface tabular-nums">
                ₹{pricingSummary.cabinConfigurationSurcharge.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <div className="h-px bg-surface-variant my-space-xs" />

          {/* Assigned Seats Itemized List */}
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <span className="text-xs font-semibold text-on-surface">
                Assigned Seats
              </span>
              <span className="text-xs font-semibold text-on-surface tabular-nums">
                ₹{pricingSummary.totalSeatCharges.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 pl-space-sm">
              {pricingSummary.passengerBreakdown.map((item) => {
                const hasSeat = !!item.seatId;
                const dotColor = hasSeat ? 'bg-secondary-container' : 'bg-surface-variant';

                return (
                  <div
                    key={item.passengerId}
                    className="flex items-center justify-between text-on-surface-variant text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                      <span className="truncate">
                        {item.name} (
                        {hasSeat ? `${item.seatId} - ${item.seatType || 'Seat'}` : 'Pending'}
                        )
                      </span>
                    </div>
                    <span
                      className={`font-label-sm text-label-sm font-bold ${
                        item.seatPrice === 0 ? 'text-on-tertiary-container' : 'text-on-surface'
                      }`}
                    >
                      {item.seatPrice === 0 ? '₹0 (Free)' : `₹${item.seatPrice}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meals Subtotal */}
          <div className="flex items-center justify-between pt-space-xs">
            <span className="text-on-surface-variant">Meals Subtotal</span>
            <span
              className={`font-label-sm text-label-sm font-bold ${
                pricingSummary.totalMealCharges === 0
                  ? 'text-on-tertiary-container'
                  : 'text-on-surface'
              }`}
            >
              {pricingSummary.totalMealCharges === 0
                ? '₹0 (Free)'
                : `₹${pricingSummary.totalMealCharges.toLocaleString('en-IN')}`}
            </span>
          </div>

          {/* Taxes & Surcharges */}
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant">Taxes & Aviation Fees</span>
            <span className="font-label-sm text-label-sm text-on-surface font-bold">
              ₹{pricingSummary.taxes.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="h-px bg-surface-variant my-space-xs" />

          {/* Total Amount Card Highlight */}
          <div className="bg-primary-container text-on-primary p-space-md rounded-2xl flex items-center justify-between shadow-inner">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-on-primary-container block font-medium">
                Total Amount
              </span>
              <span className="text-[11px] text-on-primary-container font-normal">
                Inclusive of GST
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-secondary-container tracking-tight tabular-nums">
                ₹{pricingSummary.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-space-md flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm text-[11px]">
          <span className="material-symbols-outlined text-secondary text-body-md">verified_user</span>
          <span>Free seat changes allowed up to 4 hours before departure.</span>
        </div>
      </div>
    </div>
  );
}

