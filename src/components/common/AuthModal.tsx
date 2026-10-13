/**
 * RESQ Nepal - User & Driver Authentication Modal Wrapper
 * Wraps the complete AuthContainer with modal backdrop for seamless in-app access.
 */

import React from 'react';
import { AuthContainer, AuthScreenType } from '../auth/AuthContainer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'user' | 'driver';
  initialScreen?: AuthScreenType;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'user',
  initialScreen,
}) => {
  if (!isOpen) return null;

  // Determine starting screen
  const startingScreen: AuthScreenType =
    initialScreen || (defaultRole === 'driver' ? 'driver-login' : 'welcome');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-[92vh] max-h-[750px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col relative">
        <AuthContainer
          initialScreen={startingScreen}
          onClose={onClose}
          onAuthenticated={() => {
            onClose();
          }}
        />
      </div>
    </div>
  );
};
