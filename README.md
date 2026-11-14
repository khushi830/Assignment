# AeroLuxe • Flight Seat Selection & Passenger Management System

A high-performance, enterprise-grade airline booking and interactive aircraft seat assignment application built with **React.js**, **Tailwind CSS**, and **React Context / useReducer architecture**. Designed and styled to pixel-perfection according to the Google Stitch executive aviation design system.

---

## 1. Project Overview

AeroLuxe simulates the end-to-end customer journey of an executive airline booking platform, covering:

1. **Flight Route Architecture (Step 1)**: Interactive origin/destination selection (e.g. Patna PAT → New Delhi DEL), one-way vs. round-trip flight legs, schedule details, and route swapping.
2. **Aircraft Cabin Configuration (Step 2)**: Dynamic switching between:
   - **3–2 Narrow-Body (Single Aisle)**: $A\ B\ C\ |\ D\ E$
   - **2–3–2 Wide-Body (Twin Aisle)**: $A\ B\ |\ C\ D\ E\ |\ F\ G$
3. **Passenger Manifest Management (Step 3)**: Multi-traveler manifest administration (Add, Remove, Switch active passenger, classification between Adult/Child, and dietary preferences).
4. **Interactive Aircraft Cabin Seat Matrix (Step 4)**: Realistic top-view fuselage canvas featuring 10 rows, cockpit indication, galleys, lavatories, emergency exit doors (Row 6), bi-directional synchronization with an alternative Quick-Pick dropdown, and live passenger assignments.
5. **Simulated Distributed Seat-Locking Mechanism**: Frontend lease reservation simulating temporary hold locks using `localStorage` and `sessionStorage` with automatic expiry pruning and multi-session conflict detection.
6. **Pure Derived Seat Pricing Engine**: Dynamic mathematical recalculations derived directly from current seat and meal assignments without manual increment/decrement click handlers.
7. **Final Review & Boarding Pass Issuance (Step 5)**: Price guarantee countdown timer, traveler itemization, payment method selector, interactive simulated checkout with celebratory effects, and digital boarding pass generation.

---

## 2. Technologies Used

- **React.js 18** (Functional components, custom hooks, React Context, `useReducer`, `useMemo`, `useCallback`)
- **Vite 6** (Modern ES module bundler for blazing-fast HMR and optimized production builds)
- **Tailwind CSS 3** (Custom design tokens matching the AeroLuxe palette: Midnight Jet Navy `#081534`, Golden Amber `#FDAF23`, Deep Teal `#0C9488`, and Cloud Slate surfaces)
- **Google Material Symbols & Plus Jakarta Sans** (Executive aviation typography and iconography)
- **HTML5 Canvas Confetti** (Interactive visual feedback upon booking authentication)
- **LocalStorage & SessionStorage APIs** (Draft state persistence, multi-tab broadcast channel simulation, and distributed lock simulation)

---

## 3. Project Structure

```
asss/
├── index.html                           # Root HTML with Google Fonts & Material Symbols
├── package.json                         # Project dependencies, build and test scripts
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Custom design system tokens & colors
├── postcss.config.js                    # PostCSS plugins
├── test-logic.mjs                       # Automated unit tests for pricing & layout generation
├── test-locking.mjs                     # Automated tests for seat lease locking lifecycle
├── src/
│   ├── App.jsx                          # Main booking journey controller
│   ├── main.jsx                         # Application entry point
│   ├── styles/
│   │   └── index.css                    # Global typography, animations & fuselage shadows
│   ├── context/
│   │   └── BookingContext.jsx           # Centralized booking state provider & reducer
│   ├── hooks/
│   │   ├── useBooking.js                # Convenience hook for booking context
│   │   └── useSeatLocking.js            # Reactive hook for seat locking countdown & status
│   ├── data/
│   │   ├── airports.js                  # Sample airports & default executive flight
│   │   ├── aircraftLayouts.js           # 3-2 Narrow-body and 2-3-2 Wide-body layout specs
│   │   ├── pricingConfig.js             # Centralized seat category pricing & taxes
│   │   ├── meals.js                     # Curated in-flight dining options
│   │   ├── initialPassengers.js         # Default 3 sample travelers (Rajesh, Priya, Aarav)
│   │   └── initialSeats.js              # Seat generator (rows 1-10) with initial occupied states
│   ├── utils/
│   │   ├── pricing.js                   # Pure derived pricing calculator
│   │   ├── seatHelpers.js               # Availability state resolver (AVAILABLE, OCCUPIED, etc.)
│   │   └── lockHelpers.js               # Multi-session lease lock manager with localStorage
│   └── components/
│       ├── AircraftSeatMap/
│       │   ├── AircraftSeatMap.jsx      # Step 4: Fuselage canvas with interactive seats
│       │   ├── Seat.jsx                 # Individual interactive seat component
│       │   ├── SeatLegend.jsx           # Color legend and cabin amenities
│       │   ├── SeatDropdown.jsx         # Alternative synchronized quick-pick dropdown
│       │   └── TripSummaryCard.jsx      # Sticky real-time fare itemization breakdown
│       ├── common/
│       │   ├── Header.jsx               # Stepper navigation, currency toggle & lock simulator
│       │   ├── Footer.jsx               # Brand copyright & aviation links
│       │   ├── Toast.jsx                # Responsive toast notification queue
│       │   ├── FlightLoader.jsx         # Reusable brand loader overlay & radar fallback
│       │   └── DevLockDrawer.jsx        # Evaluator drawer to test concurrent user seat locks
│       └── BookingSummary/
│           ├── BookingReview.jsx        # Step 5: Final review, timer & checkout
│           └── BoardingPassModal.jsx    # Electronic boarding pass with PNR & barcodes
```

