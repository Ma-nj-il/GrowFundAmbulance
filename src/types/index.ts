/**
 * RESQ Nepal - Domain Types & Data Contracts
 * Supports User, Driver, Ambulance, Booking Lifecycle, and Admin operations.
 */

export type UserRole = 'user' | 'driver';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  rating: number;
  totalTrips: number;
  avatarUrl?: string;
  isDriverApproved?: boolean;
  bloodGroup?: string;
  citizenshipNumber?: string;
  citizenshipFrontUrl?: string;
  citizenshipBackUrl?: string;
  isPhoneVerified?: boolean;
}

export type AmbulanceCategory = 'BASIC' | 'ADVANCED' | 'VENTILATOR';

export interface AmbulanceTypeConfig {
  id: AmbulanceCategory;
  name: string;
  nepaliName: string;
  badgeTitle: string;
  subtitle: string;
  description: string;
  baseFareNpr: number;
  perKmRateNpr: number;
  estimatedArrivalMin: string;
  iconType: 'basic' | 'advanced' | 'ventilator';
  features: string[];
}

export type VehicleStatus = 'available' | 'busy' | 'offline' | 'maintenance';

export interface Ambulance {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string; // e.g. Ba 1 Jha 9021 or Ba 2 Pa 4455
  category: AmbulanceCategory;
  model: string;
  status: VehicleStatus;
  currentLat: number;
  currentLng: number;
  heading?: number;
  hospitalAffiliation: string; // e.g. Tribhuvan University Teaching Hospital (TUTH), Bir Hospital
  equipment: string[];
  batteryPercent: number;
  isOnline: boolean;
  activeBookingId?: string | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
  address: string;
}

export type BookingStatus =
  | 'searching'
  | 'requested'
  | 'assigned'
  | 'approaching'
  | 'arrived'
  | 'patient_onboard'
  | 'en_route_hospital'
  | 'completed'
  | 'cancelled';

export interface BookingEvent {
  status: BookingStatus;
  timestamp: string;
  note: string;
}

export interface Booking {
  id: string; // e.g. RQ-SAMPLE-0421 or RESQ-KTM-8942
  userId: string;
  userName: string;
  userPhone: string;
  pickup: Coordinates;
  destination?: Coordinates;
  category: AmbulanceCategory;
  fareNpr: number;
  searchRadiusKm: number; // progressive radius: 2, 5, 10, 15, 20
  assignedAmbulanceId?: string | null;
  assignedDriverId?: string | null;
  assignedDriverName?: string | null;
  assignedDriverPhone?: string | null;
  assignedVehiclePlate?: string | null;
  status: BookingStatus;
  urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
  events: BookingEvent[];
  cancellationReason?: string;
  patientNotes?: string;
  demoSimulationStep?: number; // 0 to 10 for simulated route movement
}

export interface DriverApplication {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  ambulanceRegistration: string;
  ambulanceCategory: AmbulanceCategory;
  licenseNumber: string;
  serviceArea: string;
  hospitalAffiliation: string;
  licenseCategory?: string;
  licenseExpiry?: string;
  licenseFrontUrl?: string;
  licenseBackUrl?: string;
  citizenshipNumber?: string;
  citizenshipFrontUrl?: string;
  citizenshipBackUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface SavedPlace {
  id: string;
  type: 'home' | 'work' | 'custom';
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'system' | 'emergency';
}

export interface AppSettings {
  language: 'en' | 'ne'; // English or Nepali
  appearance: 'system' | 'light' | 'dark';
  distanceUnits: 'Kilometres' | 'Miles';
  showLocationToDriver: boolean;
  hapticFeedback: boolean;
  emergencySirensEnabled: boolean;
}
