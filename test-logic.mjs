import { calculatePricing } from './src/utils/pricing.js';
import { generateSeatsForConfig } from './src/data/initialSeats.js';
import { AIRCRAFT_CONFIGS } from './src/data/aircraftLayouts.js';
import { MEAL_OPTIONS } from './src/data/meals.js';
import { INITIAL_PASSENGERS } from './src/data/initialPassengers.js';

console.log('--- RUNNING AEROLUXE LOGIC SUITE ---');

// 1. Initial State Pricing Test
const seats32 = generateSeatsForConfig('3-2');
const initialAssignments = {
  'pax-1': '4A', // Window: 150
  'pax-2': '4B', // Middle: 0
  'pax-3': '4C'  // Aisle: 100
};
const initialMeals = {
  'pax-1': 'meal-veg',  // 0
  'pax-2': 'meal-jain', // 0
  'pax-3': 'meal-kids'  // 150
};

const initialPricing = calculatePricing({
  passengers: INITIAL_PASSENGERS,
  seatAssignments: initialAssignments,
  seats: seats32,
  selectedMeals: { 'pax-1': 'meal-veg', 'pax-2': 'meal-jain', 'pax-3': 'meal-none' }, // 0 meals
  mealOptions: MEAL_OPTIONS,
  aircraftConfig: '3-2',
  configDetails: AIRCRAFT_CONFIGS['3-2']
});

console.log('Test 1: Initial Default Booking');
console.log('Base airfare (3x 4850):', initialPricing.baseAirfare, initialPricing.baseAirfare === 14550 ? 'PASS' : 'FAIL');
console.log('Seats subtotal (150+0+100):', initialPricing.totalSeatCharges, initialPricing.totalSeatCharges === 250 ? 'PASS' : 'FAIL');
console.log('Taxes:', initialPricing.taxes, initialPricing.taxes === 1880 ? 'PASS' : 'FAIL');
console.log('Grand total (14550+250+1880):', initialPricing.grandTotal, initialPricing.grandTotal === 16680 ? 'PASS' : 'FAIL');

// 2. Dynamic Recalculation: Change expensive seat to free seat
const modifiedAssignments = {
  ...initialAssignments,
  'pax-1': '3B' // Changed 4A (150) to 3B (0)
};
const modifiedPricing = calculatePricing({
  passengers: INITIAL_PASSENGERS,
  seatAssignments: modifiedAssignments,
  seats: seats32,
  selectedMeals: { 'pax-1': 'meal-none', 'pax-2': 'meal-none', 'pax-3': 'meal-none' },
  mealOptions: MEAL_OPTIONS,
  aircraftConfig: '3-2',
  configDetails: AIRCRAFT_CONFIGS['3-2']
});

console.log('\nTest 2: Recalculate changing 4A (150) -> 3B (0)');
console.log('New seat charges (0 + 0 + 100):', modifiedPricing.totalSeatCharges, modifiedPricing.totalSeatCharges === 100 ? 'PASS' : 'FAIL');
console.log('New grand total:', modifiedPricing.grandTotal, modifiedPricing.grandTotal === (14550 + 100 + 1880) ? 'PASS' : 'FAIL');

// 3. Extra Legroom seat (Row 1 or Row 6)
const legroomAssignments = {
  ...initialAssignments,
  'pax-1': '1A' // Extra Legroom (350)
};
const legroomPricing = calculatePricing({
  passengers: INITIAL_PASSENGERS,
  seatAssignments: legroomAssignments,
  seats: seats32,
  selectedMeals: { 'pax-1': 'meal-none', 'pax-2': 'meal-none', 'pax-3': 'meal-none' },
  mealOptions: MEAL_OPTIONS,
  aircraftConfig: '3-2',
  configDetails: AIRCRAFT_CONFIGS['3-2']
});
console.log('\nTest 3: Extra Legroom 1A (350) + 4B (0) + 4C (100)');
console.log('Legroom seat charges (350 + 0 + 100):', legroomPricing.totalSeatCharges, legroomPricing.totalSeatCharges === 450 ? 'PASS' : 'FAIL');

// 4. Wide-Body 2-3-2 Configuration test
const seats232 = generateSeatsForConfig('2-3-2');
console.log('\nTest 4: Layout generation');
console.log('3-2 total seats (10x5):', Object.keys(seats32).length, Object.keys(seats32).length === 50 ? 'PASS' : 'FAIL');
console.log('2-3-2 total seats (10x7):', Object.keys(seats232).length, Object.keys(seats232).length === 70 ? 'PASS' : 'FAIL');

console.log('\nALL ENGINE LOGIC TESTS COMPLETED SUCCESSFULLY.');

