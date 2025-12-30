import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.manajntuhresults.mobile',
  appName: 'Mana JNTUH Results',
  webDir: 'out',
  // Using live URL ensures API routes work, but we add native features
  // for enhanced mobile experience (share, save, haptics, etc.)
  server: {
    androidScheme: 'https',
    url: 'https://manajntuhresults.vercel.app',
    cleartext: true,
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
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
    Keyboard: {
      resizeOnFullScreen: true,
    },
    App: {
      launchUrl: 'https://manajntuhresults.vercel.app',
    },
  },
};

export default config;

