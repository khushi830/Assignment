import React from 'react';
import flightLoaderGif from '../../assets/flight-loader.gif';

/**
 * Full-Screen Flight Loader Overlay.
 * Occupies 100vw x 100vh with a subtle dark semi-transparent backdrop,
 * perfectly centered horizontally and vertically, retaining the exact GIF,
 * animation, branding, and preventing underlying interactions.
 *
 * @param {string} [message='Preparing your flight...'] - Primary status title
 * @param {string} [subMessage='Connecting to AeroLuxe telemetry...'] - Subtitle detail
 * @param {boolean} [fullscreen=true] - Defaults to true for full-screen overlay mode
 * @param {string} [className=''] - Extra layout styles
 */
export default function FlightLoader({
  message = 'Preparing your flight...',
  subMessage = 'Connecting to AeroLuxe telemetry...',
  fullscreen = true,
  className = ''
}) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none max-w-md w-full mx-auto">
      {/* Flight Loader GIF - Exact 150x150 dimensions, original animation & pristine quality */}
      <div className="relative w-[150px] h-[150px] flex items-center justify-center mb-5">
        {/* Subtle radial ambient highlight behind the aircraft */}
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/20 to-primary-fixed/15 rounded-full blur-2xl pointer-events-none" />

        <img
          src={flightLoaderGif}
          alt="Preparing your flight..."
          className="w-[150px] h-[150px] object-contain block relative z-10 select-none"
          loading="eager"
        />
      </div>

      {/* Primary Loading Message */}
      <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug">
        {message}
      </h3>

      {/* Subtitle / Telemetry Detail */}
      {subMessage && (
        <p className="text-xs sm:text-sm font-normal text-slate-300/85 mt-2 max-w-xs leading-relaxed">
          {subMessage}
        </p>
      )}

      {/* Elegant AeroLuxe Golden Amber Progress Track */}
      <div className="w-36 h-1 bg-white/15 rounded-full mt-5 overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 bg-[#FDAF23] rounded-full w-full animate-pulse shadow-[0_0_8px_rgba(253,175,35,0.6)]" />
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-center justify-center bg-[#081534]/85 backdrop-blur-md px-4 select-none pointer-events-auto transition-opacity duration-300 animate-fadeIn ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className={`w-full flex items-center justify-center py-8 ${className}`}>
      {content}
    </div>
  );
}
