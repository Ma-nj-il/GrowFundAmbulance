# RESQ Nepal — React Native Ambulance Booking & Fleet System

**RESQ Nepal** is a complete, fully functional mobile application for emergency ambulance dispatch, tracking, and driver operations across Kathmandu Valley and Nepal. It is built strictly to reproduce the provided design reference screenshots with high fidelity.

---

## 1. Screenshot-to-Screen Inventory & Architecture

Every screen from the reference screenshots is implemented as an interactive component:

| Reference Screenshot | Screen Component | Key Features & Layout Details |
|---|---|---|
| **Screenshot 1 (Step 01 - Find)** | `LiveTrackingScreen.tsx` | Route preview banner, interactive map with red route line, floating "AMBULANCE ASSIGNED" card (green text), 4-step progress bar, call EMT button, vehicle plate `Ba 1 Cha 9021`. |
| **Screenshot 1 (Step 02 - Request)** | `RequestAmbulanceModal.tsx` | Red emergency cross header, interactive Kathmandu map, Pickup address `Baneshwor, Kathmandu`, Destination hospital picker, 3 Ambulance Type cards (`Basic`, `Advanced`, `Ventilator`), and `"Send request ->"` primary action button. |
| **Screenshot 1 (Step 03 - Follow)** | `LiveTrackingScreen.tsx` (Details Tab) | Dark card `REQUEST RQ-SAMPLE-0421` (Baneshwor -> Partner hospital), timeline checklist with green checkmarks (`Request received`, `Ambulance assigned`, `Arrived at pickup`, `Trip completed`), and previous completed trips list. |
| **Screenshot 2 (Bilingual Medi-Ambulance)** | `UserHomeScreen.tsx` (Light Mode) | Top bar `मेडि-एम्बुलेन्स`, Hero Call Emergency Ambulance card (`आपतकालीन एम्बुलेन्स बोलाउनुहोस्`), 4 Action Tiles (`नजिकैको अस्पताल`, `मेरो यात्राहरू`, `आपतकालीन सम्पर्कहरू`, `सहयोग`), Services (`रु. १००`, `रु. २००`), Recent rides, and 4 Bottom tabs (`गृह`, `इतिहास`, `प्रोफाइल`, `सहयोग`). |
| **Screenshot 3 (Dark City Booking)** | `UserHomeScreen.tsx` (Dark Mode) | Dark Kathmandu street map (Chunikhel Marg, Karuna Hospital), Pickup point tooltip pin, vehicle category selector tabs, `"Where to & for how much?"` search bar, recent destinations (`Thulo Kharibot`, `Nabil Bank`, `Yamaha Showroom`, `Airport`). |
| **Screenshot 4 (Safety)** | `SafetyScreen.tsx` | Top actions (`Support`, `Emergency contacts`), prominent red **`Call 100`** button (Nepal Police Emergency SOS), and 5 protection cards with lime-green badges (`Proactive safety support`, `Drivers verification`, `Protecting privacy`, `Staying safe`, `Accidents: Steps to take`). |
| **Screenshot 5 (Searching for Drivers)** | `SearchRadiusOverlay.tsx` | Map with expanding progressive radar rings, countdown timer `1:56`, `"All drivers verified"`, animated progress bar, fare negotiation controls `[-] NPR 71 [+]`, auto-accept toggle, and progressive 2km -> 5km -> 10km -> 15km -> 20km matching. |
| **Screenshot 6 (Order History)** | `OrderHistoryScreen.tsx` | Filter pills (`All`, `City rides`, `Delivery`), grouped dates (`24 Sep`, `10 Sep`, `25 May`), vehicle thumbnail icons, Kathmandu route locations, and NPR fare amounts. |
| **Screenshot 7 (Saved Places)** | `SavedPlacesScreen.tsx` | `Save as Home`, `Save as Work`, `Another name` with interactive add/remove modal. |
| **Screenshot 8 (Notifications)** | `NotificationsScreen.tsx` | High-fidelity lime-green UFO beam graphic, `"You are all up to date"`, `"No new notifications — come back soon"`. |
| **Screenshot 9 (App Settings)** | `AppSettingsScreen.tsx` | `Appearance`, `Distance units`, `Language`, `Show location to driver`, `Legal documents`, `App version (5.187.0)`, `Delete account`, and deep-blue `"Some settings moved"` banner. |
| **Screenshots 10 & 11 (Help & Support)** | `SupportScreen.tsx` | Topics (`Service standards`, `Drivers do not respond`, `How to leave review`, `How to complain`, `Lost belongings`), and live interactive Technical Support Chat. |
| **Screenshot 12 (Driver Profile & Mode)** | `DriverHomeScreen.tsx` | User avatar `Manjil`, `Wallet`, `My vehicles` (`Ambulance`), `My status`, `"How do you want to get income with us?"` (`City driver`, `Courier`, `City to City driver`), Online/Offline toggle, and incoming dispatch requests with sound & Accept/Decline actions. |
| **Side Drawer (Screenshot WhatsApp 17.55.11)** | `SideDrawer.tsx` | User `Manjil ★★★★★ 4.76 (194)`, navigation list, iconic lime-green high-contrast **`Driver mode`** mode-switch button, social links. |
| **Admin Operations** | `AdminDashboard.tsx` | Fleet management, reviewing and approving driver applications, dispatch audit logs, and system metrics. |

