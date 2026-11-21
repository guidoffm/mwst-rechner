import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // TODO: Durch die Application ID der früheren Play-Store-App ersetzen, falls der alte Eintrag weitergeführt werden soll.
  appId: 'de.mwstrechner.app',
  appName: 'MwSt-Rechner',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
};

export default config;
