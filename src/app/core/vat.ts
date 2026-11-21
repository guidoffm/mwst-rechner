/**
 * Reine Rechenfunktionen für die Umsatzsteuer.
 *
 * Alle Beträge werden intern in Cent (ganzzahlig) gerechnet, Steuersätze in
 * Hundertstel-Prozent (Basispunkte, z. B. 19 % = 1900, 8,1 % = 810). So entstehen
 * keine Gleitkomma-Rundungsfehler wie 0,1 + 0,2 = 0,30000000000000004.
 */

export type Direction = 'gross-to-net' | 'net-to-gross';

export interface VatResult {
  netCents: number;
  vatCents: number;
  grossCents: number;
  /** Steuersatz in Prozent, z. B. 19 oder 8.1 */
  rate: number;
}

/** Kaufmännische Rundung (half away from zero). */
function roundHalfAwayFromZero(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value));
}

export function rateToBasisPoints(rate: number): number {
  return Math.round(rate * 100);
}

export function calculate(amountCents: number, rate: number, direction: Direction): VatResult {
  const bp = rateToBasisPoints(rate);
  if (direction === 'net-to-gross') {
    const vatCents = roundHalfAwayFromZero((amountCents * bp) / 10000);
    return { netCents: amountCents, vatCents, grossCents: amountCents + vatCents, rate };
  }
  const netCents = roundHalfAwayFromZero((amountCents * 10000) / (10000 + bp));
  return { netCents, vatCents: amountCents - netCents, grossCents: amountCents, rate };
}

/**
 * Wandelt eine Benutzereingabe in Cent um. Gibt `null` zurück, wenn die Eingabe
 * keine gültige Zahl ist; eine leere Eingabe ergibt 0.
 *
 * @param decimalSeparator ',' für DE/AT, '.' für CH
 *
 * Unterstützt u. a. „1.234,56“, „1234,5“, „1 234,56“, „1'234.56“ (CH) und
 * „1234.56“ (Punkt als Dezimaltrenner auf Tastaturen ohne Komma).
 */
export function parseAmount(input: string, decimalSeparator: ',' | '.' = ','): number | null {
  let s = input
    .trim()
    .replace(/[\s\u00A0\u202F'\u2019\u20AC]/g, '')
    .replace(/^(EUR|CHF)/i, '');
  if (s === '') return 0;

  let negative = false;
  if (s.startsWith('-')) {
    negative = true;
    s = s.slice(1);
  }
  if (!/^[\d.,]+$/.test(s)) return null;

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  let decimalPos = -1;

  if (lastComma >= 0 && lastDot >= 0) {
    // Beide kommen vor: das letzte Zeichen ist der Dezimaltrenner.
    decimalPos = Math.max(lastComma, lastDot);
    if (s.split(s[decimalPos]).length - 1 > 1) return null;
  } else if (lastComma >= 0 || lastDot >= 0) {
    const sep = lastComma >= 0 ? ',' : '.';
    const pos = Math.max(lastComma, lastDot);
    const occurrences = s.split(sep).length - 1;
    const digitsAfter = s.length - pos - 1;
    const looksLikeThousands = occurrences > 1 || (digitsAfter === 3 && sep !== decimalSeparator);
    decimalPos = looksLikeThousands ? -1 : pos;
  }

  const intPart = (decimalPos >= 0 ? s.slice(0, decimalPos) : s).replace(/[.,]/g, '');
  const fracPart = decimalPos >= 0 ? s.slice(decimalPos + 1) : '';
  if (/[.,]/.test(fracPart)) return null;
  if (intPart === '' && fracPart === '') return null;

  const value = Number(`${intPart || '0'}.${fracPart || '0'}`);
  if (!Number.isFinite(value)) return null;
  const cents = Math.round(value * 100);
  return negative ? -cents : cents;
}

export function formatMoney(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

export function formatRate(rate: number, locale: string): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(rate)} %`;
}
