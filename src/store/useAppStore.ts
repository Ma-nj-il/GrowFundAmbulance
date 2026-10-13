/**
 * RESQ Nepal - Central Zustand Shared Store with Local Persistence
 * Coordinates state seamlessly across User Mode, Driver Mode, and Admin Mode.
 */

import {
  Ambulance,
  AppSettings,
  Booking,
  BookingStatus,
  Coordinates,
  DriverApplication,
  SavedPlace,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_SAVED_PLACES,
  SEEDED_AMBULANCES,
  SEEDED_USERS,
} from '../config/constants';
import { calculateDistanceKm, MAPS_CONFIG } from '../config/maps';

const STORAGE_KEY = 'resq_nepal_v1_state';

export interface AppState {
  // Session & Identity
  currentUser: User;
  currentRole: UserRole;
  isLoggedIn: boolean;
  activeMode: 'user' | 'driver';
  uiStyle: 'light' | 'dark'; // Clean Red & White ambulance style

  // Fleet & Bookings
  ambulances: Ambulance[];
  bookings: Booking[];
  activeBookingId: string | null;
  driverApplications: DriverApplication[];
  savedPlaces: SavedPlace[];
  settings: AppSettings;

  // Progressive Search
  isSearching: boolean;
  currentSearchRadiusKm: number;
  searchCountdownSec: number;
  matchedAmbulances: Ambulance[];

  // Live Simulated GPS Tracking
  isSimulating: boolean;

  // Methods
  login: (username: string, passwordHash: string) => boolean;
  logout: () => void;
  switchMode: (mode: 'user' | 'driver') => void;
  setUiStyle: (style: 'light' | 'dark') => void;
  updateSettings: (partial: Partial<AppSettings>) => void;

  // Booking Flow
  startProgressiveSearch: (
    pickup: Coordinates,
    destination?: Coordinates,
    category?: Ambulance['category'],
    offerFare?: number
  ) => Promise<string>;
  cancelSearch: () => void;
  confirmBookingWithAmbulance: (ambulanceId: string) => void;
  cancelActiveBooking: (reason: string) => void;
  advanceTripStep: (bookingId: string) => void;

  // Driver Workflow
  driverSetOnline: (isOnline: boolean) => void;
  driverAcceptBooking: (bookingId: string) => void;
  driverRejectBooking: (bookingId: string) => void;

  // Driver Application Flow
  submitDriverApplication: (
    app: Omit<DriverApplication, 'id' | 'status' | 'submittedAt'>
  ) => void;

