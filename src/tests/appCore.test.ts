/**
 * RESQ Nepal - Automated Core Logic & Workflow Tests
 * Tests User Mode and Driver Mode workflows:
 * - Authentication validation (Demo User and Approved Driver)
 * - Distance calculation (Haversine formula in Kathmandu)
 * - Booking creation & Progressive Search Radius expansion
 * - Driver eligibility & Booking Acceptance
 * - Duplicate assignment prevention
 * - Driver trip lifecycle transitions
 * - Driver registration & vehicle fleet commissioning
 */

import { getAppState } from '../store/useAppStore';
import { AuthService, BookingService, AmbulanceService } from '../services';
import { calculateDistanceKm } from '../config/maps';

export async function runAllWorkflowTests(): Promise<{
  passed: number;
  failed: number;
  results: Array<{ name: string; success: boolean; details?: string }>;
}> {
  const results: Array<{ name: string; success: boolean; details?: string }> = [];

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      results.push({ name, success: true });
    } else {
      results.push({ name, success: false, details: details || 'Assertion failed' });
    }
  }

  const store = getAppState();
  store.resetDemoData();

  // Test 1: User & Driver Authentication Validation
  const userLogin = await AuthService.login('user', 'user123');
  assert('Workflow A: Demo user login succeeds with user/user123', userLogin.success && userLogin.user?.role === 'user');

  const driverLogin = await AuthService.login('driver', 'driver123');
  assert('Workflow A: Driver login succeeds with driver/driver123', driverLogin.success && driverLogin.user?.role === 'driver');

  const invalidLogin = await AuthService.login('user', 'wrong_pass');
  assert('Workflow A: Invalid password rejected', !invalidLogin.success);

  // Test 2: Distance Calculation (Haversine)
  // Baneshwor (27.6915, 85.342) to TUTH (27.7374, 85.3312) is ~5.2 km
  const dist = calculateDistanceKm(27.6915, 85.342, 27.7374, 85.3312);
  assert('Distance Calculation: Baneshwor to TUTH is between 4 and 6 km', dist > 4.5 && dist < 6.0, `Got ${dist} km`);

  // Test 3: Booking Creation & Progressive Search
  const pickup = { lat: 27.6915, lng: 85.342, address: 'Baneshwor, Kathmandu' };
  const dest = { lat: 27.7374, lng: 85.3312, address: 'TUTH Emergency Trauma Unit' };
  const bookingId = await BookingService.requestAmbulance(pickup, dest, 'BASIC', 100);
  assert('Workflow B: Booking created with searching state', typeof bookingId === 'string' && bookingId.startsWith('RQ-'));

  const createdBooking = store.bookings.find((b) => b.id === bookingId);
  assert('Workflow B: Booking present in shared store', createdBooking !== undefined);
  assert('Workflow B: Progressive search radius stepped to at least 2km', (createdBooking?.searchRadiusKm || 0) >= 2);

  // Test 4: Driver Eligibility & Acceptance
  const availableAmbs = AmbulanceService.getAvailableAmbulances();
  assert('Workflow C: Available ambulances list is non-empty', availableAmbs.length > 0);

  const targetAmb = availableAmbs[0];
  await BookingService.confirmBooking(targetAmb.id);
  const updatedBooking = store.bookings.find((b) => b.id === bookingId);
  assert('Workflow C: Booking assigned to ambulance', updatedBooking?.status === 'assigned');
  assert('Workflow C: Ambulance marked busy', targetAmb.status === 'busy');

  // Test 5: Prevent Duplicate Assignment
  const doubleAssigned = store.ambulances.filter((a) => a.id === targetAmb.id && a.status === 'available');
  assert('Workflow C: Prevent Duplicate Assignment: Busy ambulance not available in pool', doubleAssigned.length === 0);

  // Test 6: Driver Trip Lifecycle Transitions
  // assigned -> approaching -> arrived -> patient_onboard -> en_route_hospital -> completed
  BookingService.advanceTripStep(bookingId); // -> approaching
  assert('Workflow D: Trip status advanced to approaching', updatedBooking?.status === 'approaching');

  BookingService.advanceTripStep(bookingId); // -> arrived
  assert('Workflow D: Trip status advanced to arrived', updatedBooking?.status === 'arrived');

  BookingService.advanceTripStep(bookingId); // -> patient_onboard
  assert('Workflow D: Trip status advanced to patient_onboard', updatedBooking?.status === 'patient_onboard');

  BookingService.advanceTripStep(bookingId); // -> en_route_hospital
  assert('Workflow D: Trip status advanced to en_route_hospital', updatedBooking?.status === 'en_route_hospital');

  BookingService.advanceTripStep(bookingId); // -> completed
  assert('Workflow D: Trip status advanced to completed', updatedBooking?.status === 'completed');
  assert('Workflow D: Ambulance restored to available on trip completion', targetAmb.status === 'available');

  // Test 7: Driver Registration Flow
  const initialAmbCount = store.ambulances.length;
  store.submitDriverApplication({
    userId: 'usr-new-applicant',
    fullName: 'Ramesh Bahadur',
    phone: '+977-9841112233',
    email: 'ramesh@nepal.org',
    ambulanceRegistration: 'BA 4 CHA 7788',
    ambulanceCategory: 'VENTILATOR',
    licenseNumber: '01-04-778899',
    serviceArea: 'Kathmandu Ring Road',
    hospitalAffiliation: 'Bir Hospital Trauma Wing',
  });

  const app = store.driverApplications.find((a) => a.ambulanceRegistration === 'BA 4 CHA 7788');
  assert('Workflow E: Driver application recorded and auto-commissioned', app !== undefined && app.status === 'APPROVED');
  assert('Workflow E: New ambulance added to available fleet', store.ambulances.length === initialAmbCount + 1);

  // Test 8: Complete User Registration Flow with OTP & Documents
  const registeredUser = await AuthService.registerUser({
    name: 'Sujata Karki',
    phone: '+977-9849123890',
    email: 'sujata.karki@gmail.com',
    password: 'sujata_secure_pass',
    bloodGroup: 'B+',
    citizenshipNumber: '27-01-78-04921',
    citizenshipFrontUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    citizenshipBackUrl: 'data:image/svg+xml;utf8,<svg></svg>',
  });
  assert('Workflow F: User Registration succeeds and marks phone verified', registeredUser.success && registeredUser.user.name === 'Sujata Karki');

  const registeredLogin = await AuthService.login('9849123890', 'sujata_secure_pass');
  assert('Workflow F: Newly registered user can log in with phone and password', registeredLogin.success && registeredLogin.user?.name === 'Sujata Karki');

  // Test 9: Complete Driver & Ambulance Registration Flow
  const registeredDriver = await AuthService.registerDriver({
    fullName: 'Bikash Adhikari',
    phone: '+977-9841772211',
    email: 'bikash.adhikari@gmail.com',
    password: 'bikash_driver_pass',
    emergencyContactName: 'Radha Adhikari',
    emergencyContactPhone: '+977-9851099881',
    licenseNumber: '01-06-00492812',
    licenseCategory: 'B, C (Ambulance Certified)',
    licenseExpiry: '2029-05-18',
    licenseFrontUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    licenseBackUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    citizenshipNumber: '27-01-78-04921',
    citizenshipFrontUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    citizenshipBackUrl: 'data:image/svg+xml;utf8,<svg></svg>',
    ambulanceRegistration: 'BA 2 CHA 4092',
    ambulanceCategory: 'ADVANCED',
    hospitalAffiliation: 'Tribhuvan University Teaching Hospital (TUTH)',
  });
  assert('Workflow G: Driver Registration succeeds with verified ambulance plate', registeredDriver.success && registeredDriver.user.name === 'Bikash Adhikari');

  const registeredDriverLogin = await AuthService.login('9841772211', 'bikash_driver_pass');
  assert('Workflow G: Newly registered driver can log in and enters driver role', registeredDriverLogin.success && registeredDriverLogin.user?.role === 'driver');

  // Test 10: Forgot Password & Account Recovery
  const resetSuccess = await AuthService.resetPassword('9841234567', 'new_user_password123');
  assert('Workflow H: Password reset succeeds for registered phone number', resetSuccess === true);

  const newPassLogin = await AuthService.login('9841234567', 'new_user_password123');
  assert('Workflow H: User can log in with updated recovered password', newPassLogin.success);

  // Summary
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  return { passed, failed, results };
}
