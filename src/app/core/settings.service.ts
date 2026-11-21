import { Injectable, computed, signal } from '@angular/core';

import type { Country, CountryCode } from './countries';
import { COUNTRIES } from './countries';
import { loadJson, saveJson } from './storage';
import type { Direction } from './vat';

export interface Settings {
  country: CountryCode;
  /** Zuletzt gewählter Steuersatz in Prozent */
  rate: number;
  /** Eigener Steuersatz in Prozent oder null */
  customRate: number | null;
  direction: Direction;
}

const KEY = 'settings';
const DEFAULTS: Settings = { country: 'DE', rate: 19, customRate: null, direction: 'gross-to-net' };

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly state = signal<Settings>(DEFAULTS);

  readonly settings = this.state.asReadonly();
  readonly country = computed<Country>(() => COUNTRIES[this.state().country] ?? COUNTRIES.DE);

  /** Alle wählbaren Sätze: die des Landes plus ggf. der eigene Satz. */
  readonly availableRates = computed(() => {
    const rates = this.country().rates.map((r) => ({ ...r, custom: false }));
    const custom = this.state().customRate;
    if (custom !== null && !rates.some((r) => r.rate === custom)) {
      rates.push({ rate: custom, label: 'Eigener Satz', custom: true });
    }
    return rates;
  });

  readonly ready: Promise<void>;

  constructor() {
    this.ready = loadJson(KEY, DEFAULTS).then((s) => {
      if (!(s.country in COUNTRIES)) s.country = 'DE';
      this.state.set(s);
    });
  }

  update(patch: Partial<Settings>): void {
    const next = { ...this.state(), ...patch };
    if (patch.country && patch.country !== this.state().country) {
      next.rate = COUNTRIES[patch.country].rates[0].rate;
    }
    this.state.set(next);
    void saveJson(KEY, next);
  }

  setCustomRate(rate: number | null): void {
    const current = this.state();
    const patch: Partial<Settings> = { customRate: rate };
    if (rate !== null) patch.rate = rate;
    else if (current.rate === current.customRate) patch.rate = this.country().rates[0].rate;
    this.update(patch);
  }
}