---

## 4. State Management Approach

The application uses **React Context** combined with a robust **`useReducer`** pattern to guarantee predictable state transitions and eliminate race conditions:

- **Centralized Source of Truth**: `BookingContext.jsx` manages:
  - `currentStep`: Numeric step (1 through 5)
  - `aircraftConfig`: Active layout (`'3-2'` or `'2-3-2'`)
  - `passengers`: Array of passenger records with stable unique IDs (`'pax-1'`, `'pax-2'`, etc.)
  - `activePassengerId`: Identifier of the traveler currently being configured
  - `seatAssignments`: Dictionary mapping `{ [passengerId]: seatId }`
  - `selectedMeals`: Dictionary mapping `{ [passengerId]: mealId }`
  - `seatLocks`: Active session and concurrent locks loaded from persistent storage
  - `toasts`: Active user notification queue
- **Separation of Concerns**: Seat definitions and passenger entities are kept distinct; assignments are stored as bidirectional relations without mutating the underlying seat objects.
- **Derived State via Selectors**:
  - `seatToPassengerMap`: Computed with `useMemo` as an inverted index `{ [seatId]: passengerId }` for $O(1)$ seat collision and ownership checks.
  - `pricingSummary`: Calculated through pure functional transformation (`calculatePricing`), avoiding duplicate calculations.

---

## 5. Passenger-to-Seat Assignment Logic

1. **One Passenger, One Seat**: A passenger can hold at most one seat. When an assigned passenger selects a new available seat, their previous seat assignment is released and immediately returned to the `AVAILABLE` pool.
2. **One Seat, One Passenger**: A seat cannot be simultaneously assigned to two travelers. If a user clicks a seat already assigned to a companion traveler, the system raises an inline feedback toast and rejects the assignment.
3. **Active Passenger Highlighting**:
   - The seat of the active passenger is rendered with the deep navy ground (`#081534`), crisp seat letter, and an animated golden halo ring (`#FDAF23`) displaying their initials (e.g. `RS`).
   - Companion passenger seats in the same booking appear in slate-neutral tones showing their initials (e.g. `PS`, `AS`).
4. **Synchronized Dropdown & Matrix**:
   - Selecting a seat in the **Quick-Pick Dropdown** immediately updates the active passenger's assignment and highlights the seat on the top-down fuselage canvas.
   - Clicking a seat on the **Cabin Matrix** automatically updates the dropdown's selected value. Both controls consume identical application state.

---

## 6. Seat Availability & Locking Mechanism

### Seat Availability States

| State | Visual Treatment | Description | Selectable? |
|---|---|---|:---:|
| **AVAILABLE** | Clean white fill, slate border (or gold border for Extra Legroom) | Seat is open for reservation | **Yes** |
| **OCCUPIED** | Muted slate fill, diagonal cross glyph (`✕`), cursor `not-allowed` | Pre-booked by previous flights / mock external inventory | **No** |
| **SELECTED** | Solid Jet Navy fill, golden halo ring, active traveler initials | Assigned to the currently active traveler | **Yes (re-click)** |
| **ASSIGNED** | Solid slate container, companion traveler initials | Assigned to another traveler in the current party | **No** |
| **LOCKED** | Pale amber background, amber border, padlock icon (`🔒`) | Temporarily held by another active booking session | **No** |
| **FREE** | Standard Middle seats with zero surcharge (`₹0`) | Pricing category, not an availability state | **Yes** |

