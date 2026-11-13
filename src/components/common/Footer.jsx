import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(8,21,52,0.02)] py-space-md border-t border-surface-variant/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-gutter flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
        <div className="flex items-center gap-space-sm text-on-surface-variant text-xs font-medium">
          <span>AeroLuxe Executive Aviation</span>
        </div>
        <div className="flex items-center gap-space-md font-label-md text-label-md text-on-surface-variant text-xs">
          <span className="hover:text-on-surface transition-colors cursor-pointer">
            Concierge & Support
          </span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">
            Baggage Policy
          </span>
          <span className="hover:text-on-surface transition-colors cursor-pointer">
            Legal Privacy
          </span>
        </div>
      </div>
    </footer>
  );
}

