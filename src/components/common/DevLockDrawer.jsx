import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function DevLockDrawer({ isOpen, onClose }) {
  const { sessionId, seatLocks, simulateLock, clearLocks, resetBooking, seats } = useBooking();
  const [customSeatInput, setCustomSeatInput] = useState('');

  if (!isOpen) return null;

  const activeLockEntries = Object.entries(seatLocks || {});

  const handleSimulateCustom = (e) => {
    e.preventDefault();
    const clean = customSeatInput.trim().toUpperCase();
    if (clean && seats[clean]) {
      simulateLock(clean);
      setCustomSeatInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-on-background/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl p-space-lg flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-space-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-headline-sm">
                lock_clock
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Seat Lock Simulator
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Session Info */}
          <div className="bg-surface-container-low p-space-sm rounded-xl text-xs flex flex-col gap-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span>Current Session ID:</span>
              <span className="font-mono font-bold text-on-surface">{sessionId}</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span>Active Locks Count:</span>
              <span className="font-bold text-secondary">{activeLockEntries.length} Seats</span>
            </div>
          </div>

          {/* Architectural Notice */}
          <div className="p-space-sm rounded-xl bg-secondary-fixed/30 border border-secondary/30 text-xs text-on-secondary-fixed leading-relaxed">
            <div className="font-bold flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>Assessment Architecture Notice</span>
            </div>
            Simulated via <code className="bg-white/60 px-1 py-0.5 rounded font-mono">localStorage</code> for single-browser multi-tab evaluation. In production, this locking layer is replaced with distributed Redis atomic leases and WebSocket session channels.
          </div>

          {/* Simulate Action Form */}
          <form onSubmit={handleSimulateCustom} className="flex flex-col gap-2 pt-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-bold">
              Simulate Concurrent User Holding a Seat:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 2B, 3B, 5D, 8B"
                value={customSeatInput}
                onChange={(e) => setCustomSeatInput(e.target.value.toUpperCase())}
                className="flex-1 bg-surface-container-low px-space-md py-2 rounded-lg text-xs font-mono font-bold outline-none border border-transparent focus:border-secondary-container"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-primary-container text-on-primary text-xs font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm"
              >
                Lock Seat
              </button>
            </div>
          </form>

          {/* Quick Preset Locks */}
          <div className="flex flex-col gap-1.5 pt-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Quick Test Simulation Presets:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['2B', '3B', '5A', '7B', '8B', '10A'].map((sId) => {
                const isLocked = !!seatLocks[sId];
                return (
                  <button
                    key={sId}
                    type="button"
                    onClick={() => simulateLock(sId)}
                    disabled={isLocked}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                      isLocked
                        ? 'bg-surface-variant text-outline-variant cursor-not-allowed border-transparent'
                        : 'bg-surface-container-lowest hover:bg-secondary-fixed/40 text-on-surface border-surface-variant'
                    }`}
                  >
                    {isLocked ? `Seat ${sId} (Locked)` : `Lock Seat ${sId}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Locks Table */}
          <div className="flex flex-col gap-2 pt-space-xs">
            <span className="font-label-md text-label-md text-on-surface font-bold">
              Currently Active Held Seats:
            </span>
            {activeLockEntries.length === 0 ? (
              <div className="p-space-md rounded-xl bg-surface-container-low text-center text-xs text-on-surface-variant">
                No active seat locks currently registered in localStorage.
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {activeLockEntries.map(([seatId, lock]) => {
                  const isMine = lock.sessionId === sessionId;
                  const remainingSec = Math.max(0, Math.floor((lock.expiresAt - Date.now()) / 1000));
                  const mins = Math.floor(remainingSec / 60);
                  const secs = remainingSec % 60;

                  return (
                    <div
                      key={seatId}
                      className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded bg-primary-container text-secondary-container font-bold flex items-center justify-center font-mono">
                          {seatId}
                        </span>
                        <div>
                          <div className="font-bold text-on-surface">
                            {isMine ? 'Held by You' : 'Held by Other Session'}
                          </div>
                          <div className="text-[10px] text-on-surface-variant font-mono truncate max-w-[140px]">
                            {lock.sessionId}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-secondary font-bold">
                        {mins}:{secs.toString().padStart(2, '0')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Reset Actions */}
        <div className="flex flex-col gap-2 pt-space-md border-t border-surface-variant">
          <button
            type="button"
            onClick={clearLocks}
            className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">lock_open</span>
            <span>Clear All Simulated Locks</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset entire booking back to initial defaults?')) {
                resetBooking();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-xl bg-error-container/20 text-error hover:bg-error-container/40 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span>Reset Complete Booking State</span>
          </button>
        </div>
      </div>
    </div>
  );
}

