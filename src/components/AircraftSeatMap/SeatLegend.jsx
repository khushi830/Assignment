import React from 'react';

export default function SeatLegend() {
  return (
    <div className="flex flex-col gap-space-md">
      {/* Legend Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-variant/40">
        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant block mb-space-sm font-bold text-xs">
          Seat Legend & Pricing
        </span>

        <div className="flex flex-col gap-space-sm font-body-sm text-body-sm text-xs">
          {/* Extra Legroom */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded-t-md bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-xs border border-secondary font-bold">
                <span className="material-symbols-outlined text-[13px]">add</span>
              </div>
              <span className="text-on-surface font-semibold">Extra Legroom</span>
            </div>
            <span className="font-label-sm text-label-sm font-extrabold text-secondary">₹350</span>
          </div>

          {/* Preferred / Window */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded-t-md bg-primary-container text-secondary-container flex items-center justify-center font-bold text-xs">
                W
              </div>
              <span className="text-on-surface font-medium">Preferred / Window</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">₹150</span>
          </div>

          {/* Standard Aisle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded-t-md bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs border border-surface-variant">
                A
              </div>
              <span className="text-on-surface font-medium">Standard Aisle</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">₹100</span>
          </div>

          {/* Standard Middle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded-t-md bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-xs border border-surface-variant">
                M
              </div>
              <span className="text-on-surface font-medium">Standard Middle</span>
            </div>
            <span className="font-label-sm text-label-sm font-extrabold text-on-tertiary-container">Free (₹0)</span>
          </div>

          {/* Occupied */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded-t-md bg-surface-variant opacity-60 flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-xs">close</span>
              </div>
              <span className="text-on-surface-variant">Occupied / Unavailable</span>
            </div>
            <span className="font-label-sm text-label-sm text-outline">—</span>
          </div>

          {/* Temporarily Locked */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded-t-md bg-secondary-fixed/40 border border-secondary text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-xs">lock</span>
              </div>
              <span className="text-on-surface-variant">Temporarily Reserved (Lock)</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold">Held</span>
          </div>

          <div className="h-px bg-surface-variant my-space-xs" />

          {/* Emergency & Lavatory */}
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-error">
              <span className="material-symbols-outlined text-sm">emergency</span>
              <span>Exit Row Doors</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined text-sm">wc</span>
              <span>Lavatory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cabin Amenities Micro Badge */}
      <div className="bg-surface-container-low rounded-2xl p-space-sm flex items-center justify-around text-on-surface-variant text-center border border-surface-variant/40">
        <div className="flex flex-col items-center">
          <span className="material-symbols-outlined text-body-lg text-secondary">power</span>
          <span className="font-label-sm text-label-sm mt-0.5 text-[10px] font-bold">AC Power</span>
        </div>
        <div className="h-6 w-px bg-surface-variant" />
        <div className="flex flex-col items-center">
          <span className="material-symbols-outlined text-body-lg text-secondary">wifi</span>
          <span className="font-label-sm text-label-sm mt-0.5 text-[10px] font-bold">High-speed Wi-Fi</span>
        </div>
        <div className="h-6 w-px bg-surface-variant" />
        <div className="flex flex-col items-center">
          <span className="material-symbols-outlined text-body-lg text-secondary">lunch_dining</span>
          <span className="font-label-sm text-label-sm mt-0.5 text-[10px] font-bold">Fresh Bites</span>
        </div>
      </div>
    </div>
  );
}

