import { expect, test } from '@playwright/test';

const norm = (s: string | null) => (s ?? '').replace(/\s/g, ' ');

test('rechnet Brutto zu Netto mit 19 %', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-testid="amount"] input').fill('119');
  await expect(page.getByTestId('net')).toHaveText(/100,00/);
  await expect(page.getByTestId('vat')).toHaveText(/19,00/);
});

test('rechnet Netto zu Brutto mit 7 %', async ({ page }) => {
  await page.goto('/');
  await page.locator('ion-segment-button[value="net-to-gross"]').click();
  await page.locator('ion-segment.rates ion-segment-button', { hasText: 'Ermäßigt' }).click();
  await page.locator('[data-testid="amount"] input').fill('1.000');
  await expect(page.getByTestId('gross')).toHaveText(/1\.070,00/);
  expect(norm(await page.getByTestId('vat').textContent())).toContain('70,00 €');
});

test('Merken legt einen Eintrag im Verlauf an', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-testid="amount"] input').fill('50');
  await page.getByRole('button', { name: 'Merken' }).click();
  await page.locator('ion-tab-button[tab="history"]').click();
  await expect(page.locator('app-history ion-item-sliding')).toHaveCount(1);
});

test('eigener Steuersatz erscheint im Rechner', async ({ page }) => {
  await page.goto('/tabs/settings');
  await page.locator('[data-testid="custom-rate"] input').fill('5,5');
  await page.getByRole('button', { name: 'Übernehmen' }).click();
  await page.locator('ion-tab-button[tab="calculator"]').click();
  await page.locator('[data-testid="amount"] input').fill('100');
  await page.locator('ion-segment-button[value="net-to-gross"]').click();
  await expect(page.getByTestId('gross')).toHaveText(/105,50/);
});
