import { PRICING_RULES } from '../data/pricingConfig.js';

/**
 * Derives all pricing itemizations directly from passenger assignments.
 * Never manually increments or decrements total on click!
 */
export function calculatePricing({
  passengers = [],
  seatAssignments = {},
  seats = {},
  selectedMeals = {},
  mealOptions = [],
  aircraftConfig = '3-2',
  configDetails = {}
}) {
  const baseRate = PRICING_RULES.baseFarePerPax;
  const numPax = passengers.length;
  const baseAirfare = numPax * baseRate;

  // Wide-body surcharge if applicable
  const widebodySurchargePerPax = configDetails?.surchargePerPax || 0;
  const cabinConfigurationSurcharge = numPax * widebodySurchargePerPax;

  let totalSeatCharges = 0;
  let totalMealCharges = 0;

  const passengerBreakdown = passengers.map((pax) => {
    const assignedSeatId = seatAssignments[pax.id] || null;
    const seatObj = assignedSeatId ? seats[assignedSeatId] : null;
    const seatPrice = seatObj ? seatObj.price : 0;
    totalSeatCharges += seatPrice;

    const assignedMealId = selectedMeals[pax.id] || pax.mealId || 'meal-none';
    const mealObj = mealOptions.find((m) => m.id === assignedMealId) || null;
    const mealPrice = mealObj ? mealObj.price : 0;
    totalMealCharges += mealPrice;

    return {
      passengerId: pax.id,
      name: pax.name,
      type: pax.type,
      initials: pax.initials || (pax.name ? pax.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'PX'),
      seatId: assignedSeatId,
      seatCategory: seatObj ? seatObj.category : null,
      seatType: seatObj ? seatObj.type : null,
      seatPrice,
      mealId: assignedMealId,
      mealName: mealObj ? mealObj.name : 'Standard Refreshment',
      mealShortName: mealObj ? mealObj.shortName : 'Standard',
      mealPrice,
      passengerTotal: seatPrice + mealPrice
    };
  });

  const taxes = numPax > 0 ? PRICING_RULES.taxesAndFees : 0;
  const grandTotal = baseAirfare + cabinConfigurationSurcharge + totalSeatCharges + totalMealCharges + taxes;

  const assignedCount = Object.values(seatAssignments).filter(Boolean).length;

  return {
    numPax,
    assignedCount,
    baseAirfare,
    cabinConfigurationSurcharge,
    totalSeatCharges,
    totalMealCharges,
    taxes,
    grandTotal,
    passengerBreakdown
  };
}
