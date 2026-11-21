import { defineConfig } from '@playwright/test';

/**
 * Erzeugt die Store-Screenshots (nicht Teil der normalen Tests):
 *   npx playwright test -c playwright.store.config.ts
 * Ausgabe: store/screenshots/
 */
const baseURL = 'http://localhost:4300';

export default defineConfig({
  testDir: './store',
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  reporter: 'list',
  use: { baseURL },
  webServer: {
    command: 'npm start -- --port 4300',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
