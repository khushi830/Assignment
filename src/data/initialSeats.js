import { SEAT_PRICING } from './pricingConfig.js';

export function getSeatCategoryAndType(configId, row, letter) {
  const isExitRow = row === 6;
  const isFirstRow = row === 1;

  if (isFirstRow || isExitRow) {
    return {
      category: 'Extra Legroom',
      price: SEAT_PRICING['Extra Legroom'],
      type: 'Extra Legroom',
      isExitRow
    };
  }

  if (configId === '3-2') {
    if (letter === 'A' || letter === 'E') {
      return {
        category: 'Standard Window',
        price: SEAT_PRICING['Standard Window'],
        type: 'Window',
        isExitRow: false
      };
    }
    if (letter === 'B') {
      return {
        category: 'Standard Middle',
        price: SEAT_PRICING['Standard Middle'],
        type: 'Middle',
        isExitRow: false
      };
    }
    // C and D are Aisle seats
    return {
      category: 'Standard Aisle',
      price: SEAT_PRICING['Standard Aisle'],
      type: 'Aisle',
      isExitRow: false
    };
  }

  // 2-3-2 Wide-body
  if (letter === 'A' || letter === 'G') {
    return {
      category: 'Standard Window',
      price: SEAT_PRICING['Standard Window'],
      type: 'Window',
      isExitRow: false
    };
  }
  if (letter === 'D') {
    return {
      category: 'Standard Middle',
      price: SEAT_PRICING['Standard Middle'],
      type: 'Middle',
      isExitRow: false
    };
  }
  // B, C, E, F are Aisle seats
  return {
    category: 'Standard Aisle',
    price: SEAT_PRICING['Standard Aisle'],
    type: 'Aisle',
    isExitRow: false
  };
}

export const INITIAL_OCCUPIED_3_2 = new Set([
  '1C', '1D', '2A', '3A', '3C', '3D', '4D', '5C', '5E', '6D', '7A', '8C', '8D', '8E', '9A', '10C'
]);

export const INITIAL_OCCUPIED_2_3_2 = new Set([
  '1C', '1E', '2A', '2G', '3C', '3E', '4D', '5B', '5F', '6C', '7A', '8D', '9B', '10E'
]);

export function generateSeatsForConfig(configId) {
  const seats = {};
  const occupiedSet = configId === '3-2' ? INITIAL_OCCUPIED_3_2 : INITIAL_OCCUPIED_2_3_2;
  const letters = configId === '3-2' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  for (let row = 1; row <= 10; row++) {
    for (const letter of letters) {
      const seatId = `${row}${letter}`;
      const { category, price, type, isExitRow } = getSeatCategoryAndType(configId, row, letter);
      const isOccupied = occupiedSet.has(seatId);

      seats[seatId] = {
        seatId,
        row,
        letter,
        category,
        price,
        type,
        isExitRow,
        isOccupied
      };
    }
  }

  return seats;
}
