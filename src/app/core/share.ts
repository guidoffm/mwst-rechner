import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import type { Direction, VatResult } from './vat';
import { formatMoney, formatRate } from './vat';

export function resultAsText(r: VatResult, direction: Direction, currency: string, locale: string): string {
  const m = (c: number) => formatMoney(c, currency, locale);
  const lines = [
    `Netto: ${m(r.netCents)}`,
    `MwSt. ${formatRate(r.rate, locale)}: ${m(r.vatCents)}`,
    `Brutto: ${m(r.grossCents)}`,
  ];
  return direction === 'gross-to-net' ? [lines[2], lines[1], lines[0]].join('\n') : lines.join('\n');
}

export async function copyText(text: string): Promise<void> {
  await Clipboard.write({ string: text });
}

export async function canShare(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) return true;
  try {
    return (await Share.canShare()).value;
  } catch {
    return false;
  }
}

/** Gibt false zurück, wenn der Nutzer abgebrochen hat oder Teilen nicht geht. */
export async function shareText(text: string): Promise<boolean> {
  try {
    await Share.share({ title: 'MwSt-Rechner', text, dialogTitle: 'Ergebnis teilen' });
    return true;
  } catch {
    return false;
  }
}
