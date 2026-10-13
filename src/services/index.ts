/**
 * RESQ Nepal - Service Layer Abstraction
 * Decouples the UI from direct state manipulation, allowing effortless
 * replacement with REST / GraphQL / WebSocket backend APIs in production.
 */

import { getAppState } from '../store/useAppStore';
import { Ambulance, Booking, Coordinates, DriverApplication, User } from '../types';
import { calculateDistanceKm } from '../config/maps';

export const AuthService = {
  async login(username: string, passwordHash: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const store = getAppState();
    const ok = store.login(username, passwordHash);
    if (ok) {
      return { success: true, user: store.currentUser };
    }
    return { success: false, error: 'Invalid credentials. Use demo accounts: user/user123, driver/driver123' };
  },

  async registerUser(userData: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    bloodGroup?: string;
    citizenshipNumber?: string;
    citizenshipFrontUrl?: string;
    citizenshipBackUrl?: string;
  }): Promise<{ success: boolean; user: User }> {
    const store = getAppState();
    const user = store.registerUserAccount(userData);
    return { success: true, user };
  },

  async registerDriver(driverData: {
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
  }): Promise<{ success: boolean; user: User }> {
    const store = getAppState();
    const user = store.registerDriverAccount(driverData);
    return { success: true, user };
  },

  async resetPassword(phone: string, newPassword: string): Promise<boolean> {
    return getAppState().resetPasswordByPhone(phone, newPassword);
  },

  async logout(): Promise<void> {
    const store = getAppState();
    store.logout();
  },

  getCurrentUser(): User {
    return getAppState().currentUser;
  },
};

export const BookingService = {
  async requestAmbulance(
    pickup: Coordinates,
    destination?: Coordinates,
    category?: Ambulance['category'],
    offerFare?: number
  ): Promise<string> {
    const store = getAppState();
    return await store.startProgressiveSearch(pickup, destination, category, offerFare);
  },

  async confirmBooking(ambulanceId: string): Promise<void> {
    getAppState().confirmBookingWithAmbulance(ambulanceId);
  },

  async cancelBooking(reason: string): Promise<void> {
    getAppState().cancelActiveBooking(reason);
  },

  getActiveBooking(): Booking | null {
    const store = getAppState();
    if (!store.activeBookingId) return null;
    return store.bookings.find((b) => b.id === store.activeBookingId) || null;
  },

  getBookingHistory(userId?: string): Booking[] {
    const store = getAppState();
    if (userId) {
      return store.bookings.filter((b) => b.userId === userId);
    }
    return store.bookings;
  },

  advanceTripStep(bookingId: string): void {
    getAppState().advanceTripStep(bookingId);
  },
};

export const DriverService = {
  async toggleOnline(isOnline: boolean): Promise<void> {
    getAppState().driverSetOnline(isOnline);
  },

  async acceptBooking(bookingId: string): Promise<void> {
    getAppState().driverAcceptBooking(bookingId);
  },

  async rejectBooking(bookingId: string): Promise<void> {
    getAppState().driverRejectBooking(bookingId);
  },

  async applyAsDriver(application: Omit<DriverApplication, 'id' | 'status' | 'submittedAt'>): Promise<void> {
    getAppState().submitDriverApplication(application);
  },
};

export const AmbulanceService = {
  getAllAmbulances(): Ambulance[] {
    return getAppState().ambulances;
  },

  getAvailableAmbulances(category?: Ambulance['category']): Ambulance[] {
    const all = getAppState().ambulances;
    return all.filter((a) => a.isOnline && a.status === 'available' && (!category || a.category === category));
  },

  findNearestAmbulances(lat: number, lng: number, maxRadiusKm: number = 20): Array<{ ambulance: Ambulance; distanceKm: number }> {
    const store = getAppState();
    return store.ambulances
      .map((ambulance) => ({
        ambulance,
        distanceKm: calculateDistanceKm(lat, lng, ambulance.currentLat, ambulance.currentLng),
      }))
      .filter((item) => item.distanceKm <= maxRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },
};

export const LocationService = {
  async getCurrentPosition(): Promise<Coordinates> {
    return {
      lat: 27.6915,
      lng: 85.342,
      address: 'Baneshwor, Kathmandu, Bagmati Province',
    };
  },
};