---

## 2. Demo Credentials

The application includes local authentication with seeded accounts ready for immediate testing:

| Role | Username | Password | Notes |
|---|---|---|---|
| **Administrator** | `admin` | `admin` | Opens Admin Control Center: approve drivers, monitor fleet, inspect bookings. |
| **Demo User** | `user` | `user123` | Logged in as **Manjil** (4.76 rating, 194 trips). User mode booking flow. |
| **Approved Driver** | `driver` | `driver123` | Logged in as **Hari Sundar Shrestha** (Ambulance Ba 1 Jha 9021, ALS). Driver mode flow. |

> **Note:** The top demo toolbar also provides **one-click login buttons** for instant testing without typing.

---

## 3. Progressive Ambulance Search Radius

The matching algorithm implements progressive expanding circular radar steps:
1. **2 km**: Initial local search radius.
2. **5 km**: Expands if no available ambulance is within 2 km.
3. **10 km**: City district radius.
4. **15 km**: Outer ring road radius.
5. **20 km (Maximum)**: Kathmandu Valley wide search.

During the search, the map visualizes concentric animated radar circles. If ambulances are found, matching candidates are presented with distance in kilometers calculated via the Haversine geographic formula.

---

## 4. Google Maps API Configuration

Configuration is centralized in `src/config/maps.ts` and `.env.example`:

```bash
# In .env:
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID="YOUR_MAP_ID"
```

### Application Restrictions for Production:
Mobile application API keys are bundled into mobile client binaries and must be restricted in Google Cloud Console:
- **Android Restrictions**: Restrict by package name `com.resqnepal.app` and SHA-1 certificate fingerprint.
- **iOS Restrictions**: Restrict by iOS bundle identifier `com.resqnepal.app`.
- **API Restrictions**: Enable only `Maps SDK for Android`, `Maps SDK for iOS`, `Places API`, and `Routes API`.

### Demo Fallback Mode:
When no Google Maps API key is configured, the application **automatically uses the interactive Leaflet / OpenStreetMap engine** centered on Kathmandu with custom SVG ambulance pins, route polylines, and live simulated movement. It never displays a blank screen or broken map.

---

## 5. Running the Application

### A. Web Preview & Interactive Simulator (Current Environment)
The application runs directly in your browser with hot module reload:
```bash
npm run dev
```
Open `http://localhost:3000` to interact with the device simulator. You can toggle between iPhone 16 Pro bezel frame and full-screen view.

### B. Running Native Mobile App on Android / iOS via Expo
The complete Expo mobile project is provided in `src/native/`. To run on a physical Android/iOS phone or simulator:

```bash
# 1. Navigate to the native directory
cd src/native

# 2. Install native dependencies
npx expo install react-native-maps expo-location

# 3. Start Expo development server
npx expo start

# 4. Open with Expo Go or run development build:
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Scan QR code with Expo Go app on physical device
```

---

## 6. Future Backend Integration Guide

The codebase uses a clean service abstraction layer (`src/services/`):
- `AuthService`
- `BookingService`
- `DriverService`
- `AmbulanceService`
- `LocationService`

To connect your existing backend:
1. Replace the local Zustand updates in `src/services/index.ts` with your API client (e.g. `axios` or `fetch` calling your REST / GraphQL endpoints).
2. For real-time live GPS tracking and incoming driver dispatches, connect a WebSocket / Socket.io client to replace `generateRoutePoints()` in `src/config/maps.ts`.
3. The UI components will function identically without any refactoring because they depend solely on the service interfaces and data contracts in `src/types/index.ts`.
