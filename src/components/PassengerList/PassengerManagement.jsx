import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { MEAL_OPTIONS } from '../../data/meals';

export default function PassengerManagement() {
  const {
    setStep,
    flightDetails,
    passengers,
    activePassengerId,
    setActivePassenger,
    addPassenger,
    updatePassenger,
    removePassenger,
    seatAssignments,
    selectedMeals,
    updateMealForPassenger,
    pricingSummary,
    addToast
  } = useBooking();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPaxName, setNewPaxName] = useState('');
  const [newPaxCategory, setNewPaxCategory] = useState('Adult');
  const [newPaxMeal, setNewPaxMeal] = useState('meal-none');

  const activePax = passengers.find((p) => p.id === activePassengerId) || passengers[0];
  const activePaxIndex = passengers.findIndex((p) => p.id === activePax?.id) + 1;

  const handleNameChange = (e) => {
    if (!activePax) return;
    updatePassenger(activePax.id, { name: e.target.value });
  };

  const handleCategoryChange = (cat) => {
    if (!activePax) return;
    updatePassenger(activePax.id, {
      category: cat,
      type: cat,
      tag: cat === 'Child' ? 'Age 8' : (activePax.isLead ? 'Lead' : '')
    });
  };

  const handleMealChange = (e) => {
    if (!activePax) return;
    updateMealForPassenger(activePax.id, e.target.value);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPaxName.trim()) {
      addToast('Name Required', 'Please enter the passenger full legal name.', 'warning');
      return;
    }
    addPassenger({
      name: newPaxName.trim(),
      type: newPaxCategory,
      category: newPaxCategory,
      tag: newPaxCategory === 'Child' ? 'Child' : '',
      mealId: newPaxMeal
    });
    setNewPaxName('');
    setNewPaxMeal('meal-none');
    setShowAddModal(false);
  };

  const handleDeletePassenger = (id, name) => {
    if (confirm(`Remove ${name} from flight booking? Any assigned seat will be released.`)) {
      removePassenger(id);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Top Atmospheric Strip / Flight Leg Micro-Header */}
      <section className="w-full bg-surface-container-low px-4 sm:px-gutter py-space-md shadow-xs border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-body-lg text-secondary-container">
                flight_takeoff
              </span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                <span>Flight {flightDetails.flightNumber}</span>
                <span>•</span>
                <span className="text-on-tertiary-container font-medium">Confirmed</span>
              </div>
              <div className="flex items-center gap-space-sm text-base font-semibold text-on-surface mt-0.5">
                <span>{flightDetails.from}</span>
                <span className="material-symbols-outlined text-secondary text-body-md">
                  arrow_forward
                </span>
                <span>{flightDetails.to}</span>
                <span className="text-xs text-on-surface-variant ml-space-xs font-normal">
                  {flightDetails.aircraftType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Step Tracker Indicator */}
          <div className="flex items-center gap-space-sm">
            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs uppercase tracking-wider font-semibold">
              Step 3 of 5
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              Next: Interactive Cabin Seating
            </span>
          </div>
        </div>
      </section>

      {/* Main Workflow Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-gutter py-space-xl flex-1">
        {/* Header with Add Passenger Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md mb-space-xl">
          <div>
            <div className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">
              AeroLuxe Manifest Setup
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Passenger Details
            </h1>
            <p className="text-xs sm:text-sm font-normal text-on-surface-variant mt-1 leading-relaxed">
              Review traveler roster, dietary specifications, and travel categories prior to seat allocation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-space-xs px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all self-start sm:self-auto shadow-sm border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-body-lg text-secondary">add_circle</span>
            <span>+ Add Passenger</span>
          </button>
        </div>

        {/* 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left 8 Columns: Passenger Selectors & Inline Configuration */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* Horizontal Passenger Pill Cards List */}
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-[11px] uppercase text-on-surface-variant tracking-wider font-semibold">
                  Select Traveler to Edit
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {passengers.length} Manifest Records
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                {passengers.map((pax, idx) => {
                  const isCurrent = pax.id === activePassengerId;
                  const assignedSeat = seatAssignments[pax.id];

                  return (
                    <button
                      key={pax.id}
                      type="button"
                      onClick={() => setActivePassenger(pax.id)}
                      className={`group text-left p-space-md rounded-2xl transition-all shadow-sm relative overflow-hidden flex flex-col justify-between h-28 cursor-pointer border ${
                        isCurrent
                          ? 'bg-primary-container text-on-primary shadow-md border-transparent'
                          : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface hover:shadow border-surface-variant/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`w-6 h-6 rounded-full font-label-sm text-label-sm font-bold flex items-center justify-center ${
                            isCurrent
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/20 text-on-primary font-label-sm text-label-sm font-semibold">
                            Active Edit
                          </span>
                        )}
                      </div>

                      <div>
                        <div
                          className={`text-sm font-semibold truncate ${
                            isCurrent ? 'text-on-primary' : 'text-on-surface'
                          }`}
                        >
                          {pax.name}
                        </div>
                        <div
                          className={`flex items-center justify-between mt-0.5 text-xs ${
                            isCurrent ? 'text-on-primary-container' : 'text-on-surface-variant'
                          }`}
                        >
                          <span className="font-normal">{pax.category} {pax.isLead ? '(Lead)' : ''}</span>
                          <span
                            className={`text-xs font-semibold ${
                              assignedSeat
                                ? 'text-secondary-container'
                                : isCurrent
                                ? 'text-on-primary-container'
                                : 'text-outline'
                            }`}
                          >
                            {assignedSeat ? `Seat: ${assignedSeat}` : 'Seat: Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Active Indicator Bar */}
                      {isCurrent && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-container" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inline Compact Edit Card for Active Passenger */}
            {activePax && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-lg relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-body-lg">person_edit</span>
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-on-surface">
                        Editing Passenger {activePaxIndex} • {activePax.name}
                      </h2>
                      <p className="text-xs font-normal text-on-surface-variant">
                        Update identity and personal in-flight culinary preferences.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {activePax.isLead && (
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] uppercase tracking-wide font-semibold">
                        Primary Traveler
                      </span>
                    )}
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePassenger(activePax.id, activePax.name)}
                        className="px-2.5 py-1 rounded-lg text-error hover:bg-error-container/20 text-xs font-medium transition-colors flex items-center gap-1"
                        title="Remove passenger from manifest"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Full Name Input */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label
                      htmlFor="pax-name-input"
                      className="text-xs font-medium text-on-surface-variant"
                    >
                      Full Legal Name (as per Passport / Govt ID)
                    </label>
                    <div className="relative">
                      <input
                        id="pax-name-input"
                        type="text"
                        value={activePax.name}
                        onChange={handleNameChange}
                        className="w-full bg-surface-container-low rounded-xl px-space-md py-2.5 text-on-surface text-sm font-medium outline-none focus:bg-surface-container border border-transparent focus:border-secondary-container transition-all"
                        placeholder="Enter traveler legal name"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-body-lg">
                        badge
                      </span>
                    </div>
                  </div>

                  {/* Passenger Category */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-on-surface-variant">
                      Passenger Classification
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange('Adult')}
                        className={`px-space-md py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-space-xs transition-colors ${
                          activePax.type === 'Adult'
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface font-medium'
                        }`}
                      >
                        <span className="material-symbols-outlined text-body-md">person</span>
                        <span>Adult (12+ yrs)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange('Child')}
                        className={`px-space-md py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-space-xs transition-colors ${
                          activePax.type === 'Child'
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface font-medium'
                        }`}
                      >
                        <span className="material-symbols-outlined text-body-md">child_care</span>
                        <span>Child (2-11 yrs)</span>
                      </button>
                    </div>
                  </div>

                  {/* Meal Preference Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="meal-preference-select"
                      className="text-xs font-medium text-on-surface-variant"
                    >
                      Optional Meal Preference
                    </label>
                    <div className="relative">
                      <select
                        id="meal-preference-select"
                        value={selectedMeals[activePax.id] || activePax.mealId || 'meal-none'}
                        onChange={handleMealChange}
                        className="w-full bg-surface-container-low text-on-surface rounded-xl px-space-md py-2.5 text-xs font-medium appearance-none outline-none focus:bg-surface-container border border-transparent focus:border-secondary-container transition-all cursor-pointer"
                      >
                        {MEAL_OPTIONS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} {m.price > 0 ? `(+₹${m.price})` : '(Free)'}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-2.5 text-on-surface-variant text-body-lg">
                        restaurant
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Notice of Luggage Inclusion */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-body-lg">
                      luggage
                    </span>
                    <span className="text-xs">
                      Complimentary Baggage: 2 Checked (32kg each) + 1 Cabin Carry-on
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-wide font-bold">
                    Included in Executive Tier
                  </span>
                </div>
              </div>
            )}

            {/* Visual Aesthetic Showcase Card */}
            <div className="rounded-2xl overflow-hidden shadow-sm bg-surface-container-lowest border border-surface-variant/40 flex flex-col md:flex-row items-stretch">
              <div className="md:w-1/2 p-space-lg flex flex-col justify-between">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                    Stratosphere Experience
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-extrabold mt-1">
                    Bespoke In-Flight Hospitality
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-xs sm:text-sm">
                    Every traveler receives curated dining prepared by Michelin-starred culinary partners, high-speed StratoLink Wi-Fi, and priority ramp transfer.
                  </p>
                </div>
                <div className="flex items-center gap-space-md mt-space-md pt-space-md border-t border-surface-container">
                  <div className="flex items-center gap-1 text-on-surface font-label-md text-label-md text-xs font-bold">
                    <span className="material-symbols-outlined text-secondary text-body-lg">
                      airline_seat_recline_extra
                    </span>
                    <span>Custom Ergonomics</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface font-label-md text-label-md text-xs font-bold">
                    <span className="material-symbols-outlined text-secondary text-body-lg">
                      dinner_dining
                    </span>
                    <span>Fine Vintage Cellar</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 min-h-36 md:min-h-auto relative bg-primary-container p-6 flex flex-col justify-end text-on-primary">
                <span className="material-symbols-outlined text-secondary-container text-4xl mb-2">
                  hotel_class
                </span>
                <span className="font-bold text-sm">World Class Travel Protocol</span>
                <span className="text-xs text-on-primary-container">Certified DGCA & IATA compliant seating comfort.</span>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Roster Summary, Pricing, & Direct Primary Progression CTA */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg sticky top-20">
            {/* Summary Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant/30">
                <h3 className="text-base font-semibold text-on-surface">
                  Assignment Summary
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                  {passengers.length} Confirmed
                </span>
              </div>

              {/* Manifest List in Compact Format */}
              <div className="flex flex-col gap-space-sm">
                {pricingSummary.passengerBreakdown.map((item, idx) => (
                  <div
                    key={item.passengerId}
                    className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary text-xs flex items-center justify-center font-semibold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-on-surface">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-normal text-on-surface-variant">
                          {item.type} • {item.mealShortName}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        item.seatId
                          ? 'bg-primary-container text-secondary-container'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {item.seatId ? `Seat ${item.seatId}` : 'Seat Pending'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Perforated Aviation Ticket Divider */}
              <div className="w-full flex items-center gap-2 my-1">
                <div className="w-3 h-3 -ml-5 rounded-full bg-surface" />
                <div className="flex-1 border-t-2 border-dashed border-outline-variant" />
                <div className="w-3 h-3 -mr-5 rounded-full bg-surface" />
              </div>

              {/* Fare Breakdown Lines */}
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-normal">Executive Cabin Base Fare ({passengers.length}x)</span>
                  <span className="text-on-surface font-semibold tabular-nums">
                    ₹{pricingSummary.baseAirfare.toLocaleString('en-IN')}
                  </span>
                </div>
                {pricingSummary.cabinConfigurationSurcharge > 0 && (
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-normal">Wide-Body Cabin Surcharge</span>
                    <span className="text-on-surface font-semibold tabular-nums">
                      ₹{pricingSummary.cabinConfigurationSurcharge.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-normal">Aviation Security & Fuel Surcharge</span>
                  <span className="text-on-surface font-semibold tabular-nums">
                    ₹{pricingSummary.taxes.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-normal">Seat Selection (Next Step)</span>
                  <span className="text-[11px] text-on-tertiary-container uppercase tracking-wide font-semibold">
                    {pricingSummary.totalSeatCharges > 0
                      ? `₹${pricingSummary.totalSeatCharges.toLocaleString('en-IN')}`
                      : 'Included'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-surface-variant/40 text-on-surface">
                  <span className="text-sm font-semibold">Total Estimated Price</span>
                  <span className="text-xl font-bold text-secondary tabular-nums">
                    ₹{pricingSummary.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full mt-space-sm py-3 px-space-md rounded-xl bg-primary-container hover:bg-secondary-container hover:text-on-secondary-container text-on-primary flex items-center justify-center gap-space-sm text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] group"
              >
                <span>Continue to Seat Selection</span>
                <span className="material-symbols-outlined text-secondary-container transition-transform group-hover:translate-x-1">
                  event_seat
                </span>
              </button>

              <div className="flex items-center justify-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm pt-1 text-[11px]">
                <span className="material-symbols-outlined text-body-md text-on-tertiary-container">
                  verified_user
                </span>
                <span>All travelers covered under AeroLuxe Concierge Guarantee</span>
              </div>
            </div>

            {/* Micro Concierge Card */}
            <div className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-md border border-surface-variant/40">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-headline-sm">support_agent</span>
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface font-bold text-xs">
                  Need Visa or Diplomatic Clearance?
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                  Contact Private Jet Operations 24/7.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Passenger Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-lg shadow-2xl border border-surface-variant flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">person_add</span>
                <h2 className="font-bold text-on-surface text-base">Add New Passenger</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={newPaxName}
                  onChange={(e) => setNewPaxName(e.target.value)}
                  className="bg-surface-container-low px-space-md py-2.5 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-secondary-container"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Adult', 'Child'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewPaxCategory(c)}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        newPaxCategory === c
                          ? 'bg-primary-container text-on-primary'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Meal Preference</label>
                <select
                  value={newPaxMeal}
                  onChange={(e) => setNewPaxMeal(e.target.value)}
                  className="bg-surface-container-low text-on-surface px-space-md py-2.5 rounded-xl text-xs font-semibold outline-none border border-transparent focus:border-secondary-container cursor-pointer"
                >
                  {MEAL_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.price > 0 ? `(+₹${m.price})` : '(Free)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-colors shadow-sm"
                >
                  Add Traveler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