  // Authentication & Registration
  registerUserAccount: (userData: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    bloodGroup?: string;
    citizenshipNumber?: string;
    citizenshipFrontUrl?: string;
    citizenshipBackUrl?: string;
  }) => User;
  registerDriverAccount: (driverData: {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    licenseNumber: string;
    licenseCategory?: string;
    licenseExpiry?: string;
    licenseFrontUrl?: string;
    licenseBackUrl?: string;
    citizenshipNumber?: string;
    citizenshipFrontUrl?: string;
    citizenshipBackUrl?: string;
    ambulanceRegistration: string;
    ambulanceCategory: Ambulance['category'];
    hospitalAffiliation: string;
    serviceArea?: string;
  }) => User;
  resetPasswordByPhone: (phone: string, newPassword: string) => boolean;

  // Saved Places & Reset
  addSavedPlace: (place: Omit<SavedPlace, 'id'>) => void;
  deleteSavedPlace: (id: string) => void;
  resetDemoData: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  appearance: 'system',
  distanceUnits: 'Kilometres',
  showLocationToDriver: true,
  hapticFeedback: true,
  emergencySirensEnabled: true,
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'RQ-SAMPLE-0421',
    userId: 'usr-manjil',
    userName: 'Manjil',
    userPhone: '+977-9841234567',
    pickup: {
      lat: 27.6915,
      lng: 85.342,
      address: 'Baneshwor, Kathmandu',
    },
    destination: {
      lat: 27.7374,
      lng: 85.3312,
      address: 'Tribhuvan University Teaching Hospital (TUTH)',
    },
    category: 'BASIC',
    fareNpr: 175,
    searchRadiusKm: 2,
    assignedAmbulanceId: 'amb-1',
    assignedDriverId: 'usr-driver-hari',
    assignedDriverName: 'Hari Sundar Shrestha',
    assignedDriverPhone: '+977-9841883391',
    assignedVehiclePlate: 'Ba 1 Jha 9021',
    status: 'approaching',
    urgency: 'HIGH',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    events: [
      { status: 'requested', timestamp: '17:40', note: 'Request received' },
      { status: 'assigned', timestamp: '17:42', note: 'Ambulance assigned' },
      { status: 'approaching', timestamp: '17:44', note: 'On the way to pickup' },
    ],
    demoSimulationStep: 3,
  },
  {
    id: 'RQ-HIST-001',
    userId: 'usr-manjil',
    userName: 'Manjil',
    userPhone: '+977-9841234567',
    pickup: { lat: 27.7055, lng: 85.3135, address: 'Maharajgunj Sadak, Kathmandu' },
    destination: { lat: 27.7082, lng: 85.3168, address: 'Bir Hospital, Kathmandu' },
    category: 'BASIC',
    fareNpr: 146,
    searchRadiusKm: 2,
    status: 'completed',
    urgency: 'NORMAL',
    assignedVehiclePlate: 'Ba 2 Cha 8812',
    assignedDriverName: 'Dinesh Lama',
    createdAt: '2026-09-24T10:29:00Z',
    updatedAt: '2026-09-24T10:55:00Z',
    events: [{ status: 'completed', timestamp: '10:55 AM', note: 'Trip completed safely at Bir Hospital' }],
  },
  {
    id: 'RQ-HIST-002',
    userId: 'usr-manjil',
    userName: 'Manjil',
    userPhone: '+977-9841234567',
    pickup: { lat: 27.741, lng: 85.362, address: 'Chunikhel Marg (Kapan)' },
    destination: { lat: 27.6685, lng: 85.3218, address: 'Patan Hospital, Lagankhel' },
    category: 'ADVANCED',
    fareNpr: 454,
    searchRadiusKm: 5,
    status: 'completed',
    urgency: 'HIGH',
    assignedVehiclePlate: 'Ba 3 Cha 1109',
    assignedDriverName: 'Balaram KC',
    createdAt: '2026-09-10T15:31:00Z',
    updatedAt: '2026-09-10T16:15:00Z',
    events: [{ status: 'completed', timestamp: '04:15 PM', note: 'Patient admitted to Patan Emergency' }],
  },
];

const INITIAL_APPLICATIONS: DriverApplication[] = [
  {
    id: 'APP-101',
    userId: 'usr-subash',
    fullName: 'Subash Tamang',
    phone: '+977-9841998822',
    email: 'subash@gmail.com',
    ambulanceRegistration: 'Ba 2 Pa 9904',
    ambulanceCategory: 'VENTILATOR',
    licenseNumber: '01-04-984102',
    serviceArea: 'Kathmandu Metro & Ring Road',
    hospitalAffiliation: 'Civil Service Hospital, Minbhawan',
    status: 'PENDING',
    submittedAt: '2026-10-12T09:30:00Z',
  },
];

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

// Helper to load persisted state or fallback
function loadSavedState() {
  try {
    const storage = getStorage();
    const raw = storage ? storage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading stored state:', err);
  }
  return null;
}

type Listener = () => void;
const listeners = new Set<Listener>();

let registeredAccounts: Array<{ user: User; passwordHash: string }> = (() => {
  const saved = loadSavedState();
  return (saved?.registeredAccounts || []) as Array<{ user: User; passwordHash: string }>;
})();

