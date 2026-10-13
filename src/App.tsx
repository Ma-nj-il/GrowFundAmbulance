/**
 * RESQ Nepal - Main Application Root
 * Coordinates screen routing, User Mode / Driver Mode / Admin Mode switching,
 * and high-fidelity mobile simulator viewport.
 */

import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { MobileFrame } from './components/common/MobileFrame';

// User Mode Screens
import { UserHomeScreen } from './components/user/UserHomeScreen';
import { RequestAmbulanceModal } from './components/user/RequestAmbulanceModal';
import { SearchRadiusOverlay } from './components/user/SearchRadiusOverlay';
import { LiveTrackingScreen } from './components/user/LiveTrackingScreen';
import { OrderHistoryScreen } from './components/user/OrderHistoryScreen';
import { SafetyScreen } from './components/user/SafetyScreen';
import { SavedPlacesScreen } from './components/user/SavedPlacesScreen';
import { NotificationsScreen } from './components/user/NotificationsScreen';
import { AppSettingsScreen } from './components/user/AppSettingsScreen';
import { SupportScreen } from './components/user/SupportScreen';

// Driver Mode Screens
import { DriverHomeScreen } from './components/driver/DriverHomeScreen';
import { DriverTripScreen } from './components/driver/DriverTripScreen';
import { DriverRegisterModal } from './components/driver/DriverRegisterModal';
import { AuthModal } from './components/common/AuthModal';
import { AuthContainer } from './components/auth/AuthContainer';

import { Ambulance, AmbulanceCategory, Coordinates } from './types';

