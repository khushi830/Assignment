export const AIRPORTS = [
  {
    code: 'PAT',
    city: 'Patna',
    name: 'Jayprakash Narayan International',
    terminal: 'T1',
    state: 'Bihar'
  },
  {
    code: 'DEL',
    city: 'New Delhi',
    name: 'Indira Gandhi International',
    terminal: 'T3',
    state: 'Delhi'
  },
  {
    code: 'BOM',
    city: 'Mumbai',
    name: 'Chhatrapati Shivaji Maharaj International',
    terminal: 'T2',
    state: 'Maharashtra'
  },
  {
    code: 'BLR',
    city: 'Bengaluru',
    name: 'Kempegowda International',
    terminal: 'T1',
    state: 'Karnataka'
  },
  {
    code: 'CCU',
    city: 'Kolkata',
    name: 'Netaji Subhash Chandra Bose International',
    terminal: 'T1',
    state: 'West Bengal'
  }
];

export const DEFAULT_FLIGHT = {
  flightNumber: 'AL-742',
  aircraftType: 'Airbus A321neo',
  fleetType: 'Executive Fleet',
  from: 'PAT',
  to: 'DEL',
  departureDate: '2024-10-24',
  departureTime: '08:35',
  arrivalTime: '10:20',
  duration: '1h 45m',
  isNonStop: true,
  baseFarePerPerson: 4850,
  taxAmount: 1880,
  bookingRef: 'ALX-9821-DEL'
};