let state: AppState = (() => {
  const saved = loadSavedState();
  const defaultUser = SEEDED_USERS.user.user;

  return {
    currentUser: saved?.currentUser || defaultUser,
    currentRole: saved?.currentRole || 'user',
    isLoggedIn: true,
    activeMode: saved?.activeMode || 'user',
    uiStyle: saved?.uiStyle || 'light', // Emergency Red & White RESQ Nepal branding
    ambulances: saved?.ambulances || SEEDED_AMBULANCES,
    bookings: saved?.bookings || INITIAL_BOOKINGS,
    activeBookingId: saved?.activeBookingId !== undefined ? saved.activeBookingId : 'RQ-SAMPLE-0421',
    driverApplications: saved?.driverApplications || INITIAL_APPLICATIONS,
    savedPlaces: saved?.savedPlaces || INITIAL_SAVED_PLACES,
    settings: saved?.settings || DEFAULT_SETTINGS,
    isSearching: false,
    currentSearchRadiusKm: 2,
    searchCountdownSec: 116,
    matchedAmbulances: [],
    isSimulating: false,

    login: (identifier, password) => {
      const cleanInput = identifier.trim().toLowerCase();
      const digitsOnly = identifier.replace(/[\s\-\(\)\+]/g, '').replace(/^977/, '');

      // 1. Direct key match (e.g. 'user' or 'driver')
      if (SEEDED_USERS[cleanInput] && SEEDED_USERS[cleanInput].passwordHash === password) {
        const record = SEEDED_USERS[cleanInput];
        state.currentUser = record.user;
        state.currentRole = record.user.role;
        state.activeMode = record.user.role === 'driver' ? 'driver' : 'user';
        state.isLoggedIn = true;
        saveAndNotify();
        return true;
      }

      // 2. Phone match on seeded users
      for (const key of Object.keys(SEEDED_USERS)) {
        const rec = SEEDED_USERS[key];
        const recDigits = rec.user.phone.replace(/[\s\-\(\)\+]/g, '').replace(/^977/, '');
        if ((recDigits === digitsOnly || rec.user.email.toLowerCase() === cleanInput) && rec.passwordHash === password) {
          state.currentUser = rec.user;
          state.currentRole = rec.user.role;
          state.activeMode = rec.user.role === 'driver' ? 'driver' : 'user';
          state.isLoggedIn = true;
          saveAndNotify();
          return true;
        }
      }

      // 3. Registered accounts
      const found = registeredAccounts.find((item) => {
        const itemDigits = item.user.phone.replace(/[\s\-\(\)\+]/g, '').replace(/^977/, '');
        return (
          (itemDigits === digitsOnly || (item.user.email && item.user.email.toLowerCase() === cleanInput)) &&
          item.passwordHash === password
        );
      });

      if (found) {
        state.currentUser = found.user;
        state.currentRole = found.user.role;
        state.activeMode = found.user.role === 'driver' ? 'driver' : 'user';
        state.isLoggedIn = true;
        saveAndNotify();
        return true;
      }

      return false;
    },

    logout: () => {
      state.isLoggedIn = false;
      state.currentUser = {
        id: 'guest',
        name: 'Guest',
        phone: '',
        email: '',
        role: 'user',
        rating: 5,
        totalTrips: 0,
      };
      state.activeMode = 'user';
      saveAndNotify();
    },

    switchMode: (mode) => {
      state.activeMode = mode;
      if (mode === 'driver') {
        state.currentUser = SEEDED_USERS.driver.user;
        state.currentRole = 'driver';
      } else {
        state.currentUser = SEEDED_USERS.user.user;
        state.currentRole = 'user';
      }
      saveAndNotify();
    },

    setUiStyle: (style) => {
      state.uiStyle = style;
      saveAndNotify();
    },

    updateSettings: (partial) => {
      state.settings = { ...state.settings, ...partial };
      saveAndNotify();
    },

    startProgressiveSearch: async (pickup, destination, category = 'BASIC', offerFare = 100) => {
      state.isSearching = true;
      state.currentSearchRadiusKm = 2;
      state.searchCountdownSec = 116;
      state.matchedAmbulances = [];

      const bookingId = `RQ-RESQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        id: bookingId,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        userPhone: state.currentUser.phone,
        pickup,
        destination: destination || {
          lat: 27.7374,
          lng: 85.3312,
          address: 'TUTH Emergency Trauma Center, Maharajgunj',
        },
        category,
        fareNpr: offerFare,
        searchRadiusKm: 2,
        status: 'searching',
        urgency: 'HIGH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        events: [{ status: 'searching', timestamp: 'Just now', note: 'Searching for ambulances within 2 km...' }],
        demoSimulationStep: 0,
      };

      state.bookings.unshift(newBooking);
      state.activeBookingId = bookingId;
      saveAndNotify();

      // Progressive Radius Search Execution
      const radiusSteps = MAPS_CONFIG.searchRadiusStepsKm; // [2, 5, 10, 15, 20]
      for (const radius of radiusSteps) {
        if (!state.isSearching) break;

        state.currentSearchRadiusKm = radius;
        newBooking.searchRadiusKm = radius;

        // Find available demo ambulances inside this radius
        const eligible = state.ambulances.filter((amb) => {
          if (!amb.isOnline || amb.status !== 'available') return false;
          if (category && amb.category !== category) return false;
          const dist = calculateDistanceKm(pickup.lat, pickup.lng, amb.currentLat, amb.currentLng);
          return dist <= radius;
        });

        if (eligible.length > 0) {
          state.matchedAmbulances = eligible;
          newBooking.events.push({
            status: 'searching',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            note: `${eligible.length} eligible ambulance(s) found within ${radius} km.`,
          });
          saveAndNotify();
          break;
        } else {
          newBooking.events.push({
            status: 'searching',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            note: `No available ambulance in ${radius} km. Expanding search radius...`,
          });
          saveAndNotify();
          // Pause for simulated radius expansion effect
          await new Promise((r) => setTimeout(r, 1400));
        }
      }

      return bookingId;
    },

    cancelSearch: () => {
      state.isSearching = false;
      if (state.activeBookingId) {
        const bk = state.bookings.find((b) => b.id === state.activeBookingId);
        if (bk && bk.status === 'searching') {
          bk.status = 'cancelled';
          bk.cancellationReason = 'User cancelled search';
          bk.events.push({
            status: 'cancelled',
            timestamp: new Date().toLocaleTimeString(),
            note: 'Search cancelled by user',
          });
          state.activeBookingId = null;
        }
      }
      saveAndNotify();
    },

    confirmBookingWithAmbulance: (ambulanceId) => {
      state.isSearching = false;
      const targetAmb = state.ambulances.find((a) => a.id === ambulanceId);
      const activeBooking = state.bookings.find((b) => b.id === state.activeBookingId);

      if (targetAmb && activeBooking) {
        targetAmb.status = 'busy';
        targetAmb.activeBookingId = activeBooking.id;

        activeBooking.status = 'assigned';
        activeBooking.assignedAmbulanceId = targetAmb.id;
        activeBooking.assignedDriverId = targetAmb.driverId;
        activeBooking.assignedDriverName = targetAmb.driverName;
        activeBooking.assignedDriverPhone = targetAmb.driverPhone;
        activeBooking.assignedVehiclePlate = targetAmb.vehiclePlate;
        activeBooking.updatedAt = new Date().toISOString();
        activeBooking.events.push({
          status: 'assigned',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Ambulance assigned: ${targetAmb.vehiclePlate} (${targetAmb.driverName})`,
        });

        saveAndNotify();
      }
    },

    cancelActiveBooking: (reason) => {
      if (state.activeBookingId) {
        const bk = state.bookings.find((b) => b.id === state.activeBookingId);
        if (bk) {
          bk.status = 'cancelled';
          bk.cancellationReason = reason;
          bk.events.push({
            status: 'cancelled',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: `Cancelled: ${reason}`,
          });

          // Free assigned ambulance
          if (bk.assignedAmbulanceId) {
            const amb = state.ambulances.find((a) => a.id === bk.assignedAmbulanceId);
            if (amb) {
              amb.status = 'available';
              amb.activeBookingId = null;
            }
          }
        }
        state.activeBookingId = null;
        saveAndNotify();
      }
    },

    advanceTripStep: (bookingId) => {
      const bk = state.bookings.find((b) => b.id === bookingId);
      if (!bk) return;

      const order: BookingStatus[] = [
        'assigned',
        'approaching',
        'arrived',
        'patient_onboard',
        'en_route_hospital',
        'completed',
      ];
      const curIndex = order.indexOf(bk.status);
      if (curIndex >= 0 && curIndex < order.length - 1) {
        const nextStatus = order[curIndex + 1];
        bk.status = nextStatus;
        bk.demoSimulationStep = Math.min(10, (bk.demoSimulationStep || 0) + 2);
        bk.updatedAt = new Date().toISOString();

        const statusLabels: Record<BookingStatus, string> = {
          searching: 'Searching for ambulance',
          requested: 'Request received',
          assigned: 'Ambulance assigned',
          approaching: 'On the way to pickup point',
          arrived: 'Arrived at pickup point',
          patient_onboard: 'Patient safely onboard; vital signs stabilized',
          en_route_hospital: 'En route to receiving emergency hospital',
          completed: 'Trip completed; handover to ER team',
          cancelled: 'Booking cancelled',
        };

        bk.events.push({
          status: nextStatus,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: statusLabels[nextStatus],
        });

        // If completed, release vehicle
        if (nextStatus === 'completed') {
          if (bk.assignedAmbulanceId) {
            const amb = state.ambulances.find((a) => a.id === bk.assignedAmbulanceId);
            if (amb) {
              amb.status = 'available';
              amb.activeBookingId = null;
            }
          }
        }
        saveAndNotify();
      }
    },

    driverSetOnline: (isOnline) => {
      const driverId = state.currentUser.id;
      const amb = state.ambulances.find((a) => a.driverId === driverId);
      if (amb) {
        amb.isOnline = isOnline;
        amb.status = isOnline ? 'available' : 'offline';
        saveAndNotify();
      }
    },

    driverAcceptBooking: (bookingId) => {
      const bk = state.bookings.find((b) => b.id === bookingId);
      const amb = state.ambulances.find((a) => a.driverId === state.currentUser.id) || state.ambulances[0];
      if (bk && amb) {
        amb.status = 'busy';
        amb.activeBookingId = bk.id;

        bk.status = 'approaching';
        bk.assignedAmbulanceId = amb.id;
        bk.assignedDriverId = state.currentUser.id;
        bk.assignedDriverName = state.currentUser.name;
        bk.assignedDriverPhone = state.currentUser.phone;
        bk.assignedVehiclePlate = amb.vehiclePlate;
        bk.updatedAt = new Date().toISOString();
        bk.events.push({
          status: 'approaching',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Driver ${state.currentUser.name} accepted request and is approaching pickup.`,
        });

        state.activeBookingId = bk.id;
        saveAndNotify();
      }
    },

    driverRejectBooking: (bookingId) => {
      const bk = state.bookings.find((b) => b.id === bookingId);
      if (bk) {
        bk.events.push({
          status: bk.status,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Driver ${state.currentUser.name} declined. Request remains open for other units.`,
        });
        saveAndNotify();
      }
    },

    submitDriverApplication: (appData) => {
      const newApp: DriverApplication = {
        id: `APP-${Math.floor(100 + Math.random() * 900)}`,
        ...appData,
        status: 'APPROVED',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewerNotes: 'Approved for emergency response fleet',
      };
      state.driverApplications.unshift(newApp);

      // Register new ambulance in fleet & grant driver privileges
      state.currentUser.isDriverApproved = true;
      const newAmb: Ambulance = {
        id: `amb-${Date.now()}`,
        driverId: appData.userId,
        driverName: appData.fullName,
        driverPhone: appData.phone,
        vehiclePlate: appData.ambulanceRegistration,
        category: appData.ambulanceCategory,
        model: 'Force Motors Emergency Traveller',
        status: 'available',
        currentLat: 27.712,
        currentLng: 85.325,
        hospitalAffiliation: appData.hospitalAffiliation || 'TUTH Network',
        equipment: ['Oxygen Manifold (30L)', 'Emergency Stretcher', 'Trauma Kit'],
        batteryPercent: 100,
        isOnline: true,
      };
      state.ambulances.push(newAmb);
      saveAndNotify();
    },

    addSavedPlace: (place) => {
      state.savedPlaces.push({
        id: `sp-${Date.now()}`,
        ...place,
      });
      saveAndNotify();
    },

    deleteSavedPlace: (id) => {
      state.savedPlaces = state.savedPlaces.filter((p) => p.id !== id);
      saveAndNotify();
    },

    registerUserAccount: (userData) => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        phone: userData.phone,
        email: userData.email || '',
        role: 'user',
        rating: 5.0,
        totalTrips: 0,
        bloodGroup: userData.bloodGroup,
        citizenshipNumber: userData.citizenshipNumber,
        citizenshipFrontUrl: userData.citizenshipFrontUrl,
        citizenshipBackUrl: userData.citizenshipBackUrl,
        isPhoneVerified: true,
      };
      registeredAccounts.push({ user: newUser, passwordHash: userData.password });
      state.currentUser = newUser;
      state.currentRole = 'user';
      state.activeMode = 'user';
      state.isLoggedIn = true;
      saveAndNotify();
      return newUser;
    },

    registerDriverAccount: (driverData) => {
      const newDriverUser: User = {
        id: `usr-drv-${Date.now()}`,
        name: driverData.fullName,
        phone: driverData.phone,
        email: driverData.email || '',
        role: 'driver',
        rating: 5.0,
        totalTrips: 0,
        isDriverApproved: true,
        citizenshipNumber: driverData.citizenshipNumber,
        citizenshipFrontUrl: driverData.citizenshipFrontUrl,
        citizenshipBackUrl: driverData.citizenshipBackUrl,
        isPhoneVerified: true,
      };
      registeredAccounts.push({ user: newDriverUser, passwordHash: driverData.password });

      const newApp: DriverApplication = {
        id: `APP-${Math.floor(100 + Math.random() * 900)}`,
        userId: newDriverUser.id,
        fullName: driverData.fullName,
        phone: driverData.phone,
        email: driverData.email || '',
        ambulanceRegistration: driverData.ambulanceRegistration.toUpperCase(),
        ambulanceCategory: driverData.ambulanceCategory,
        licenseNumber: driverData.licenseNumber,
        licenseCategory: driverData.licenseCategory,
        licenseExpiry: driverData.licenseExpiry,
        licenseFrontUrl: driverData.licenseFrontUrl,
        licenseBackUrl: driverData.licenseBackUrl,
        citizenshipNumber: driverData.citizenshipNumber,
        citizenshipFrontUrl: driverData.citizenshipFrontUrl,
        citizenshipBackUrl: driverData.citizenshipBackUrl,
        emergencyContactName: driverData.emergencyContactName,
        emergencyContactPhone: driverData.emergencyContactPhone,
        serviceArea: driverData.serviceArea || 'Kathmandu Valley (Ring Road & Suburbs)',
        hospitalAffiliation: driverData.hospitalAffiliation || 'Tribhuvan University Teaching Hospital (TUTH)',
        status: 'APPROVED',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewerNotes: 'EMT verified with Nepal Health Emergency Operations Center (HEOC)',
      };
      state.driverApplications.unshift(newApp);

      const newAmb: Ambulance = {
        id: `amb-${Date.now()}`,
        driverId: newDriverUser.id,
        driverName: driverData.fullName,
        driverPhone: driverData.phone,
        vehiclePlate: driverData.ambulanceRegistration.toUpperCase(),
        category: driverData.ambulanceCategory,
        model: 'Force Motors Emergency Traveller 3350',
        status: 'available',
        currentLat: 27.712,
        currentLng: 85.325,
        hospitalAffiliation: driverData.hospitalAffiliation || 'Tribhuvan University Teaching Hospital (TUTH)',
        equipment: ['Oxygen Manifold (30L)', 'Emergency Stretcher', 'Trauma Kit'],
        batteryPercent: 100,
        isOnline: true,
      };
      state.ambulances.push(newAmb);

      state.currentUser = newDriverUser;
      state.currentRole = 'driver';
      state.activeMode = 'driver';
      state.isLoggedIn = true;
      saveAndNotify();
      return newDriverUser;
    },

    resetPasswordByPhone: (phone, newPassword) => {
      const digitsOnly = phone.replace(/[\s\-\(\)\+]/g, '').replace(/^977/, '');
      for (const k of Object.keys(SEEDED_USERS)) {
        const recDigits = SEEDED_USERS[k].user.phone.replace(/[\s\-\(\)\+]/g, '').replace(/^977/, '');
        if (recDigits === digitsOnly) {
          SEEDED_USERS[k].passwordHash = newPassword;
          saveAndNotify();
          return true;
        }
      }
      const found = registeredAccounts.find((a) => {
        const itemDigits = a.user.phone.replace(/[\s\-\(\)\+]/g, '').replace(/^977/, '');
        return itemDigits === digitsOnly;
      });
      if (found) {
        found.passwordHash = newPassword;
        saveAndNotify();
        return true;
      }
      return false;
    },

    resetDemoData: () => {
      getStorage()?.removeItem(STORAGE_KEY);
      registeredAccounts = [];
      state.currentUser = SEEDED_USERS.user.user;
      state.currentRole = 'user';
      state.activeMode = 'user';
      state.uiStyle = 'light';
      state.ambulances = SEEDED_AMBULANCES;
      state.bookings = INITIAL_BOOKINGS;
      state.activeBookingId = 'RQ-SAMPLE-0421';
      state.driverApplications = INITIAL_APPLICATIONS;
      state.savedPlaces = INITIAL_SAVED_PLACES;
      state.settings = DEFAULT_SETTINGS;
      state.isSearching = false;
      state.currentSearchRadiusKm = 2;
      state.matchedAmbulances = [];
      saveAndNotify();
    },
  };
})();

function saveAndNotify() {
  try {
    const toSave = {
      currentUser: state.currentUser,
      currentRole: state.currentRole,
      activeMode: state.activeMode,
      uiStyle: state.uiStyle,
      ambulances: state.ambulances,
      bookings: state.bookings,
      activeBookingId: state.activeBookingId,
      driverApplications: state.driverApplications,
      savedPlaces: state.savedPlaces,
      settings: state.settings,
      registeredAccounts: registeredAccounts,
    };
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Storage write failure:', e);
  }
  listeners.forEach((listener) => listener());
}

// React custom hook for state binding
import { useSyncExternalStore } from 'react';

export function useAppStore(): AppState {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => state
  );
}

// Direct state accessor for service functions
export function getAppState(): AppState {
  return state;
}
