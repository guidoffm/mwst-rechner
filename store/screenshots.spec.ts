import type { Browser, Page } from '@playwright/test';
import { test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const here = join(process.cwd(), 'store');
const OUT = join(here, 'screenshots');
const ICON = `data:image/png;base64,${readFileSync(join(here, '..', 'assets', 'icon-only.png')).toString('base64')}`;

interface Target {
  name: string;
  mode: 'ios' | 'md';
  /** Viewport der App (CSS-Pixel) und Pixeldichte */
  app: { width: number; height: number; dpr: number };
  /** Größe des fertigen Store-Bildes in Pixeln */
  out: { width: number; height: number };
}

const TARGETS: Target[] = [
  // App Store: iPhone 6,9" (1320 × 2868)
  { name: 'ios-iphone-6.9', mode: 'ios', app: { width: 440, height: 956, dpr: 3 }, out: { width: 1320, height: 2868 } },
  // App Store: iPad 13" (2064 × 2752)
  {
    name: 'ios-ipad-13',
    mode: 'ios',
    app: { width: 1032, height: 1376, dpr: 2 },
    out: { width: 2064, height: 2752 },
  },
  // Google Play: Smartphone (1080 × 1920, 9:16)
  { name: 'play-phone', mode: 'md', app: { width: 412, height: 800, dpr: 2.625 }, out: { width: 1080, height: 1920 } },
];

interface Scene {
  id: string;
  title: string;
  subtitle: string;
  dark?: boolean;
  run: (page: Page) => Promise<void>;
}

const amount = (page: Page) => page.locator('[data-testid="amount"] input');
const tab = (page: Page, name: string) => page.locator(`ion-tab-button[tab="${name}"]`);

async function save(page: Page, direction: 'gross-to-net' | 'net-to-gross', value: string, rateLabel: string) {
  await tab(page, 'calculator').click();
  await page.locator(`ion-segment-button[value="${direction}"]`).click();
  await page.locator('ion-segment.rates ion-segment-button', { hasText: rateLabel }).first().click();
  await amount(page).fill(value);
  await page.getByRole('button', { name: 'Merken' }).click();
  await page.waitForTimeout(300);
}

const SCENES: Scene[] = [
  {
    id: '1-brutto-netto',
    title: 'Brutto ➜ Netto\nin Sekunden',
    subtitle: 'Netto, Mehrwertsteuer und Brutto auf einen Blick',
    run: async (page) => {
      await amount(page).fill('1.190,00');
    },
  },
  {
    id: '2-netto-brutto',
    title: 'Netto ➜ Brutto,\ncent-genau',
    subtitle: 'Kaufmännisch gerundet – Netto + Steuer = Brutto',
    run: async (page) => {
      await page.locator('ion-segment-button[value="net-to-gross"]').click();
      await page.locator('ion-segment.rates ion-segment-button', { hasText: 'Ermäßigt' }).click();
      await amount(page).fill('249,90');
    },
  },
  {
    id: '3-laender',
    title: 'Deutschland,\nÖsterreich, Schweiz',
    subtitle: 'Alle Steuersätze – und dein eigener',
    run: async (page) => {
      await tab(page, 'settings').click();
    },
  },
  {
    id: '4-verlauf',
    title: 'Berechnungen\nmerken',
    subtitle: 'Verlauf zum Nachschlagen, Kopieren und Teilen',
    run: async (page) => {
      await save(page, 'gross-to-net', '59,50', 'Regelsatz');
      await save(page, 'net-to-gross', '1.250', 'Regelsatz');
      await save(page, 'gross-to-net', '32,10', 'Ermäßigt');
      await save(page, 'net-to-gross', '89,99', 'Ermäßigt');
      await tab(page, 'history').click();
    },
  },
  {
    id: '5-dunkel',
    title: 'Schlicht. Schnell.\nPrivat.',
    subtitle: 'Dunkler Modus · keine Werbung · kein Tracking',
    dark: true,
    run: async (page) => {
      await amount(page).fill('500');
    },
  },
];

async function captureApp(browser: Browser, t: Target, scene: Scene): Promise<Buffer> {
  const context = await browser.newContext({
    viewport: { width: t.app.width, height: t.app.height },
    deviceScaleFactor: t.app.dpr,
    isMobile: true,
    hasTouch: true,
    colorScheme: scene.dark ? 'dark' : 'light',
    locale: 'de-DE',
  });
  const page = await context.newPage();
  await page.goto(`/tabs/calculator?ionic:mode=${t.mode}`);
  await amount(page).waitFor();
  await scene.run(page);
  // Toasts und Animationen abklingen lassen
  await page.waitForTimeout(2200);
  const shot = await page.screenshot();
  await context.close();
  return shot;
}

function compose(t: Target, scene: Scene, app: Buffer): string {
  const W = t.out.width;
  const H = t.out.height;
  const pad = Math.round(W * 0.07);
  const titleSize = Math.round(W * (t.name.includes('ipad') ? 0.062 : 0.085));
  const subSize = Math.round(titleSize * 0.42);
  const radius = Math.round(W * 0.05);
  const title = scene.title.replace(/\n/g, '<br>');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden}
    body{background:linear-gradient(160deg,#4FD8D0 0%,#16656A 55%,#0B2F35 100%);
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#fff;
      display:flex;flex-direction:column;align-items:center}
    header{padding:${Math.round(pad * 1.2)}px ${pad}px ${Math.round(pad * 0.6)}px;text-align:center}
    h1{font-size:${titleSize}px;line-height:1.08;margin:0;font-weight:800;letter-spacing:-0.02em}
    p{font-size:${subSize}px;margin:${Math.round(subSize * 0.7)}px 0 0;opacity:.9;font-weight:500}
    .frame{display:flex;justify-content:center;padding:0 ${pad}px}
    img{max-width:100%;object-fit:contain;border-radius:${radius}px;
      box-shadow:0 ${Math.round(W * 0.02)}px ${Math.round(W * 0.06)}px rgba(0,0,0,.35);
      border:${Math.max(4, Math.round(W * 0.008))}px solid rgba(255,255,255,.85)}
  </style></head><body>
    <header><h1>${title}</h1><p>${scene.subtitle}</p></header>
    <div class="frame"><img src="data:image/png;base64,${app.toString('base64')}"></div>
    <script>
      // Bild in den verbleibenden Platz einpassen (mit Rand unten)
      const img = document.querySelector('img');
      const fit = () => { img.style.maxHeight = (innerHeight - img.getBoundingClientRect().top - ${pad}) + 'px'; };
      img.complete ? fit() : img.addEventListener('load', fit);
    </script>
  </body></html>`;
}

async function render(browser: Browser, html: string, width: number, height: number, path: string) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.waitForTimeout(400);
  await page.screenshot({ path });
  await page.close();
}

for (const t of TARGETS) {
  test(`Screenshots ${t.name}`, async ({ browser }) => {
    const dir = join(OUT, t.name);
    mkdirSync(dir, { recursive: true });
    for (const scene of SCENES) {
      const app = await captureApp(browser, t, scene);
      await render(browser, compose(t, scene, app), t.out.width, t.out.height, join(dir, `${scene.id}.png`));
    }
  });
}

test('Google Play: Feature-Grafik und Icon', async ({ browser }) => {
  const dir = join(OUT, 'play-graphics');
  mkdirSync(dir, { recursive: true });
  const feature = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:1024px;height:500px;overflow:hidden}
    body{background:linear-gradient(120deg,#4FD8D0 0%,#16656A 55%,#0B2F35 100%);color:#fff;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box}
    img{width:220px;height:220px;border-radius:48px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
    h1{font-size:76px;margin:0;font-weight:800;letter-spacing:-0.02em}
    p{font-size:32px;margin:14px 0 0;opacity:.92;font-weight:500}
  </style></head><body><img src="${ICON}"><div><h1>MwSt-Rechner</h1>
    <p>Brutto · Netto · Mehrwertsteuer</p><p style="font-size:24px;opacity:.8">DE · AT · CH – cent-genau</p></div></body></html>`;
  await render(browser, feature, 1024, 500, join(dir, 'feature-graphic-1024x500.png'));
  const icon = `<!doctype html><html><body style="margin:0"><img src="${ICON}" width="512" height="512" style="display:block"></body></html>`;
  await render(browser, icon, 512, 512, join(dir, 'icon-512.png'));
});
