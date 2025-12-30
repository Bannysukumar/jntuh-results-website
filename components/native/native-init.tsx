"use client";

import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { useRouter, usePathname } from 'next/navigation';
import { isNative, hapticFeedback } from '@/lib/native-features';
import { ImpactStyle } from '@capacitor/haptics';

/**
 * Initialize native app features
 * This component should be added to the root layout
 */
export default function NativeInit() {
  const router = useRouter();
  const pathname = usePathname();
  const backButtonListener = useRef<any>(null);
  const appStateListener = useRef<any>(null);
  const urlOpenListener = useRef<any>(null);
  const keyboardListeners = useRef<any[]>([]);

  useEffect(() => {
    if (!isNative()) {
      return;
    }

    const initializeNativeFeatures = async () => {
      try {
        // Hide splash screen after a short delay
        setTimeout(async () => {
          try {
            await SplashScreen.hide();
          } catch (error) {
            console.log('Splash screen already hidden');
          }
        }, 1000);

        // Set status bar style
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
        await StatusBar.setOverlaysWebView({ overlay: false });

        // Handle app state changes
        appStateListener.current = await App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            // App came to foreground - refresh data if needed
            hapticFeedback(ImpactStyle.Light);
          }
        });

        // Handle app URL open (deep linking)
        urlOpenListener.current = await App.addListener('appUrlOpen', async (data) => {
          try {
            const url = new URL(data.url);
            const path = url.pathname + url.search;
            
            // Navigate to the deep link path
            if (path && path !== pathname) {
              router.push(path);
              await hapticFeedback(ImpactStyle.Medium);
            }
          } catch (error) {
            console.error('Error handling deep link:', error);
          }
        });

        // Handle back button (Android) with smart navigation
        backButtonListener.current = await App.addListener('backButton', async () => {
          await hapticFeedback(ImpactStyle.Light);
          
          // If we're on the home page, minimize the app
          if (pathname === '/' || pathname === '/academicresult') {
            App.minimizeApp();
          } else {
            // Otherwise, go back in history
            router.back();
          }
        });

        // Keyboard event listeners
        const keyboardWillShow = await Keyboard.addListener('keyboardWillShow', (info) => {
          // Adjust UI when keyboard appears
          document.body.style.paddingBottom = `${info.keyboardHeight}px`;
        });

        const keyboardWillHide = await Keyboard.addListener('keyboardWillHide', () => {
          // Reset UI when keyboard hides
          document.body.style.paddingBottom = '0px';
        });

        keyboardListeners.current = [keyboardWillShow, keyboardWillHide];

        // Set keyboard style
        await Keyboard.setStyle({ style: 'dark' });
        await Keyboard.setResizeMode({ mode: 'body' });

        // Handle app launch
        const appInfo = await App.getInfo();
        console.log('App initialized:', appInfo);

      } catch (error) {
        console.error('Error initializing native features:', error);
      }
    };

    initializeNativeFeatures();

    return () => {
      // Cleanup listeners
      if (backButtonListener.current) {
        backButtonListener.current.remove();
      }
      if (appStateListener.current) {
        appStateListener.current.remove();
      }
      if (urlOpenListener.current) {
        urlOpenListener.current.remove();
      }
      keyboardListeners.current.forEach(listener => {
        if (listener) listener.remove();
      });
    };
  }, [router, pathname]);

  return null;
}

