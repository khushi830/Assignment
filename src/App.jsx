import React, { useState, useEffect } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import DevLockDrawer from './components/common/DevLockDrawer';
import FlightLoader from './components/common/FlightLoader';
import FlightSelection from './components/FlightDetails/FlightSelection';
import AircraftSelection from './components/AircraftSelector/AircraftSelection';
import PassengerManagement from './components/PassengerList/PassengerManagement';
import AircraftSeatMap from './components/AircraftSeatMap/AircraftSeatMap';
import BookingReview from './components/BookingSummary/BookingReview';

function BookingFlowContent() {
  const { currentStep } = useBooking();
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Initial application loading simulation for flight telemetry and cabin initialization
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <FlightLoader
        fullscreen={true}
        message="Preparing your flight..."
        subMessage="Loading route architecture & cabin telemetry"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans text-on-surface antialiased animate-fadeIn">
      {/* Top Fixed Header */}
      <Header onOpenDevDrawer={() => setIsDevDrawerOpen(true)} />

      {/* Main Flow Content Container */}
      <main className="w-full pt-16 flex-1 flex flex-col bg-surface">
        {currentStep === 1 && <FlightSelection />}
        {currentStep === 2 && <AircraftSelection />}
        {currentStep === 3 && <PassengerManagement />}
        {currentStep === 4 && <AircraftSeatMap />}
        {currentStep === 5 && <BookingReview />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Toast Stack */}
      <Toast />

      {/* Evaluator / Dev Seat Lock Simulator Drawer */}
      <DevLockDrawer
        isOpen={isDevDrawerOpen}
        onClose={() => setIsDevDrawerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <BookingFlowContent />
    </BookingProvider>
  );
}
