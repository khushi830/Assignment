import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { AIRCRAFT_CONFIGS } from '../../data/aircraftLayouts';

export default function AircraftSelection() {
  const {
    setStep,
    aircraftConfig,
    setAircraftConfig,
    flightDetails
  } = useBooking();

  const handleSelect = (configId) => {
    setAircraftConfig(configId);
  };

  const isConfig1 = aircraftConfig === '3-2';
  const isConfig2 = aircraftConfig === '2-3-2';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-gutter py-space-xl flex flex-col gap-space-xl min-h-[calc(100vh-4rem)]">
      {/* Top Progress Context & Flight Details */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs uppercase tracking-wider font-semibold">
              Step 2 of 5
            </span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] text-secondary">flight</span>
              Flight {flightDetails.flightNumber}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-on-surface-variant font-semibold">
              {flightDetails.from} → {flightDetails.to}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Select Aircraft Seating Configuration
          </h1>
          <p className="text-sm sm:text-base font-normal text-on-surface-variant">
            Choose the cabin layout for your flight {flightDetails.flightNumber}.
          </p>
        </div>

        {/* Key Aircraft Specs Capsule */}
        <div className="hidden lg:flex items-center gap-space-md bg-surface-container-lowest px-space-md py-2.5 rounded-xl shadow-sm border border-surface-variant/40">
          <div className="flex items-center gap-space-xs text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-secondary">airlines</span>
            <span className="font-semibold">AeroLuxe Fleet Studio</span>
          </div>
          <div className="h-4 w-px bg-surface-variant" />
          <div className="flex items-center gap-space-xs text-xs text-on-surface">
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
            <span className="font-medium">Both configurations ready</span>
          </div>
        </div>
      </div>

      {/* Minimal Inspiration Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm h-44 sm:h-48 bg-primary-container flex items-center px-space-lg md:px-space-xl">
        <div className="max-w-md flex flex-col gap-1 text-on-primary relative z-10">
          <span className="text-[11px] text-secondary-container uppercase tracking-wider font-semibold">
            Bespoke Aviation Experience
          </span>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-on-primary">
            Precision-Engineered Cabin Space
          </h2>
          <p className="text-xs sm:text-sm font-normal text-on-primary-container leading-relaxed">
            Tailored ergonomic geometry crafted for effortless transcontinental comfort.
          </p>
        </div>
        {/* Subtle geometric wing decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none flex items-center justify-end pr-8">
          <span className="material-symbols-outlined text-[180px] text-on-primary rotate-45">
            flight
          </span>
        </div>
      </div>

      {/* Configuration Selection Grid (Exactly Two Cards Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg w-full items-stretch">
        {/* Card 1: 3-2 Narrow-Body */}
        <div
          onClick={() => handleSelect('3-2')}
          className={`group relative cursor-pointer flex flex-col justify-between p-space-lg md:p-space-xl rounded-2xl bg-surface-container-lowest transition-all duration-300 border ${
            isConfig1
              ? 'shadow-[0_0_0_2px_#fdaf23,0_12px_28px_-6px_rgba(14,26,57,0.12)] border-transparent'
              : 'shadow-sm hover:shadow-md border-surface-variant/50'
          }`}
        >
          <div className="relative z-10 flex flex-col gap-space-lg">
            {/* Header & Radio Check */}
            <div className="flex items-start justify-between gap-space-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-[11px] uppercase tracking-wider font-semibold">
                    Single Aisle
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary text-[11px] font-medium">
                    Streamlined
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-on-surface mt-space-xs tracking-tight">
                  3–2 Narrow-Body Configuration
                </h2>
                <p className="text-xs sm:text-sm font-normal text-on-surface-variant leading-relaxed">
                  Rapid boarding cadence with intimate portside seating pair.
                </p>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform group-hover:scale-105 shadow-sm ${
                  isConfig1
                    ? 'bg-primary-container text-secondary-container'
                    : 'bg-surface-container-high text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
            </div>

            {/* Visual Schematic 3-2 */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-md flex flex-col items-center justify-center gap-space-md">
              <div className="flex items-center justify-between w-full max-w-sm px-2 font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase font-bold text-[10px]">
                <span>Port (Left)</span>
                <span>Aisle</span>
                <span>Starboard (Right)</span>
              </div>

              {/* Schematic Rows */}
              <div className="w-full max-w-md flex flex-col gap-space-sm">
                {/* Column Letters */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2 w-32 justify-center">
                    <span className="w-9 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      A
                    </span>
                    <span className="w-9 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      B
                    </span>
                    <span className="w-9 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      C
                    </span>
                  </div>
                  <div className="w-10 text-center font-label-sm text-label-sm text-outline-variant font-bold">
                    AISLE
                  </div>
                  <div className="flex items-center gap-2 w-24 justify-center">
                    <span className="w-9 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      D
                    </span>
                    <span className="w-9 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      E
                    </span>
                  </div>
                </div>

                {/* Row 1 Preview */}
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center shadow-sm font-bold">
                      1A
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1B
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1C
                    </div>
                  </div>
                  <div className="w-10 flex items-center justify-center">
                    <div className="w-1.5 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1D
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1E
                    </div>
                  </div>
                </div>

                {/* Row 2 Preview */}
                <div className="flex items-center justify-center gap-2 opacity-90">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2A
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2B
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2C
                    </div>
                  </div>
                  <div className="w-10 flex items-center justify-center">
                    <div className="w-1.5 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2D
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2E
                    </div>
                  </div>
                </div>

                {/* Row 3 Preview (Fade) */}
                <div className="flex items-center justify-center gap-2 opacity-50">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3A
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3B
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3C
                    </div>
                  </div>
                  <div className="w-10 flex items-center justify-center">
                    <div className="w-1.5 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3D
                    </div>
                    <div className="w-9 h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3E
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Details Pill Array */}
          <div className="relative z-10 mt-space-md pt-space-md flex items-center justify-between text-xs font-medium text-on-surface-variant border-t border-surface-variant/40">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
              <span>Standard Pitch: 32"</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">chair</span>
              <span>Width: 18.2"</span>
            </div>
            <span className="font-semibold text-on-surface">No Surcharge</span>
          </div>
        </div>

        {/* Card 2: 2-3-2 Wide-Body */}
        <div
          onClick={() => handleSelect('2-3-2')}
          className={`group relative cursor-pointer flex flex-col justify-between p-space-lg md:p-space-xl rounded-2xl bg-surface-container-lowest transition-all duration-300 border ${
            isConfig2
              ? 'shadow-[0_0_0_2px_#fdaf23,0_12px_28px_-6px_rgba(14,26,57,0.12)] border-transparent'
              : 'shadow-sm hover:shadow-md border-surface-variant/50'
          }`}
        >
          <div className="relative z-10 flex flex-col gap-space-lg">
            {/* Header & Radio Check */}
            <div className="flex items-start justify-between gap-space-md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                    Twin Aisle
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-medium">
                    Executive Expansive
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-on-surface mt-space-xs tracking-tight">
                  2–3–2 Wide-Body Configuration
                </h2>
                <p className="text-xs sm:text-sm font-normal text-on-surface-variant leading-relaxed">
                  Dual central pathways allowing unobstructed aisle access for 86% of travelers.
                </p>
              </div>

              {/* Radio Indicator */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform group-hover:scale-105 shadow-sm ${
                  isConfig2
                    ? 'bg-primary-container text-secondary-container'
                    : 'bg-surface-container-high text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
            </div>

            {/* Visual Schematic 2-3-2 */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-md flex flex-col items-center justify-center gap-space-md">
              <div className="flex items-center justify-between w-full max-w-md px-2 font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase font-bold text-[10px]">
                <span>Port</span>
                <span>Aisle 1</span>
                <span>Center</span>
                <span>Aisle 2</span>
                <span>Starboard</span>
              </div>

              {/* Schematic Rows */}
              <div className="w-full max-w-lg flex flex-col gap-space-sm">
                {/* Column Letters */}
                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      A
                    </span>
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      B
                    </span>
                  </div>
                  <div className="w-5 sm:w-6 text-center font-label-sm text-label-sm text-outline-variant font-bold">
                    |
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      C
                    </span>
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      D
                    </span>
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      E
                    </span>
                  </div>
                  <div className="w-5 sm:w-6 text-center font-label-sm text-label-sm text-outline-variant font-bold">
                    |
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      F
                    </span>
                    <span className="w-7 sm:w-8 text-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                      G
                    </span>
                  </div>
                </div>

                {/* Row 1 Preview */}
                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1A
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1B
                    </div>
                  </div>
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-1 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1C
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1D
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1E
                    </div>
                  </div>
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-1 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1F
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      1G
                    </div>
                  </div>
                </div>

                {/* Row 2 Preview */}
                <div className="flex items-center justify-center gap-1.5 md:gap-2 opacity-90">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2A
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2B
                    </div>
                  </div>
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-1 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2C
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2D
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2E
                    </div>
                  </div>
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-1 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2F
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      2G
                    </div>
                  </div>
                </div>

                {/* Row 3 Preview (Fade) */}
                <div className="flex items-center justify-center gap-1.5 md:gap-2 opacity-50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3A
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3B
                    </div>
                  </div>
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-1 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3C
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3D
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3E
                    </div>
                  </div>
                  <div className="w-5 sm:w-6 flex items-center justify-center">
                    <div className="w-1 h-6 bg-surface-variant rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3F
                    </div>
                    <div className="w-7 sm:w-8 h-10 sm:h-11 rounded-t-lg rounded-b bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center">
                      3G
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Details Pill Array */}
          <div className="relative z-10 mt-space-md pt-space-md flex items-center justify-between text-xs font-medium text-on-surface-variant border-t border-surface-variant/40">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
              <span>Standard Pitch: 34"</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">chair</span>
              <span>Width: 19.5"</span>
            </div>
            <span className="font-semibold text-secondary tabular-nums">+₹500 / guest</span>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Action Bar */}
      <div className="w-full mt-space-md pt-space-lg flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md border-t border-surface-variant/40">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full sm:w-auto px-space-lg py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-semibold flex items-center justify-center gap-space-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back to Flight Search</span>
        </button>

        {/* Active Selection Summary & Continue CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-space-md w-full sm:w-auto">
          <div className="text-right hidden md:block">
            <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-medium">
              Active Choice
            </div>
            <div className="text-sm font-semibold text-on-surface">
              {AIRCRAFT_CONFIGS[aircraftConfig]?.name}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full sm:w-auto px-space-xl py-3 rounded-xl bg-primary-container text-on-primary hover:bg-secondary-container hover:text-on-secondary-container text-sm font-semibold tracking-wide shadow-md flex items-center justify-center gap-space-xs transition-all duration-200"
          >
            <span>Continue to Passenger Selection</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

