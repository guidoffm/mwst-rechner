import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Bestehender Play-Store-Eintrag (Altiros GmbH), daher nicht ändern.
  appId: 'com.altiros.mwst',
  appName: 'MwSt-Rechner',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
};

export default config;
