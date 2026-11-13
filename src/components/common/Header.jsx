import React from 'react';
import { useBooking } from '../../context/BookingContext';

export default function Header({ onOpenDevDrawer }) {
  const { currentStep, setStep } = useBooking();

  const navSteps = [
    { step: 1, label: '1. Flights' },
    { step: 2, label: '2. Aircraft' },
    { step: 3, label: '3. Passengers' },
    { step: 4, label: '4. Seats' },
    { step: 5, label: '5. Summary' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(8,21,52,0.04)] border-b border-surface-variant/40">
      <div className="h-16 w-full px-4 sm:px-gutter flex items-center justify-between gap-space-md max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-space-sm cursor-pointer select-none"
          onClick={() => setStep(1)}
        >
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-secondary-container text-body-lg">
              flight_takeoff
            </span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-on-surface">
            AeroLuxe
          </span>
        </div>

        {/* Navigation Stepper Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-space-lg">
          {navSteps.map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setStep(item.step)}
                className={`transition-all py-space-xs relative text-xs lg:text-sm font-medium tracking-normal ${
                  isActive
                    ? "text-on-surface font-semibold after:content-[''] after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2.5px] after:bg-secondary-container"
                    : isCompleted
                    ? 'text-on-surface/80 hover:text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side Currency, Lock Simulator & Profile */}
        <div className="flex items-center gap-space-md">
          {/* Dev Simulator Trigger */}
          <button
            type="button"
            onClick={onOpenDevDrawer}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 hover:bg-secondary-container/30 text-on-secondary-container text-xs font-medium transition-colors"
            title="Open Seat Locking Simulator for Evaluation Testing"
          >
            <span className="material-symbols-outlined text-sm">lock_clock</span>
            <span>Lock Simulator</span>
          </button>

          {/* Currency Pill */}
          <div className="flex items-center gap-1 text-on-surface-variant text-xs">
            <span className="uppercase tracking-wider text-secondary font-semibold">
              INR
            </span>
            <span className="font-semibold">₹</span>
          </div>

          {/* Profile Pill */}
          <div className="flex items-center gap-space-sm pl-space-xs sm:pl-space-sm">
            <span className="hidden lg:inline text-xs font-medium text-on-surface">
              Alexandros V.
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-container text-secondary-container flex items-center justify-center font-semibold text-xs ring-1 ring-secondary-container/40">
              AV
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