### Simulated Seat Locking with `localStorage`

To satisfy real-world airline reservation requirements without a live backend:

1. **Lock Data Structure**:
   ```typescript
   interface SeatLock {
     seatId: string;       // e.g. "2A"
     sessionId: string;    // Unique tab/browser session identifier
     bookingId: string;    // Booking reference e.g. "ALX-9821-DEL"
     lockedAt: number;     // Unix timestamp (ms)
     expiresAt: number;    // Unix timestamp (ms) - 10 minute lease
     status: 'LOCKED';
   }
   ```
2. **Lock Lifecycle**:
   - **Acquisition**: When a seat is selected or when the user proceeds to the summary, `acquireLocks()` creates a temporary 10-minute hold.
   - **Validation**: Before assigning a seat, the system verifies `expiresAt > Date.now()` and ensures `lock.sessionId === currentSessionId`.
   - **Cross-Tab Synchronization**: Custom `storage` and `aeroluxe_locks_updated` event listeners instantly refresh the seat matrix across open browser tabs.
   - **Pruning**: Periodic sweepers run every 5 seconds and on state access to automatically purge expired locks.
   - **Release**: Explicit passenger removal or booking cancellation triggers `releaseSessionLocks()`, returning the held seats back to the open inventory.
3. **Built-in Evaluator Simulator Drawer**:
   - Click the **"Lock Simulator"** button in the navigation header to open the evaluation drawer.
   - Enter any seat coordinate (or click preset buttons such as `2B`, `3B`, `5A`, `8B`) to simulate an external user locking that seat.
   - Watch the seat on the canvas turn into the locked/held state in real time!

> **Technical Limitation Notice**: While `localStorage` provides single-browser multi-tab synchronization suitable for frontend assessment evaluation, it cannot deliver distributed concurrency across disparate physical devices. In a production environment, this module is designed to be swapped for atomic Redis distributed locks (`SET key val NX EX 600`) and WebSocket server-sent event channels.

---

## 7. Pricing Calculation System

Pricing is calculated purely through derived functional selectors using `useMemo`:

$$\text{Grand Total} = \text{Base Airfare} + \text{Cabin Surcharge} + \sum \text{Seat Charges} + \sum \text{Meal Charges} + \text{Taxes}$$

- **Base Fare**: ₹4,850 per traveler (3 travelers = ₹14,550)
- **Seat Charges**:
  - Extra Legroom (Rows 1 & 6 Exit Rows): ₹350
  - Standard Window / Preferred: ₹150
  - Standard Aisle: ₹100
  - Standard Middle: Free (₹0)
- **Taxes & Aviation Surcharges**: ₹1,880
- **Dynamic Recalculation**: Changing from a ₹150 seat to a Free (₹0) middle seat recalculates the total instantly to ₹16,530. Changing to an Extra Legroom seat (₹350) updates the total to ₹16,880.

---

## 8. How to Run the Project Locally

### Prerequisites
- Node.js version 18.0 or newer
- `pnpm` (or `npm`)

### Installation & Execution

```bash
# 1. Install dependencies
pnpm install

# 2. Run automated logic & locking test suite
pnpm test

# 3. Start local development server
pnpm run dev
```

Visit `http://localhost:3000` (or the port indicated in the terminal) to test the application.

### Production Build

```bash
# Build optimized static distribution bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## 9. Verification Checklist

The application was tested and verified across all required evaluation scenarios:

- [x] Add three default passengers and verify distinct seat assignments (`4A`, `4B`, `4C`).
- [x] Switch between passengers and confirm previously assigned seats remain saved.
- [x] Prevent assigning the same seat to two travelers with helpful toast feedback.
- [x] Prevent selecting occupied or unavailable seats (`1C`, `1D`, `2A`, etc.).
- [x] Changing a passenger's seat releases the former seat and assigns the new one.
- [x] Removing a passenger frees their seat and clears their session lock.
- [x] Switching between expensive and free seats dynamically updates individual and grand totals.
- [x] Bi-directional synchronization between interactive cabin matrix and quick-pick dropdown.
- [x] Seat locking simulation with conflict prevention and automatic 10-minute expiry cleanup.
- [x] Switching between 3–2 and 2–3–2 configurations dynamically regenerates cabin geometry without corrupting valid seat data.
- [x] Refreshing the browser preserves draft state via local storage persistence.

