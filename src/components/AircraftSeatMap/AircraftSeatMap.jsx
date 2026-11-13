import React from 'react';
import { useBooking } from '../../context/BookingContext';
import Seat from './Seat';
import SeatLegend from './SeatLegend';
import SeatDropdown from './SeatDropdown';
import TripSummaryCard from './TripSummaryCard';

export default function AircraftSeatMap() {
  const {
    setStep,
    flightDetails,
    aircraftConfig,
    currentAircraftConfig,
    passengers,
    activePassengerId,
    setActivePassenger,
    seats,
    seatAssignments,
    lockSelectedSeats,
    addToast
  } = useBooking();

  const handleProceedToSummary = () => {
    // Check if any passenger is missing a seat
    const missingSeats = passengers.filter((p) => !seatAssignments[p.id]);
    if (missingSeats.length > 0) {
      addToast(
        'Seat Selection Incomplete',
        `${missingSeats.length} traveler(s) do not have an assigned seat yet.`,
        'warning'
      );
    }

    // Lock seats upon proceeding as specified in Prompt Section 5:
    // "When the user proceeds after selecting the seat, the application should lock the seat."
    const lockResult = lockSelectedSeats();
    if (lockResult.success) {
      setStep(5);
    }
  };

  const isWideBody = aircraftConfig === '2-3-2';

  // Group seats by rows 1 to 10
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Minimal Context Flight Sub-bar */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-gutter py-space-sm shadow-xs border-b border-surface-variant/40 flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            <span className="uppercase tracking-wider text-on-surface-variant text-xs font-semibold">
              Step 4 of 5
            </span>
          </div>
          <div className="h-4 w-px bg-surface-variant" />
          <div className="flex items-center gap-space-sm">
            <span className="text-sm sm:text-base font-semibold text-on-surface">
              {flightDetails.from} ({flightDetails.from})
            </span>
            <span className="material-symbols-outlined text-secondary text-body-lg">
              arrow_forward
            </span>
            <span className="text-sm sm:text-base font-semibold text-on-surface">
              {flightDetails.to} ({flightDetails.to})
            </span>
            <span className="rounded-md bg-surface-container px-2 py-0.5 text-xs text-on-surface-variant font-mono font-medium">
              {flightDetails.flightNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-lg text-on-surface-variant text-xs font-medium">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-body-lg text-secondary">calendar_today</span>
            <span>24 Oct 2024</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-body-lg text-secondary">
              airline_seat_recline_normal
            </span>
            <span>{currentAircraftConfig.name}</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Work Canvas */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-gutter py-space-lg flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: CTA, Passenger Selector, Dropdown & Seat Legend (Col-span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-space-md order-2 lg:order-1">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleProceedToSummary}
              className="w-full bg-primary-container text-on-primary py-3 px-space-md rounded-2xl text-sm font-semibold tracking-wide flex items-center justify-between shadow-md hover:bg-on-background transition-all group"
            >
              <span>Continue to Summary</span>
              <span className="material-symbols-outlined text-secondary-container group-hover:translate-x-1 transition-transform">
                east
              </span>
            </button>

            {/* Passenger Switcher Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-variant/40">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Select Passenger
                </span>
                <span className="text-[11px] text-secondary-container font-semibold bg-primary-container px-2.5 py-0.5 rounded-full">
                  {passengers.length} Travelers
                </span>
              </div>

              {/* Passenger List Buttons */}
              <div className="flex flex-col gap-space-xs">
                {passengers.map((pax) => {
                  const isActive = pax.id === activePassengerId;
                  const assignedSeatId = seatAssignments[pax.id];
                  const seatObj = assignedSeatId ? seats[assignedSeatId] : null;

                  return (
                    <button
                      key={pax.id}
                      type="button"
                      onClick={() => setActivePassenger(pax.id)}
                      className={`w-full text-left p-space-sm rounded-xl transition-all flex items-center justify-between border ${
                        isActive
                          ? 'bg-surface-container-high ring-2 ring-secondary-container/70 border-transparent shadow-xs'
                          : 'hover:bg-surface-container border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <div
                          className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center ${
                            isActive
                              ? 'bg-primary-container text-on-primary'
                              : 'bg-surface-container-highest text-on-surface'
                          }`}
                        >
                          {pax.initials}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-semibold ${
                              isActive ? 'text-on-surface' : 'text-on-surface-variant'
                            }`}
                          >
                            {pax.name}
                          </div>
                          <div className="text-[11px] font-normal text-on-surface-variant">
                            {pax.category} {pax.isLead ? '(Lead)' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Seat Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          assignedSeatId
                            ? 'bg-primary-container text-secondary-container shadow-xs'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {assignedSeatId
                          ? `${assignedSeatId} • ${seatObj?.price === 0 ? 'Free' : `₹${seatObj?.price}`}`
                          : 'Pending'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Synchronized Seat Selector Dropdown */}
              <SeatDropdown />
            </div>

            {/* Seat Legend Card */}
            <SeatLegend />
          </div>

          {/* CENTER COLUMN: Interactive Fuselage Cabin Matrix (Col-span 5) */}
          <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-3 sm:p-space-md shadow-md border border-surface-variant/40 relative overflow-hidden fuselage-shadow">
              {/* Cockpit / Nose Cone Outline SVG Graphic */}
              <div className="w-full flex flex-col items-center pb-space-sm pt-space-xs">
                <svg
                  className="w-44 h-12 text-surface-container-highest"
                  fill="none"
                  viewBox="0 0 160 50"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 50 C25 20, 50 4, 80 4 C110 4, 135 20, 150 50"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M50 32 C60 22, 70 20, 80 20 C90 20, 100 22, 110 32"
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <circle cx="80" cy="12" fill="currentColor" opacity="0.6" r="2.5" />
                </svg>
                <div className="flex items-center gap-space-xs -mt-1.5">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    flight
                  </span>
                  <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase font-bold text-[10px]">
                    Front of Aircraft
                  </span>
                </div>
              </div>

              {/* Galley & Front Lavatory Indicator */}
              <div className="flex items-center justify-between px-space-md py-space-xs mb-space-sm bg-surface-container-low rounded-xl text-on-surface-variant font-label-sm text-label-sm text-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-body-sm">soup_kitchen</span>
                  <span>Galley 1</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-body-sm">wc</span>
                  <span>Lavatory L1</span>
                </div>
              </div>

              {/* Column Header Letters */}
              {!isWideBody ? (
                // 3-2 Configuration Column Headers
                <div className="grid grid-cols-6 gap-space-xs text-center font-label-md text-label-md text-on-surface-variant font-bold mb-space-xs px-2 text-xs">
                  <span>A</span>
                  <span>B</span>
                  <span>C</span>
                  <span className="text-[10px] uppercase tracking-wider text-outline">Aisle</span>
                  <span>D</span>
                  <span>E</span>
                </div>
              ) : (
                // 2-3-2 Configuration Column Headers
                <div className="grid grid-cols-9 gap-1 text-center font-label-md text-label-md text-on-surface-variant font-bold mb-space-xs px-1 text-xs">
                  <span>A</span>
                  <span>B</span>
                  <span className="text-[9px] uppercase tracking-wider text-outline">|</span>
                  <span>C</span>
                  <span>D</span>
                  <span>E</span>
                  <span className="text-[9px] uppercase tracking-wider text-outline">|</span>
                  <span>F</span>
                  <span>G</span>
                </div>
              )}

              {/* SEAT MATRIX ROWS 1 to 10 */}
              <div className="flex flex-col gap-2 relative">
                {rows.map((rowNum) => {
                  const isExitRow = rowNum === 6;
                  const isFirstRow = rowNum === 1;

                  return (
                    <React.Fragment key={rowNum}>
                      {/* EMERGENCY EXIT ROW BANNER BEFORE ROW 6 */}
                      {isExitRow && (
                        <div className="flex items-center justify-between py-1.5 px-3 my-1 bg-surface-container-low rounded-xl border border-error/20">
                          <div className="flex items-center gap-1 text-error font-label-sm text-label-sm font-bold text-[10px]">
                            <span className="material-symbols-outlined text-[14px]">logout</span>
                            <span>EXIT</span>
                          </div>
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold text-[10px]">
                            Emergency Exit Row • Extra Legroom
                          </span>
                          <div className="flex items-center gap-1 text-error font-label-sm text-label-sm font-bold text-[10px]">
                            <span>EXIT</span>
                            <span className="material-symbols-outlined text-[14px]">login</span>
                          </div>
                        </div>
                      )}

                      {/* Row Seating Strip */}
                      <div
                        className={`flex items-center justify-between p-1 rounded-xl transition-colors ${
                          isFirstRow || isExitRow ? 'bg-secondary-fixed/15' : 'hover:bg-surface-container-low/50'
                        }`}
                      >
                        {!isWideBody ? (
                          // 3-2 Narrow-body layout
                          <>
                            {/* Left Bank: A, B, C */}
                            <div className="flex gap-1.5">
                              {['A', 'B', 'C'].map((letter) => {
                                const seat = seats[`${rowNum}${letter}`];
                                return seat ? (
                                  <Seat key={seat.seatId} seat={seat} configId="3-2" />
                                ) : null;
                              })}
                            </div>

                            {/* Center Row Number */}
                            <div className="w-8 text-center font-label-md text-label-md font-extrabold text-on-surface-variant text-xs">
                              {rowNum}
                            </div>

                            {/* Right Bank: D, E */}
                            <div className="flex gap-1.5">
                              {['D', 'E'].map((letter) => {
                                const seat = seats[`${rowNum}${letter}`];
                                return seat ? (
                                  <Seat key={seat.seatId} seat={seat} configId="3-2" />
                                ) : null;
                              })}
                            </div>
                          </>
                        ) : (
                          // 2-3-2 Wide-body layout
                          <>
                            {/* Left Bank: A, B */}
                            <div className="flex gap-1">
                              {['A', 'B'].map((letter) => {
                                const seat = seats[`${rowNum}${letter}`];
                                return seat ? (
                                  <Seat key={seat.seatId} seat={seat} configId="2-3-2" />
                                ) : null;
                              })}
                            </div>

                            {/* Aisle 1 */}
                            <div className="w-3 flex items-center justify-center">
                              <div className="w-0.5 h-6 bg-surface-variant rounded-full" />
                            </div>

                            {/* Center Bank: C, D, E */}
                            <div className="flex gap-1">
                              {['C', 'D', 'E'].map((letter) => {
                                const seat = seats[`${rowNum}${letter}`];
                                return seat ? (
                                  <Seat key={seat.seatId} seat={seat} configId="2-3-2" />
                                ) : null;
                              })}
                            </div>

                            {/* Aisle 2 */}
                            <div className="w-3 flex items-center justify-center">
                              <div className="w-0.5 h-6 bg-surface-variant rounded-full" />
                            </div>

                            {/* Right Bank: F, G */}
                            <div className="flex gap-1">
                              {['F', 'G'].map((letter) => {
                                const seat = seats[`${rowNum}${letter}`];
                                return seat ? (
                                  <Seat key={seat.seatId} seat={seat} configId="2-3-2" />
                                ) : null;
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Rear Galley & Lavatories */}
              <div className="mt-space-md pt-space-xs flex items-center justify-between px-space-md py-space-xs bg-surface-container-low rounded-xl text-on-surface-variant font-label-sm text-label-sm text-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-body-sm">wc</span>
                  <span>Lavatory R1</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-body-sm">wc</span>
                  <span>Lavatory R2</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-body-sm">kitchen</span>
                  <span>Galley 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 'Your Trip' Summary Card (Col-span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-space-md order-3">
            <TripSummaryCard />
          </div>
        </div>
      </div>
    </div>
  );
}

