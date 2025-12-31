import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.manajntuhresults.mobile',
  appName: 'Mana JNTUH Results',
  webDir: 'out',
  // Standalone app - no remote URL to ensure it's not a web wrapper
  // All API calls use external endpoints or client-side logic
  // @ts-ignore - androidScheme is valid but not in TypeScript types for Capacitor 6
  androidScheme: 'https',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
    Keyboard: {
      resizeOnFullScreen: true,
    },
    App: {
      // No launchUrl - this is a standalone native app, not a web wrapper
    },
    CapacitorHttp: {
      enabled: true, // Enable native HTTP to bypass CORS restrictions
    },
  },
};

export default config;

