export const AIRCRAFT_CONFIGS = {
  '3-2': {
    id: '3-2',
    name: '3–2 Narrow-Body Configuration',
    category: 'Single Aisle',
    badge: 'Streamlined',
    description: 'Rapid boarding cadence with intimate portside seating pair.',
    pitch: '32"',
    width: '18.2"',
    surchargePerPax: 0,
    surchargeLabel: 'No Surcharge',
    totalRows: 10,
    exitRow: 6,
    columns: ['A', 'B', 'C', 'D', 'E'],
    banks: [
      { id: 'port', label: 'Port (Left)', letters: ['A', 'B', 'C'] },
      { id: 'starboard', label: 'Starboard (Right)', letters: ['D', 'E'] }
    ]
  },
  '2-3-2': {
    id: '2-3-2',
    name: '2–3–2 Wide-Body Configuration',
    category: 'Twin Aisle',
    badge: 'Executive Expansive',
    description: 'Dual central pathways allowing unobstructed aisle access for 86% of travelers.',
    pitch: '34"',
    width: '19.5"',
    surchargePerPax: 500,
    surchargeLabel: '+₹500 / guest',
    totalRows: 10,
    exitRow: 6,
    columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    banks: [
      { id: 'port', label: 'Port', letters: ['A', 'B'] },
      { id: 'center', label: 'Center', letters: ['C', 'D', 'E'] },
      { id: 'starboard', label: 'Starboard', letters: ['F', 'G'] }
    ]
  }
};

