import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { AIRPORTS } from '../../data/airports';

export default function FlightSelection() {
  const {
    setStep,
    tripType,
    setTripType,
    flightDetails,
    updateFlightDetails,
    passengers,
    addToast
  } = useBooking();

  const [isSwapping, setIsSwapping] = useState(false);
  const [showAirportModal, setShowAirportModal] = useState(null); // 'from' | 'to' | null

  const originAirport = AIRPORTS.find((a) => a.code === flightDetails.from) || AIRPORTS[0];
  const destAirport = AIRPORTS.find((a) => a.code === flightDetails.to) || AIRPORTS[1];

  const handleSwapAirports = () => {
    setIsSwapping(true);
    setTimeout(() => {
      updateFlightDetails({
        from: flightDetails.to,
        to: flightDetails.from
      });
      setIsSwapping(false);
    }, 200);
  };

  const handleAirportSelect = (code) => {
    if (showAirportModal === 'from') {
      if (code === flightDetails.to) {
        addToast('Invalid Selection', 'Source and destination cannot be identical.', 'warning');
        return;
      }
      updateFlightDetails({ from: code });
    } else if (showAirportModal === 'to') {
      if (code === flightDetails.from) {
        addToast('Invalid Selection', 'Source and destination cannot be identical.', 'warning');
        return;
      }
      updateFlightDetails({ to: code });
    }
    setShowAirportModal(null);
  };

  const handleContinue = () => {
    setStep(2);
  };

  const adultCount = passengers.filter((p) => p.type === 'Adult').length;
  const childCount = passengers.filter((p) => p.type === 'Child').length;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between py-space-xl px-4 sm:px-gutter bg-surface">
      {/* Atmospheric subtle ambient glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[820px] h-[340px] bg-gradient-to-b from-primary-fixed-dim/15 via-secondary-container/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col gap-space-lg">
        {/* Stepper / Section Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-space-xs text-secondary mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Step 01 • Route Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Select Flight Leg
            </h1>
          </div>

          {/* Trip Type Segmented Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-surface-container shadow-sm self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTripType('oneway')}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                tripType === 'oneway'
                  ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType('roundtrip')}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                tripType === 'roundtrip'
                  ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* Main Search / Route Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-[0_4px_24px_-4px_rgba(8,21,52,0.06)] border border-surface-variant/40 flex flex-col gap-space-md">
          {/* Origin & Destination Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-space-sm sm:gap-space-md items-center">
            {/* Origin Card */}
            <div
              onClick={() => setShowAirportModal('from')}
              className="group relative flex flex-col p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-secondary-container/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Departure City
                </span>
                <span className="text-[10px] text-secondary font-medium group-hover:underline">Click to change</span>
              </div>
              <div className="flex items-baseline justify-between mt-space-xs">
                <span className="text-3xl font-bold text-on-surface tracking-tight font-mono">
                  {originAirport.code}
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {originAirport.city}
                </span>
              </div>
              <span className="text-xs font-normal text-on-surface-variant truncate mt-0.5">
                {originAirport.name} • {originAirport.terminal}
              </span>
            </div>

            {/* Swap Vector Button */}
            <button
              type="button"
              onClick={handleSwapAirports}
              aria-label="Swap departure and destination"
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-surface-container-lowest shadow-lg border border-surface-variant flex items-center justify-center text-primary-container hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 active:scale-95 ${
                isSwapping ? 'rotate-180 scale-110' : ''
              }`}
            >
              <span className="material-symbols-outlined text-body-lg">swap_horiz</span>
            </button>

            {/* Destination Card */}
            <div
              onClick={() => setShowAirportModal('to')}
              className="group relative flex flex-col p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer text-left md:text-right border border-transparent hover:border-secondary-container/40"
            >
              <div className="flex items-center justify-between md:justify-end gap-2">
                <span className="text-[10px] text-secondary font-medium group-hover:underline order-2 md:order-1">Click to change</span>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider order-1 md:order-2">
                  Arrival Destination
                </span>
              </div>
              <div className="flex items-baseline justify-between md:justify-end md:gap-space-sm mt-space-xs">
                <span className="text-sm font-semibold text-secondary order-2 md:order-1">
                  {destAirport.city}
                </span>
                <span className="text-3xl font-bold text-on-surface tracking-tight font-mono order-1 md:order-2">
                  {destAirport.code}
                </span>
              </div>
              <span className="text-xs font-normal text-on-surface-variant truncate mt-0.5">
                {destAirport.name} • {destAirport.terminal}
              </span>
            </div>
          </div>

          {/* Date & Travelers Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm sm:gap-space-md pt-space-xs">
            {/* Departure Date */}
            <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container shadow-sm">
                <span className="material-symbols-outlined text-body-lg">calendar_month</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Departure Date
                </span>
                <span className="text-base font-semibold text-on-surface">
                  24 Oct 2024
                </span>
                <span className="text-xs font-normal text-on-surface-variant">
                  Thursday • Guaranteed Non-Stop Window
                </span>
              </div>
            </div>

            {/* Travelers & Cabin */}
            <div
              onClick={() => setStep(3)}
              className="group flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-body-lg">group</span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Travelers & Cabin
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-on-surface">
                    {passengers.length} Travelers
                  </span>
                  <span className="text-xs text-secondary font-medium group-hover:underline">Manage manifest &rarr;</span>
                </div>
                <span className="text-xs font-normal text-on-surface-variant">
                  {adultCount} Adult{adultCount !== 1 ? 's' : ''}, {childCount} Child{childCount !== 1 ? 'ren' : ''} • All Cabins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Flight Selection Banner / Option Card */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between px-space-xs">
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
              Optimal Schedule Match
            </span>
            <span className="text-xs text-on-tertiary-container font-medium flex items-center gap-1.5 bg-tertiary-container/10 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container inline-block animate-pulse" />
              Guaranteed On-Time
            </span>
          </div>

          <div className="group relative bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-[0_2px_12px_-2px_rgba(8,21,52,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(8,21,52,0.08)] border border-surface-variant/40 transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              {/* Left Info Block */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-space-md sm:gap-space-lg">
                {/* Flight Identity Tag */}
                <div className="flex sm:flex-col items-center sm:items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="text-sm font-bold text-primary-container font-mono">
                      {flightDetails.flightNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      {flightDetails.aircraftType}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant mt-1 font-normal">
                    {flightDetails.fleetType}
                  </span>
                </div>

                {/* Time Vector Progression */}
                <div className="flex items-center gap-space-md">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-bold text-on-surface tabular-nums">
                      {flightDetails.departureTime}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {originAirport.code}
                    </span>
                  </div>

                  {/* Flight Vector Line */}
                  <div className="flex flex-col items-center px-space-xs w-28 sm:w-36">
                    <span className="text-[11px] text-on-surface-variant font-medium mb-1">
                      {flightDetails.duration} • Non-stop
                    </span>
                    <div className="relative w-full flex items-center">
                      <div className="w-full h-[2px] bg-surface-variant rounded-full" />
                      <span className="absolute left-1/2 -translate-x-1/2 material-symbols-outlined text-body-sm text-secondary rotate-90 bg-surface-container-lowest px-1">
                        flight
                      </span>
                    </div>
                    <span className="text-[11px] text-on-tertiary-container mt-1 font-medium">
                      Direct Flight
                    </span>
                  </div>

                  <div className="flex flex-col text-right sm:text-left">
                    <span className="text-xl sm:text-2xl font-bold text-on-surface tabular-nums">
                      {flightDetails.arrivalTime}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {destAirport.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Fare Details */}
              <div className="flex items-center justify-between lg:justify-end gap-space-lg pt-space-sm lg:pt-0 border-t lg:border-t-0 border-surface-variant/40">
                <div className="flex flex-col lg:items-end">
                  <span className="text-[11px] uppercase text-on-surface-variant font-medium tracking-wide">
                    Base Fare
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary-container tabular-nums">
                      ₹{flightDetails.baseFarePerPerson.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-on-surface-variant font-normal">/ person</span>
                  </div>
                  <span className="text-[11px] text-secondary font-medium">
                    Included baggage & lounge check-in
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Tray */}
        <div className="pt-space-xs flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-body-md text-secondary">verified_user</span>
            <span>Price locked for the next 15 minutes. Free cancellation within 24h.</span>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto px-space-xl py-3 rounded-xl bg-primary-container text-on-primary hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-200 text-sm font-semibold tracking-wide flex items-center justify-center gap-space-sm shadow-md active:scale-[0.99]"
          >
            <span>Continue to Aircraft Selection</span>
            <span className="material-symbols-outlined text-body-lg">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Micro Navigation Progress Footer */}
      <div className="w-full max-w-4xl mx-auto pt-space-lg flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-surface-variant/40 mt-space-lg">
        <span className="uppercase tracking-wider">AeroLuxe Booking Protocol v4.2</span>
        <span>Leg 1 of 1 Configured</span>
      </div>

      {/* Airport Selection Modal */}
      {showAirportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-surface-variant flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
              <h2 className="font-bold text-on-surface text-base">
                Select {showAirportModal === 'from' ? 'Departure City' : 'Arrival Destination'}
              </h2>
              <button
                type="button"
                onClick={() => setShowAirportModal(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {AIRPORTS.map((airport) => (
                <div
                  key={airport.code}
                  onClick={() => handleAirportSelect(airport.code)}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-on-surface font-mono">{airport.code}</span>
                      <span className="text-secondary font-bold text-sm">{airport.city}</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">
                      {airport.name} • {airport.terminal}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">check_circle</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

