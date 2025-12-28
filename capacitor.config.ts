import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.manajntuhresults.app',
  appName: 'Mana JNTUH Results',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Using live website URL ensures all API routes and features work correctly
    // The app will load from your deployed website
    url: 'https://manajntuhresults.vercel.app',
    cleartext: true, // Allow HTTP connections if needed
  },
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
  },
};

export default config;

