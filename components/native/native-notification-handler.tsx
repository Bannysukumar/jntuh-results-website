"use client";

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { isNative, hapticFeedback } from '@/lib/native-features';
import { ImpactStyle } from '@capacitor/haptics';
import { useRouter } from 'next/navigation';

/**
 * Handles native app notifications and deep links
 */
export default function NativeNotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    if (!isNative()) {
      return;
    }

    const setupNotificationHandlers = async () => {
      try {
        // Handle app URL open (deep linking from notifications)
        const urlListener = await App.addListener('appUrlOpen', async (data) => {
          await hapticFeedback(ImpactStyle.Medium);
          
          try {
            const url = new URL(data.url);
            const path = url.pathname + url.search;
            
            if (path) {
              router.push(path);
            }
          } catch (error) {
            console.error('Error handling notification URL:', error);
          }
        });

        // Handle app state change (when app comes to foreground from notification)
        const stateListener = await App.addListener('appStateChange', async ({ isActive }) => {
          if (isActive) {
            // App came to foreground - could refresh data here
            await hapticFeedback(ImpactStyle.Light);
          }
        });

        return () => {
          urlListener.remove();
          stateListener.remove();
        };
      } catch (error) {
        console.error('Error setting up notification handlers:', error);
      }
    };

    const cleanup = setupNotificationHandlers();

    return () => {
      cleanup.then(remove => {
        if (remove) remove();
      });
    };
  }, [router]);

  return null;
}

