import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_FLIGHT } from '../data/airports';
import { AIRCRAFT_CONFIGS } from '../data/aircraftLayouts';
import { INITIAL_PASSENGERS } from '../data/initialPassengers';
import { generateSeatsForConfig } from '../data/initialSeats';
import { MEAL_OPTIONS } from '../data/meals';
import { calculatePricing } from '../utils/pricing';
import {
  getSessionId,
  getActiveLocks,
  acquireLocks,
  releaseSessionLocks,
  simulateExternalLock,
  clearAllLocks
} from '../utils/lockHelpers';

const BookingContext = createContext(null);

const STORAGE_BOOKING_KEY = 'aeroluxe_booking_draft_v1';

function getInitialState() {
  const sessionId = getSessionId();
  const defaultConfig = '3-2';
  const initialSeats = generateSeatsForConfig(defaultConfig);

  // Default initial assignments matching Stitch design
  const defaultAssignments = {
    'pax-1': '4A',
    'pax-2': '4B',
    'pax-3': '4C'
  };

  const defaultMeals = {
    'pax-1': 'meal-veg',
    'pax-2': 'meal-jain',
    'pax-3': 'meal-kids'
  };

  // Try restoring saved draft if present
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKING_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const restoredConfig = parsed.aircraftConfig || defaultConfig;
        const restoredSeats = generateSeatsForConfig(restoredConfig);
        return {
          ...parsed,
          sessionId,
          seats: restoredSeats,
          seatLocks: getActiveLocks(),
          toasts: []
        };
      }
    } catch (e) {
      console.warn('Could not restore saved booking state, using defaults:', e);
    }
  }

  return {
    bookingId: DEFAULT_FLIGHT.bookingRef,
    sessionId,
    currentStep: 1, // 1: Flights, 2: Aircraft, 3: Passengers, 4: Seats, 5: Summary
    tripType: 'oneway',
    flightDetails: { ...DEFAULT_FLIGHT },
    aircraftConfig: defaultConfig,
    passengers: INITIAL_PASSENGERS.map((p) => ({ ...p })),
    activePassengerId: 'pax-1',
    seats: initialSeats,
    seatAssignments: defaultAssignments,
    selectedMeals: defaultMeals,
    seatLocks: getActiveLocks(),
    toasts: []
  };
}

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP': {
      return { ...state, currentStep: action.payload };
    }

    case 'SET_TRIP_TYPE': {
      return { ...state, tripType: action.payload };
    }

    case 'UPDATE_FLIGHT_DETAILS': {
      return {
        ...state,
        flightDetails: {
          ...state.flightDetails,
          ...action.payload
        }
      };
    }

    case 'SET_AIRCRAFT_CONFIG': {
      const newConfigId = action.payload;
      if (newConfigId === state.aircraftConfig) return state;

      const newSeats = generateSeatsForConfig(newConfigId);
      // Validate existing assignments: keep if valid in new layout, otherwise clear
      const updatedAssignments = {};
      for (const [paxId, seatId] of Object.entries(state.seatAssignments)) {
        if (newSeats[seatId] && !newSeats[seatId].isOccupied) {
          updatedAssignments[paxId] = seatId;
        }
      }

      const updatedPassengers = state.passengers.map((p) => ({
        ...p,
        assignedSeat: updatedAssignments[p.id] || null
      }));

      return {
        ...state,
        aircraftConfig: newConfigId,
        seats: newSeats,
        seatAssignments: updatedAssignments,
        passengers: updatedPassengers
      };
    }

    case 'SET_ACTIVE_PASSENGER': {
      return { ...state, activePassengerId: action.payload };
    }

    case 'ADD_PASSENGER': {
      const newId = 'pax-' + Date.now().toString(36);
      const paxNumber = state.passengers.length + 1;
      const newPax = {
        id: newId,
        name: action.payload.name || `Passenger ${paxNumber}`,
        type: action.payload.type || 'Adult',
        category: action.payload.category || action.payload.type || 'Adult',
        tag: action.payload.tag || '',
        initials: (action.payload.name || `P${paxNumber}`).slice(0, 2).toUpperCase(),
        isLead: false,
        assignedSeat: null,
        mealId: action.payload.mealId || 'meal-none'
      };

      const nextPax = [...state.passengers, newPax];
      return {
        ...state,
        passengers: nextPax,
        activePassengerId: newId,
        selectedMeals: {
          ...state.selectedMeals,
          [newId]: newPax.mealId
        }
      };
    }

    case 'UPDATE_PASSENGER': {
      const { id, updates } = action.payload;
      const updatedPassengers = state.passengers.map((p) => {
        if (p.id === id) {
          const updatedName = updates.name !== undefined ? updates.name : p.name;
          const initials = updatedName
            .trim()
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'PX';
          return {
            ...p,
            ...updates,
            initials
          };
        }
        return p;
      });

      const updatedMeals = { ...state.selectedMeals };
      if (updates.mealId) {
        updatedMeals[id] = updates.mealId;
      }

      return {
        ...state,
        passengers: updatedPassengers,
        selectedMeals: updatedMeals
      };
    }

    case 'REMOVE_PASSENGER': {
      const targetId = action.payload;
      if (state.passengers.length <= 1) {
        return state; // Prevent removing all passengers
      }

      const assignedSeat = state.seatAssignments[targetId];
      const nextAssignments = { ...state.seatAssignments };
      delete nextAssignments[targetId];

      const nextMeals = { ...state.selectedMeals };
      delete nextMeals[targetId];

      const nextPassengers = state.passengers.filter((p) => p.id !== targetId);

      // Determine next active passenger if the removed one was active
      let nextActiveId = state.activePassengerId;
      if (state.activePassengerId === targetId) {
        nextActiveId = nextPassengers[0]?.id || null;
      }

      // If removed passenger held a locked seat, release it
      if (assignedSeat) {
        releaseSessionLocks(state.sessionId, [assignedSeat]);
      }

      return {
        ...state,
        passengers: nextPassengers,
        activePassengerId: nextActiveId,
        seatAssignments: nextAssignments,
        selectedMeals: nextMeals,
        seatLocks: getActiveLocks()
      };
    }

    case 'ASSIGN_SEAT': {
      const { passengerId, seatId } = action.payload;
      if (!passengerId || !seatId) return state;

      const previousSeat = state.seatAssignments[passengerId];

      // Remove from any other passenger if accidentally targeted
      const nextAssignments = { ...state.seatAssignments };
      for (const [pId, sId] of Object.entries(nextAssignments)) {
        if (sId === seatId && pId !== passengerId) {
          nextAssignments[pId] = null;
        }
      }

      nextAssignments[passengerId] = seatId;

      // Update passengers array
      const nextPassengers = state.passengers.map((p) => {
        if (p.id === passengerId) {
          return { ...p, assignedSeat: seatId };
        }
        if (p.assignedSeat === seatId && p.id !== passengerId) {
          return { ...p, assignedSeat: null };
        }
        return p;
      });

      // Release previous lock if held
      if (previousSeat && previousSeat !== seatId) {
        releaseSessionLocks(state.sessionId, [previousSeat]);
      }

      return {
        ...state,
        seatAssignments: nextAssignments,
        passengers: nextPassengers
      };
    }

    case 'UNASSIGN_SEAT': {
      const passengerId = action.payload;
      const previousSeat = state.seatAssignments[passengerId];
      if (!previousSeat) return state;

      const nextAssignments = { ...state.seatAssignments };
      delete nextAssignments[passengerId];

      const nextPassengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, assignedSeat: null } : p
      );

      releaseSessionLocks(state.sessionId, [previousSeat]);

      return {
        ...state,
        seatAssignments: nextAssignments,
        passengers: nextPassengers,
        seatLocks: getActiveLocks()
      };
    }

    case 'UPDATE_MEAL': {
      const { passengerId, mealId } = action.payload;
      const nextMeals = {
        ...state.selectedMeals,
        [passengerId]: mealId
      };
      const nextPassengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, mealId } : p
      );

      return {
        ...state,
        selectedMeals: nextMeals,
        passengers: nextPassengers
      };
    }

    case 'SYNC_LOCKS': {
      return {
        ...state,
        seatLocks: action.payload || getActiveLocks()
      };
    }

    case 'ADD_TOAST': {
      const title = action.payload.title;
      const message = action.payload.message;
      // Never stack repeated notifications with same title/message
      if (state.toasts.some((t) => t.title === title && t.message === message)) {
        return state;
      }
      const toast = {
        id: 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        type: action.payload.type || 'info',
        title,
        message,
        duration: action.payload.duration || 3200
      };
      // Keep only the latest notification to prevent stacking
      return {
        ...state,
        toasts: [toast]
      };
    }

    case 'REMOVE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload)
      };
    }

    case 'RESET_BOOKING': {
      clearAllLocks();
      localStorage.removeItem(STORAGE_BOOKING_KEY);
      return getInitialState();
    }

    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, null, getInitialState);

  // Sync to localStorage for persistence
  useEffect(() => {
    try {
      const { seats, seatLocks, toasts, ...persistable } = state;
      localStorage.setItem(STORAGE_BOOKING_KEY, JSON.stringify(persistable));
    } catch (e) {
      console.warn('Could not persist booking draft:', e);
    }
  }, [state]);

  // Periodic lock refresh & cross-tab synchronization
  useEffect(() => {
    const handleStorageUpdate = () => {
      dispatch({ type: 'SYNC_LOCKS', payload: getActiveLocks() });
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('aeroluxe_locks_updated', handleStorageUpdate);

    // Periodic sweep every 5 seconds to prune expired locks
    const interval = setInterval(() => {
      dispatch({ type: 'SYNC_LOCKS', payload: getActiveLocks() });
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('aeroluxe_locks_updated', handleStorageUpdate);
      clearInterval(interval);
    };
  }, []);

  // Derived inverted lookup: { [seatId]: passengerId }
  const seatToPassengerMap = useMemo(() => {
    const map = {};
    for (const [paxId, seatId] of Object.entries(state.seatAssignments)) {
      if (seatId) {
        map[seatId] = paxId;
      }
    }
    return map;
  }, [state.seatAssignments]);

  // Active passenger object
  const activePassenger = useMemo(() => {
    return state.passengers.find((p) => p.id === state.activePassengerId) || state.passengers[0];
  }, [state.passengers, state.activePassengerId]);

  // Current aircraft config data
  const currentAircraftConfig = useMemo(() => {
    return AIRCRAFT_CONFIGS[state.aircraftConfig] || AIRCRAFT_CONFIGS['3-2'];
  }, [state.aircraftConfig]);

  // Real-time Pricing Summary derived strictly from current assignments
  const pricingSummary = useMemo(() => {
    return calculatePricing({
      passengers: state.passengers,
      seatAssignments: state.seatAssignments,
      seats: state.seats,
      selectedMeals: state.selectedMeals,
      mealOptions: MEAL_OPTIONS,
      aircraftConfig: state.aircraftConfig,
      configDetails: currentAircraftConfig
    });
  }, [
    state.passengers,
    state.seatAssignments,
    state.seats,
    state.selectedMeals,
    state.aircraftConfig,
    currentAircraftConfig
  ]);

  // Action Dispatchers
  const addToast = useCallback((title, message, type = 'info', duration = 3500) => {
    dispatch({
      type: 'ADD_TOAST',
      payload: { title, message, type, duration }
    });
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const setStep = useCallback((step) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setTripType = useCallback((type) => {
    dispatch({ type: 'SET_TRIP_TYPE', payload: type });
  }, []);

  const updateFlightDetails = useCallback((details) => {
    dispatch({ type: 'UPDATE_FLIGHT_DETAILS', payload: details });
  }, []);

  const setAircraftConfig = useCallback(
    (configId) => {
      dispatch({ type: 'SET_AIRCRAFT_CONFIG', payload: configId });
    },
    []
  );

  const setActivePassenger = useCallback((passengerId) => {
    dispatch({ type: 'SET_ACTIVE_PASSENGER', payload: passengerId });
  }, []);

  const addPassenger = useCallback(
    (data = {}) => {
      if (state.passengers.length >= 6) {
        addToast('Capacity Limit', 'Maximum 6 passengers allowed per booking party.', 'warning');
        return;
      }
      dispatch({ type: 'ADD_PASSENGER', payload: data });
      addToast('Traveler Added', 'New passenger added to the flight manifest.', 'success');
    },
    [state.passengers.length, addToast]
  );

  const updatePassenger = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_PASSENGER', payload: { id, updates } });
  }, []);

  const removePassenger = useCallback(
    (id) => {
      if (state.passengers.length <= 1) {
        addToast('Action Disallowed', 'At least one passenger must remain in the booking.', 'error');
        return;
      }
      const targetPax = state.passengers.find((p) => p.id === id);
      dispatch({ type: 'REMOVE_PASSENGER', payload: id });
      addToast(
        'Passenger Removed',
        `${targetPax ? targetPax.name : 'Passenger'} and their assigned seat have been released.`,
        'info'
      );
    },
    [state.passengers, addToast]
  );

  /**
   * Main Seat Assignment method with complete validation and feedback
   */
  const assignSeatToPassenger = useCallback(
    (seatId, targetPassengerId = state.activePassengerId) => {
      if (!targetPassengerId) {
        addToast('No Traveler Selected', 'Please click on a passenger tab first before choosing a seat.', 'warning');
        return false;
      }

      const seatObj = state.seats[seatId];
      if (!seatObj) {
        addToast('Seat Not Found', `Seat ${seatId} does not exist in this cabin configuration.`, 'error');
        return false;
      }

      // Check occupied
      if (seatObj.isOccupied) {
        addToast('Seat Occupied', `Seat ${seatId} is already booked and unavailable.`, 'error');
        return false;
      }

      // Check seat locking by other session
      const locks = getActiveLocks();
      const existingLock = locks[seatId];
      if (existingLock && existingLock.sessionId !== state.sessionId) {
        addToast(
          'Seat Temporarily Reserved',
          `Seat ${seatId} is currently held by another booking session. Please choose another seat.`,
          'warning'
        );
        return false;
      }

      // If already assigned to this passenger, do nothing silently without repeated notifications
      if (state.seatAssignments[targetPassengerId] === seatId) {
        return true;
      }

      // If assigned to another passenger in current booking
      const assignedToOtherPaxId = seatToPassengerMap[seatId];
      if (assignedToOtherPaxId && assignedToOtherPaxId !== targetPassengerId) {
        const otherPax = state.passengers.find((p) => p.id === assignedToOtherPaxId);
        addToast(
          'Seat Already Assigned',
          `Seat ${seatId} is already assigned to ${otherPax ? otherPax.name : 'another traveler'}.`,
          'warning'
        );
        return false;
      }

      // Perform assignment
      const targetPax = state.passengers.find((p) => p.id === targetPassengerId);
      dispatch({
        type: 'ASSIGN_SEAT',
        payload: { passengerId: targetPassengerId, seatId }
      });

      // Automatically acquire a temporary hold lock for this seat
      acquireLocks([seatId], state.sessionId, state.bookingId);
      dispatch({ type: 'SYNC_LOCKS', payload: getActiveLocks() });

      addToast(
        'Seat Assigned',
        `Assigned Seat ${seatId} (${seatObj.type} • ₹${seatObj.price}) to ${targetPax ? targetPax.name : 'traveler'}.`,
        'success'
      );
      return true;
    },
    [
      state.activePassengerId,
      state.seats,
      state.sessionId,
      state.seatAssignments,
      seatToPassengerMap,
      state.passengers,
      state.bookingId,
      addToast
    ]
  );

  const unassignSeatFromPassenger = useCallback(
    (passengerId = state.activePassengerId) => {
      const prevSeat = state.seatAssignments[passengerId];
      if (!prevSeat) return;
      dispatch({ type: 'UNASSIGN_SEAT', payload: passengerId });
      addToast('Seat Released', `Seat ${prevSeat} has been released and is now available.`, 'info');
    },
    [state.activePassengerId, state.seatAssignments, addToast]
  );

  const updateMealForPassenger = useCallback((passengerId, mealId) => {
    dispatch({ type: 'UPDATE_MEAL', payload: { passengerId, mealId } });
  }, []);

  /**
   * Procedure called when proceeding: locks all selected seats
   */
  const lockSelectedSeats = useCallback(() => {
    const selectedSeatIds = Object.values(state.seatAssignments).filter(Boolean);
    if (selectedSeatIds.length === 0) return { success: true };

    const result = acquireLocks(selectedSeatIds, state.sessionId, state.bookingId);
    if (result.success) {
      dispatch({ type: 'SYNC_LOCKS', payload: getActiveLocks() });
      return { success: true };
    } else {
      addToast('Lock Conflict', result.error, 'error');
      return { success: false, error: result.error };
    }
  }, [state.seatAssignments, state.sessionId, state.bookingId, addToast]);

  const resetBooking = useCallback(() => {
    dispatch({ type: 'RESET_BOOKING' });
    addToast('Booking Reset', 'Flight booking has been restored to default configuration.', 'info');
  }, [addToast]);

  const simulateLock = useCallback(
    (seatId, minutes = 10) => {
      const lock = simulateExternalLock(seatId, minutes);
      dispatch({ type: 'SYNC_LOCKS', payload: getActiveLocks() });
      addToast(
        'Simulated External Lock',
        `Seat ${seatId} has been locked by external session ${lock.sessionId.slice(-6)}.`,
        'warning'
      );
    },
    [addToast]
  );

  const clearLocks = useCallback(() => {
    clearAllLocks();
    dispatch({ type: 'SYNC_LOCKS', payload: {} });
    addToast('Locks Cleared', 'All simulated and session seat locks have been wiped.', 'info');
  }, [addToast]);

  const value = {
    ...state,
    seatToPassengerMap,
    activePassenger,
    currentAircraftConfig,
    pricingSummary,
    setStep,
    setTripType,
    updateFlightDetails,
    setAircraftConfig,
    setActivePassenger,
    addPassenger,
    updatePassenger,
    removePassenger,
    assignSeatToPassenger,
    unassignSeatFromPassenger,
    updateMealForPassenger,
    lockSelectedSeats,
    simulateLock,
    clearLocks,
    resetBooking,
    addToast,
    removeToast
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

