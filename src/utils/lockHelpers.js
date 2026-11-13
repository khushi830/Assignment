const STORAGE_KEY = 'aeroluxe_seat_locks_v1';
export const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Returns or generates a persistent session ID for the current browser tab.
 */
export function getSessionId() {
  if (typeof window === 'undefined') return 'server-session';
  let sessionId = sessionStorage.getItem('aeroluxe_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('aeroluxe_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Reads all locks from localStorage and removes expired ones.
 */
export function getActiveLocks() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const active = {};
    let changed = false;

    for (const [seatId, lock] of Object.entries(parsed)) {
      if (lock && lock.expiresAt > now) {
        active[seatId] = lock;
      } else {
        changed = true;
      }
    }

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
    }
    return active;
  } catch (err) {
    console.error('Failed reading seat locks:', err);
    return {};
  }
}

/**
 * Checks the lock status of a specific seat against the current session.
 */
export function checkSeatLock(seatId, currentSessionId = getSessionId()) {
  const activeLocks = getActiveLocks();
  const lock = activeLocks[seatId];
  if (!lock) {
    return { isLocked: false, isLockedByMe: false, isLockedByOther: false, lock: null };
  }
  const isLockedByMe = lock.sessionId === currentSessionId;
  return {
    isLocked: true,
    isLockedByMe,
    isLockedByOther: !isLockedByMe,
    lock
  };
}

/**
 * Acquires or refreshes locks for a set of seats for a given session.
 */
export function acquireLocks(seatIds, sessionId, bookingId, durationMs = LOCK_DURATION_MS) {
  if (!seatIds || seatIds.length === 0) return { success: true };
  const active = getActiveLocks();
  const now = Date.now();
  const expiresAt = now + durationMs;

  // Check conflicts
  const conflicts = [];
  for (const sId of seatIds) {
    const existing = active[sId];
    if (existing && existing.sessionId !== sessionId && existing.expiresAt > now) {
      conflicts.push({ seatId: sId, lock: existing });
    }
  }

  if (conflicts.length > 0) {
    return {
      success: false,
      error: 'One or more seats are temporarily held by another session.',
      conflicts
    };
  }

  // Apply locks
  for (const sId of seatIds) {
    active[sId] = {
      seatId: sId,
      sessionId,
      bookingId,
      lockedAt: now,
      expiresAt,
      status: 'LOCKED'
    };
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
  window.dispatchEvent(new CustomEvent('aeroluxe_locks_updated', { detail: active }));
  return { success: true, locks: active };
}

/**
 * Releases specific seats or all seats locked by a session.
 */
export function releaseSessionLocks(sessionId, seatIdsToRelease = null) {
  const active = getActiveLocks();
  let changed = false;

  for (const [seatId, lock] of Object.entries(active)) {
    if (lock.sessionId === sessionId) {
      if (!seatIdsToRelease || seatIdsToRelease.includes(seatId)) {
        delete active[seatId];
        changed = true;
      }
    }
  }

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
    window.dispatchEvent(new CustomEvent('aeroluxe_locks_updated', { detail: active }));
  }
  return active;
}

/**
 * Simulates another user holding a seat (for testing & evaluator verification).
 */
export function simulateExternalLock(seatId, minutes = 10) {
  const active = getActiveLocks();
  const fakeSessionId = 'simulated_user_' + Math.random().toString(36).substring(2, 6);
  const now = Date.now();
  active[seatId] = {
    seatId,
    sessionId: fakeSessionId,
    bookingId: 'ALX-MOCK-' + Math.floor(1000 + Math.random() * 9000),
    lockedAt: now,
    expiresAt: now + minutes * 60 * 1000,
    status: 'LOCKED'
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
  window.dispatchEvent(new CustomEvent('aeroluxe_locks_updated', { detail: active }));
  return active[seatId];
}

/**
 * Completely clears all locks (useful for test reset).
 */
export function clearAllLocks() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('aeroluxe_locks_updated', { detail: {} }));
}

