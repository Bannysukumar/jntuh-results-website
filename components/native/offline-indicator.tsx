"use client";

import { useEffect, useState } from 'react';
import { isNative, isOffline, checkNetworkStatus } from '@/lib/native-features';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * Offline indicator component
 * Shows when the app is offline
 */
export default function OfflineIndicator() {
  const [isOfflineState, setIsOfflineState] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(isNative());
    setIsOfflineState(isOffline());

    const handleOnline = () => {
      setIsOfflineState(false);
    };

    const handleOffline = () => {
      setIsOfflineState(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check network status periodically
    const interval = setInterval(async () => {
      const online = await checkNetworkStatus();
      setIsOfflineState(!online);
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOfflineState) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">
        {isNativeApp ? 'You are offline. Some features may be limited.' : 'No internet connection'}
      </span>
    </div>
  );
}