export default function App() {
  const {
    activeMode,
    uiStyle,
    isSearching,
    activeBookingId,
    startProgressiveSearch,
    cancelSearch,
    confirmBookingWithAmbulance,
  } = useAppStore();

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [requestInitialCategory, setRequestInitialCategory] = useState<AmbulanceCategory>('BASIC');
  const [activeDriverTripId, setActiveDriverTripId] = useState<string | null>(null);
  const [driverRegisterOpen, setDriverRegisterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Search parameters in state during live flow
  const [searchParams, setSearchParams] = useState<{
    pickup: Coordinates;
    destination?: Coordinates;
    fare: number;
  }>({
    pickup: { lat: 27.6915, lng: 85.342, address: 'Baneshwor, Kathmandu' },
    destination: { lat: 27.7374, lng: 85.3312, address: 'TUTH Emergency Trauma Unit' },
    fare: 100,
  });

  // Handle ambulance request trigger
  const handleOpenRequest = (category?: AmbulanceCategory) => {
    setRequestInitialCategory(category || 'BASIC');
    setCurrentRoute('request');
  };

  // Handle sending request -> starts progressive search
  const handleSendRequest = async (
    pickup: Coordinates,
    destination: Coordinates,
    category: AmbulanceCategory,
    fareNpr: number
  ) => {
    setSearchParams({ pickup, destination, fare: fareNpr });
    setCurrentRoute('searching');
    await startProgressiveSearch(pickup, destination, category, fareNpr);
  };

  // Handle ambulance match from search
  const handleAmbulanceMatched = (amb: Ambulance) => {
    confirmBookingWithAmbulance(amb.id);
    setCurrentRoute('tracking');
  };

  // Mode-aware screen renderer (User Mode and Driver Mode only)
  const renderScreen = () => {
    // AUTHENTICATION ROUTES (Available in all modes)
    if (currentRoute === 'auth-welcome' || currentRoute === 'welcome') {
      return (
        <AuthContainer
          initialScreen="welcome"
          onClose={() => setCurrentRoute(activeMode === 'driver' ? 'driver-home' : 'home')}
          onAuthenticated={(role) => setCurrentRoute(role === 'driver' ? 'driver-home' : 'home')}
        />
      );
    }
    if (currentRoute === 'auth-user-login' || currentRoute === 'user-login') {
      return (
        <AuthContainer
          initialScreen="user-login"
          onClose={() => setCurrentRoute('home')}
          onAuthenticated={() => setCurrentRoute('home')}
        />
      );
    }
    if (currentRoute === 'auth-user-register' || currentRoute === 'user-register') {
      return (
        <AuthContainer
          initialScreen="user-register"
          onClose={() => setCurrentRoute('home')}
          onAuthenticated={() => setCurrentRoute('home')}
        />
      );
    }
    if (currentRoute === 'auth-driver-login' || currentRoute === 'driver-login') {
      return (
        <AuthContainer
          initialScreen="driver-login"
          onClose={() => setCurrentRoute('driver-home')}
          onAuthenticated={() => setCurrentRoute('driver-home')}
        />
      );
    }
    if (currentRoute === 'auth-driver-register' || currentRoute === 'driver-register') {
      return (
        <AuthContainer
          initialScreen="driver-register"
          onClose={() => setCurrentRoute('home')}
          onAuthenticated={() => setCurrentRoute('driver-home')}
        />
      );
    }
    if (currentRoute === 'auth-forgot-password' || currentRoute === 'forgot-password') {
      return (
        <AuthContainer
          initialScreen="forgot-password"
          onClose={() => setCurrentRoute(activeMode === 'driver' ? 'driver-home' : 'home')}
          onAuthenticated={() => setCurrentRoute(activeMode === 'driver' ? 'driver-home' : 'home')}
        />
      );
    }

    // DRIVER MODE
    if (activeMode === 'driver') {
      if (currentRoute === 'driver-trip' && activeDriverTripId) {
        return (
          <DriverTripScreen
            bookingId={activeDriverTripId}
            onBack={() => setCurrentRoute('driver-home')}
            onTripCompleted={() => setCurrentRoute('driver-home')}
          />
        );
      }
      return (
        <DriverHomeScreen
          onNavigate={(route) => setCurrentRoute(route)}
          onOpenTrip={(tripId) => {
            setActiveDriverTripId(tripId);
            setCurrentRoute('driver-trip');
          }}
        />
      );
    }

    // USER MODE
    switch (currentRoute) {
      case 'request':
        return (
          <RequestAmbulanceModal
            initialCategory={requestInitialCategory}
            onBack={() => setCurrentRoute('home')}
            onSendRequest={handleSendRequest}
          />
        );

      case 'searching':
        return (
          <SearchRadiusOverlay
            pickup={searchParams.pickup}
            destination={searchParams.destination}
            initialFare={searchParams.fare}
            onCancel={() => {
              cancelSearch();
              setCurrentRoute('home');
            }}
            onAmbulanceMatched={handleAmbulanceMatched}
          />
        );

      case 'tracking':
        return (
          <LiveTrackingScreen
            onBack={() => setCurrentRoute('home')}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        );

      case 'history':
        return (
          <OrderHistoryScreen
            onBack={() => setCurrentRoute('home')}
            onSelectBooking={(bId) => {
              setCurrentRoute('tracking');
            }}
          />
        );

      case 'safety':
        return (
          <SafetyScreen
            onBack={() => setCurrentRoute('home')}
            onNavigate={(route) => setCurrentRoute(route)}
          />
        );

      case 'saved-places':
        return <SavedPlacesScreen onBack={() => setCurrentRoute('home')} />;

      case 'notifications':
        return <NotificationsScreen onBack={() => setCurrentRoute('home')} />;

      case 'settings':
        return <AppSettingsScreen onBack={() => setCurrentRoute('home')} />;

      case 'help':
      case 'support':
        return <SupportScreen onBack={() => setCurrentRoute('home')} />;

      case 'driver-home':
        return (
          <DriverHomeScreen
            onNavigate={(route) => setCurrentRoute(route)}
            onOpenTrip={(tripId) => {
              setActiveDriverTripId(tripId);
              setCurrentRoute('driver-trip');
            }}
          />
        );

      case 'driver-register':
        return (
          <DriverRegisterModal
            isOpen={true}
            onClose={() => setCurrentRoute('home')}
            onSuccess={() => setCurrentRoute('driver-home')}
          />
        );

      case 'home':
      default:
        return (
          <UserHomeScreen
            onNavigate={(route) => setCurrentRoute(route)}
            onRequestAmbulance={handleOpenRequest}
          />
        );
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0A0D14] overflow-hidden select-none font-sans">
      {/* Main Mobile Screen Canvas */}
      <MobileFrame uiStyle={uiStyle} onOpenAuthModal={() => setAuthModalOpen(true)}>
        {renderScreen()}
      </MobileFrame>

      {/* User / Driver Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={activeMode}
      />

      {/* Driver Application Modal */}
      <DriverRegisterModal
        isOpen={driverRegisterOpen}
        onClose={() => setDriverRegisterOpen(false)}
        onSuccess={() => setCurrentRoute('home')}
      />
    </div>
  );
}
