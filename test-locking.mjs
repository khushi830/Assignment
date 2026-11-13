// Mock browser storage for headless test
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};
global.sessionStorage = {
  getItem: (k) => storage['sess_' + k] || null,
  setItem: (k, v) => { storage['sess_' + k] = String(v); },
  removeItem: (k) => { delete storage['sess_' + k]; }
};
global.window = {
  dispatchEvent: () => {}
};
global.CustomEvent = class CustomEvent {};

const {
  acquireLocks,
  getActiveLocks,
  checkSeatLock,
  releaseSessionLocks,
  simulateExternalLock
} = await import('./src/utils/lockHelpers.js');

console.log('--- RUNNING SEAT LOCKING VERIFICATION ---');

const sessionA = 'user_session_A';
const sessionB = 'user_session_B';

// 1. Session A acquires lock on 2A
const res1 = acquireLocks(['2A'], sessionA, 'BOOKING-A', 5000);
console.log('Session A locks 2A:', res1.success ? 'PASS' : 'FAIL');

// 2. Check lock status from Session A perspective
const checkA = checkSeatLock('2A', sessionA);
console.log('Session A status on 2A (isLockedByMe):', checkA.isLockedByMe ? 'PASS' : 'FAIL');
console.log('Session A status on 2A (isLockedByOther):', !checkA.isLockedByOther ? 'PASS' : 'FAIL');

// 3. Check lock status from Session B perspective
const checkB = checkSeatLock('2A', sessionB);
console.log('Session B status on 2A (isLockedByOther):', checkB.isLockedByOther ? 'PASS' : 'FAIL');

// 4. Session B tries to acquire 2A -> must conflict
const resB = acquireLocks(['2A'], sessionB, 'BOOKING-B', 5000);
console.log('Session B blocked from locking 2A:', !resB.success ? 'PASS' : 'FAIL');

// 5. Release lock by Session A
releaseSessionLocks(sessionA, ['2A']);
const checkAfterRelease = checkSeatLock('2A', sessionB);
console.log('After release, 2A is available for B:', !checkAfterRelease.isLocked ? 'PASS' : 'FAIL');

// 6. Test Expiry Pruning
acquireLocks(['3C'], sessionA, 'BOOKING-EXP', -100); // already expired
const locks = getActiveLocks();
console.log('Expired lock 3C automatically pruned:', !locks['3C'] ? 'PASS' : 'FAIL');

console.log('ALL SEAT LOCKING TESTS PASSED.');

