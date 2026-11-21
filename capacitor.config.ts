import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Neue ID: Der alte Play-Eintrag com.altiros.mwst (2015) ist ohne den verlorenen Original-Schlüssel nicht aktualisierbar.
  appId: 'com.altiros.mwstrechner',
  appName: 'MwSt-Rechner',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
};

export default config;
