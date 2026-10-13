/**
 * RESQ Nepal - Master Authentication Container & Flow Controller
 * Seamlessly manages navigation across all 15 authentication screens and states:
 * 1. Welcome / Choose Account Type
 * 2. User Login
 * 3. User Create Account — Personal Information
 * 4. User Phone OTP Verification
 * 5. User Citizenship Document Upload
 * 6. User Registration Review / Success
 * 7. Driver Login
 * 8. Driver Create Account — Personal Information
 * 9. Driver Phone OTP Verification
 * 10. Driver Driving Licence Upload
 * 11. Driver Citizenship Document Upload
 * 12. Driver Ambulance Information
 * 13. Driver Registration Review / Application Submitted
 * 14. Forgot Password / Account Recovery
 * 15. Real-time validation and error handling
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WelcomeScreen } from './WelcomeScreen';
import { UserLoginScreen } from './UserLoginScreen';
import { UserRegisterScreen } from './UserRegisterScreen';
import { DriverLoginScreen } from './DriverLoginScreen';
import { DriverRegisterScreen } from './DriverRegisterScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';

export type AuthScreenType =
  | 'welcome'
  | 'user-login'
  | 'user-register'
  | 'driver-login'
  | 'driver-register'
  | 'forgot-password';

interface AuthContainerProps {
  initialScreen?: AuthScreenType;
  onClose?: () => void;
  onAuthenticated?: (role: 'user' | 'driver') => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  initialScreen = 'welcome',
  onClose,
  onAuthenticated,
}) => {
  const { switchMode } = useAppStore();
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>(initialScreen);
  const [forgotPasswordRole, setForgotPasswordRole] = useState<'user' | 'driver'>('user');

  // Handle successful user auth
  const handleUserSuccess = () => {
    switchMode('user');
    if (onAuthenticated) onAuthenticated('user');
    if (onClose) onClose();
  };

  // Handle successful driver auth
  const handleDriverSuccess = () => {
    switchMode('driver');
    if (onAuthenticated) onAuthenticated('driver');
    if (onClose) onClose();
  };

  const handleOpenForgotPassword = (role: 'user' | 'driver') => {
    setForgotPasswordRole(role);
    setCurrentScreen('forgot-password');
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full w-full overflow-hidden relative">
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onSelectUser={() => setCurrentScreen('user-login')}
          onSelectDriver={() => setCurrentScreen('driver-login')}
          onSelectSignIn={(role) => {
            if (role === 'driver') setCurrentScreen('driver-login');
            else setCurrentScreen('user-login');
          }}
          onClose={onClose}
        />
      )}

      {currentScreen === 'user-login' && (
        <UserLoginScreen
          onSuccess={handleUserSuccess}
          onNavigateToRegister={() => setCurrentScreen('user-register')}
          onNavigateToForgotPassword={() => handleOpenForgotPassword('user')}
          onBackToAccountType={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'user-register' && (
        <UserRegisterScreen
          onSuccess={handleUserSuccess}
          onNavigateToLogin={() => setCurrentScreen('user-login')}
          onBackToAccountType={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'driver-login' && (
        <DriverLoginScreen
          onSuccess={handleDriverSuccess}
          onNavigateToRegister={() => setCurrentScreen('driver-register')}
          onNavigateToForgotPassword={() => handleOpenForgotPassword('driver')}
          onBackToAccountType={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'driver-register' && (
        <DriverRegisterScreen
          onSuccess={handleDriverSuccess}
          onNavigateToLogin={() => setCurrentScreen('driver-login')}
          onBackToAccountType={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen
          roleHint={forgotPasswordRole}
          onBackToLogin={() => {
            if (forgotPasswordRole === 'driver') setCurrentScreen('driver-login');
            else setCurrentScreen('user-login');
          }}
        />
      )}
    </div>
  );
};
