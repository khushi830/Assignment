import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useBooking } from '../../context/BookingContext';
import BoardingPassModal from './BoardingPassModal';
import FlightLoader from '../common/FlightLoader';

export default function BookingReview() {
  const {
    flightDetails,
    passengers,
    pricingSummary,
    currentAircraftConfig,
    setActivePassenger,
    setStep,
    bookingId,
    addToast
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  // Price guarantee countdown timer (15 minutes)
  const [timerSeconds, setTimerSeconds] = useState(892); // ~14m 52s initially matching design

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeatChangeForPax = (passengerId) => {
    setActivePassenger(passengerId);
    setStep(4);
  };

  const handleConfirmAndPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // graceful fallback if canvas not available
      }

      addToast('Payment Authenticated', `PNR ${bookingId} confirmed! Flight successfully booked.`, 'success', 3500);
      setShowBoardingPass(true);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Top Subtle Context Ribbon */}
      <div className="w-full bg-surface-container-low py-space-sm px-4 sm:px-gutter mb-space-md border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-xs">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              5
            </span>
            <span className="text-on-surface uppercase tracking-wider text-xs font-semibold">
              Step 5 • Final Price Summary & Review
            </span>
          </div>

          <div className="flex items-center gap-space-md text-on-surface-variant text-xs font-medium">
            <span className="inline-flex items-center gap-space-xs text-on-tertiary-container text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-body-md">verified</span>
              Price Guaranteed for {formatTimer(timerSeconds)}
            </span>
            <span className="hidden sm:inline text-outline-variant">•</span>
            <span className="hidden sm:inline">
              Booking Ref: <strong className="text-on-surface font-semibold font-mono">{bookingId}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Container Split Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-gutter pb-space-xl flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Flight & Travelers Review (7 Columns) */}
          <section className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Flight Route Header Card */}
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-variant/40">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md relative z-10">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-headline-sm text-secondary-container">
                      flight_takeoff
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs text-xs">
                      <span className="uppercase tracking-wider text-secondary font-semibold text-[11px]">
                        Executive Direct
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="text-on-surface-variant font-medium text-[11px]">
                        Flight {flightDetails.flightNumber}
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight mt-0.5">
                      {flightDetails.from} ({flightDetails.from}){' '}
                      <span className="text-secondary">→</span> {flightDetails.to} ({flightDetails.to})
                    </h1>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center text-left sm:text-right text-xs">
                  <span className="text-on-surface font-semibold">
                    Thu, 24 Oct 2024
                  </span>
                  <span className="text-on-surface-variant font-normal">
                    {flightDetails.aircraftType} • {currentAircraftConfig.name}
                  </span>
                </div>
              </div>

              {/* Perforated Divider Bar */}
              <div className="relative my-space-md py-space-xs">
                <div className="w-full h-px bg-surface-variant" />
                <div className="absolute -left-space-lg top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface" />
                <div className="absolute -right-space-lg top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface" />
              </div>

              {/* Flight Timings & Metrics */}
              <div className="grid grid-cols-3 gap-space-sm items-center text-center">
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-bold text-on-surface leading-none block tabular-nums">
                    {flightDetails.departureTime}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant block mt-1 font-bold text-xs">
                    {flightDetails.from} • Terminal 1
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                    Jay Prakash Narayan Intl
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 font-bold text-[10px]">
                    {flightDetails.duration} Direct
                  </span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
                    <div className="h-0.5 flex-1 bg-surface-variant relative">
                      <span className="material-symbols-outlined text-sm text-secondary-container absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        flight
                      </span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-container" />
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container mt-1 font-bold text-[11px]">
                    Non-stop • On Time
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-on-surface leading-none block text-2xl sm:text-3xl">
                    {flightDetails.arrivalTime}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant block mt-1 font-bold text-xs">
                    {flightDetails.to} • Terminal 3
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                    Indira Gandhi Intl
                  </span>
                </div>
              </div>

              {/* Curated Aircraft Preview Banner */}
              <div className="mt-space-md pt-space-sm relative rounded-xl overflow-hidden bg-primary-container p-4 flex items-center justify-between text-on-primary">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed block font-bold text-[10px]">
                    Confirmed Aircraft Cabin
                  </span>
                  <span className="font-label-lg text-label-lg font-bold text-sm">
                    {currentAircraftConfig.name}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-on-primary bg-primary-container/80 border border-secondary-container/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                  <span className="material-symbols-outlined text-xs text-secondary-container">
                    airline_seat_recline_extra
                  </span>
                  <span>{pricingSummary.assignedCount} Seats Assigned</span>
                </span>
              </div>
            </div>

            {/* Passengers, Seat & Meal Review Section */}
            <div className="flex items-center justify-between mt-space-xs px-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="text-base font-semibold text-on-surface">
                  Traveler Selections
                </span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {passengers.length} Guests
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-normal">
                All inclusions verified
              </span>
            </div>

            {/* Manifest Review Cards */}
            <div className="flex flex-col gap-space-sm">
              {pricingSummary.passengerBreakdown.map((item, idx) => {
                const avatarColor =
                  idx === 0
                    ? 'bg-primary-container text-on-primary'
                    : idx === 1
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container-highest text-on-surface';

                return (
                  <div
                    key={item.passengerId}
                    className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-variant/40 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div className="flex items-start gap-space-md">
                        <div
                          className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center font-semibold text-xs shrink-0`}
                        >
                          {item.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-space-xs">
                            <span className="text-sm font-semibold text-on-surface">
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-medium">
                              {item.type} {idx === 0 ? '(Lead)' : ''}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-space-sm mt-1.5 text-xs">
                            {/* Seat Badge */}
                            <div className="inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg">
                              <span className="material-symbols-outlined text-secondary text-sm">
                                airline_seat_recline_normal
                              </span>
                              <span className="text-on-surface font-semibold text-xs">
                                Seat <strong>{item.seatId || 'Pending'}</strong>
                              </span>
                              <span className="text-on-surface-variant text-[11px] font-normal">
                                ({item.seatType || 'Seat'} •{' '}
                                {item.seatPrice === 0 ? 'Free' : `₹${item.seatPrice}`})
                              </span>
                            </div>

                            {/* Meal Badge */}
                            <div className="inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg">
                              <span className="material-symbols-outlined text-on-tertiary-container text-sm">
                                restaurant
                              </span>
                              <span className="text-on-surface font-medium text-[11px]">
                                {item.mealShortName}
                              </span>
                              <span className="text-on-tertiary-container uppercase font-semibold text-[10px]">
                                {item.mealPrice === 0 ? 'Free' : `+₹${item.mealPrice}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSeatChangeForPax(item.passengerId)}
                        className="self-end sm:self-center px-space-md py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span>Change Seat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Baggage & Aviation Assurance Note */}
            <div className="p-space-md rounded-2xl bg-surface-container flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm text-xs">
              <span className="material-symbols-outlined text-secondary text-headline-sm">
                luggage
              </span>
              <div className="flex-1">
                <span className="font-label-md text-label-md text-on-surface block font-bold">
                  Checked Baggage Included
                </span>
                <span>
                  15 kg per passenger + 7 kg hand baggage (Cabin). Additional baggage can be added during online check-in.
                </span>
              </div>
            </div>
          </section>

          {/* Right Column: Final Fare Breakdown & Fast Checkout (5 Columns) */}
          <aside className="lg:col-span-5 flex flex-col gap-space-md sticky top-20">
            {/* Fare Breakdown Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg border border-surface-variant/40 flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
                <h2 className="text-base font-semibold text-on-surface">
                  Fare Summary
                </h2>
                <span className="uppercase tracking-wider text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded-full font-semibold text-[10px]">
                  All Taxes Included
                </span>
              </div>

              {/* Itemized Breakdown */}
              <div className="flex flex-col gap-space-sm pt-space-xs text-xs">
                <div className="flex justify-between items-center text-on-surface">
                  <span className="flex items-center gap-1.5 font-normal">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">
                      flight
                    </span>
                    Base Airfare{' '}
                    <span className="text-on-surface-variant text-[11px] font-normal">
                      ({passengers.length} Travelers)
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    ₹{pricingSummary.baseAirfare.toLocaleString('en-IN')}
                  </span>
                </div>

                {pricingSummary.cabinConfigurationSurcharge > 0 && (
                  <div className="flex justify-between items-center text-on-surface">
                    <span className="flex items-center gap-1.5 font-normal">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">
                        airlines
                      </span>
                      Cabin Surcharge ({currentAircraftConfig.name})
                    </span>
                    <span className="font-semibold tabular-nums">
                      ₹{pricingSummary.cabinConfigurationSurcharge.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-on-surface">
                  <span className="flex items-center gap-1.5 font-normal">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">
                      chair
                    </span>
                    Seat Selection Fees
                  </span>
                  <span className="font-semibold tabular-nums">
                    ₹{pricingSummary.totalSeatCharges.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-on-surface">
                  <span className="flex items-center gap-1.5 font-normal">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">
                      soup_kitchen
                    </span>
                    Meal Add-ons
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      pricingSummary.totalMealCharges === 0
                        ? 'text-on-tertiary-container uppercase text-[11px]'
                        : 'text-on-surface'
                    }`}
                  >
                    {pricingSummary.totalMealCharges === 0
                      ? 'Free (₹0)'
                      : `₹${pricingSummary.totalMealCharges.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-on-surface">
                  <span className="flex items-center gap-1.5 font-normal">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">
                      account_balance
                    </span>
                    Taxes & DGCA Surcharges
                  </span>
                  <span className="font-semibold tabular-nums">
                    ₹{pricingSummary.taxes.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Ticket Separation Perforated Band */}
              <div className="w-full flex items-center gap-2 py-space-xs my-space-xs">
                <div className="h-px bg-surface-variant flex-1" />
                <span className="text-[10px] font-semibold uppercase text-outline tracking-wider px-2">
                  Total Payable
                </span>
                <div className="h-px bg-surface-variant flex-1" />
              </div>

              {/* Grand Total Banner */}
              <div className="bg-primary-container p-space-md rounded-2xl text-on-primary flex items-center justify-between shadow-inner">
                <div>
                  <span className="uppercase tracking-wider text-on-primary-container block font-medium text-[10px]">
                    Grand Total
                  </span>
                  <span className="text-on-primary-container text-[11px] font-normal">
                    INR (₹) Net Amount
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold text-secondary-container leading-none tabular-nums">
                    ₹{pricingSummary.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-space-xs">
                <span className="text-xs font-semibold text-on-surface block mb-space-xs">
                  Select Fast Checkout Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'Instant UPI', icon: 'qr_code_scanner' },
                    { id: 'card', label: 'Credit / Debit', icon: 'credit_card' },
                    { id: 'netbanking', label: 'Net Banking', icon: 'account_balance' }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-2.5 rounded-xl text-center transition-all flex flex-col items-center gap-1 border ${
                          isSelected
                            ? 'bg-primary-container text-on-primary border-transparent shadow-sm'
                            : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-variant/40'
                        }`}
                      >
                        <span className="material-symbols-outlined text-body-lg">{method.icon}</span>
                        <span className="text-[10px] font-semibold uppercase">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
                className={`w-full mt-space-xs py-3.5 px-space-lg rounded-2xl text-sm font-semibold tracking-wide flex items-center justify-center gap-space-sm shadow-md transition-all duration-300 group ${
                  isConfirmed
                    ? 'bg-tertiary-container text-on-tertiary-container'
                    : 'bg-primary hover:bg-secondary-container hover:text-on-secondary-container text-on-primary'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-body-lg">
                      progress_activity
                    </span>
                    <span>Securing Flight {flightDetails.flightNumber}...</span>
                  </>
                ) : isConfirmed ? (
                  <>
                    <span className="material-symbols-outlined text-body-lg">check_circle</span>
                    <span>Booking Confirmed &bull; View Boarding Pass</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-body-lg group-hover:scale-110 transition-transform">
                      lock
                    </span>
                    <span>Confirm Booking & Pay ₹{pricingSummary.grandTotal.toLocaleString('en-IN')}</span>
                    <span className="material-symbols-outlined text-body-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              {/* Security Badges Footer */}
              <div className="flex items-center justify-center gap-space-md text-on-surface-variant font-label-sm text-label-sm pt-space-xs text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-on-tertiary-container">
                    encrypted
                  </span>
                  256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">
                    verified_user
                  </span>
                  DGCA Compliant
                </span>
              </div>
            </div>

            {/* Executive Assistance Helper Card */}
            <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center gap-space-md border border-surface-variant/40">
              <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                <span className="material-symbols-outlined text-body-lg">support_agent</span>
              </div>
              <div className="flex-1 text-xs">
                <span className="font-label-md text-label-md text-on-surface block font-bold">
                  AeroLuxe Platinum Concierge
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                  Need instant split-billing or corporate GST invoicing? Dial 1800-AEROLUXE
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Reusable Flight Loader Overlay during Checkout */}
      {isProcessing && (
        <FlightLoader
          fullscreen={true}
          message={`Securing Flight ${flightDetails.flightNumber}...`}
          subMessage="Authenticating PNR with Executive Operations and finalizing seat leases"
        />
      )}

      {/* Boarding Pass Issued Modal */}
      <BoardingPassModal
        isOpen={showBoardingPass}
        onClose={() => setShowBoardingPass(false)}
      />
    </div>
  );
}

