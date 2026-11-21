export type CountryCode = 'DE' | 'AT' | 'CH';

export interface VatRate {
  rate: number;
  label: string;
}

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  locale: string;
  decimalSeparator: ',' | '.';
  rates: VatRate[];
}

/** Stand: 2026. Bei Änderungen der Steuersätze nur hier anpassen. */
export const COUNTRIES: Record<CountryCode, Country> = {
  DE: {
    code: 'DE',
    name: 'Deutschland',
    flag: '🇩🇪',
    currency: 'EUR',
    locale: 'de-DE',
    decimalSeparator: ',',
    rates: [
      { rate: 19, label: 'Regelsatz' },
      { rate: 7, label: 'Ermäßigt' },
    ],
  },
  AT: {
    code: 'AT',
    name: 'Österreich',
    flag: '🇦🇹',
    currency: 'EUR',
    locale: 'de-AT',
    decimalSeparator: ',',
    rates: [
      { rate: 20, label: 'Normalsatz' },
      { rate: 13, label: 'Ermäßigt' },
      { rate: 10, label: 'Ermäßigt' },
    ],
  },
  CH: {
    code: 'CH',
    name: 'Schweiz',
    flag: '🇨🇭',
    currency: 'CHF',
    locale: 'de-CH',
    decimalSeparator: '.',
    rates: [
      { rate: 8.1, label: 'Normalsatz' },
      { rate: 3.8, label: 'Beherbergung' },
      { rate: 2.6, label: 'Reduziert' },
    ],
  },
};

export const COUNTRY_LIST = Object.values(COUNTRIES);
