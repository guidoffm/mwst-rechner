import { Injectable, signal } from '@angular/core';

import type { CountryCode } from './countries';
import { loadJsonArray, saveJson } from './storage';
import type { Direction, VatResult } from './vat';

export interface HistoryEntry extends VatResult {
  id: string;
  timestamp: number;
  direction: Direction;
  country: CountryCode;
  currency: string;
  locale: string;
  note?: string;
}

const KEY = 'history';
const MAX_ENTRIES = 200;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly state = signal<HistoryEntry[]>([]);
  readonly entries = this.state.asReadonly();

  constructor() {
    void loadJsonArray<HistoryEntry>(KEY).then((e) => this.state.set(e));
  }

  add(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    const full: HistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };
    this.persist([full, ...this.state()].slice(0, MAX_ENTRIES));
  }

  remove(id: string): void {
    this.persist(this.state().filter((e) => e.id !== id));
  }

  clear(): void {
    this.persist([]);
  }

  private persist(entries: HistoryEntry[]): void {
    this.state.set(entries);
    void saveJson(KEY, entries);
  }
}
