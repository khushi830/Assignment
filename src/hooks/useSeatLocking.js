import { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { checkSeatLock } from '../utils/lockHelpers';

export function useSeatLocking(seatId) {
  const { sessionId, seatLocks, simulateLock, clearLocks } = useBooking();
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const lockInfo = useMemo(() => {
    if (!seatId) return { isLocked: false, isLockedByMe: false, isLockedByOther: false, lock: null };
    return checkSeatLock(seatId, sessionId);
  }, [seatId, sessionId, seatLocks]);

  useEffect(() => {
    if (!lockInfo.lock || !lockInfo.lock.expiresAt) {
      setRemainingSeconds(null);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((lockInfo.lock.expiresAt - Date.now()) / 1000));
      setRemainingSeconds(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockInfo.lock]);

  const formattedRemainingTime = useMemo(() => {
    if (remainingSeconds === null) return null;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [remainingSeconds]);

  return {
    isLocked: lockInfo.isLocked,
    isLockedByMe: lockInfo.isLockedByMe,
    isLockedByOther: lockInfo.isLockedByOther,
    lock: lockInfo.lock,
    remainingSeconds,
    formattedRemainingTime,
    simulateLock,
    clearLocks
  };
}

export default useSeatLocking;

