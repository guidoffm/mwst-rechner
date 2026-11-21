import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import type { SegmentChangeEventDetail } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bookmarkOutline, copyOutline, shareOutline, swapVertical } from 'ionicons/icons';

import { HistoryService } from '../core/history.service';
import { SettingsService } from '../core/settings.service';
import { canShare, copyText, resultAsText, shareText } from '../core/share';
import type { Direction } from '../core/vat';
import { calculate, formatMoney, formatRate, parseAmount } from '../core/vat';

@Component({
  selector: 'app-calculator',
  templateUrl: 'calculator.page.html',
  styleUrls: ['calculator.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonListHeader,
    IonItem,
    IonInput,
    IonNote,
    IonCard,
    IonCardContent,
    IonIcon,
  ],
})
export class CalculatorPage {
  private readonly settingsService = inject(SettingsService);
  private readonly history = inject(HistoryService);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);

  readonly settings = this.settingsService.settings;
  readonly country = this.settingsService.country;
  readonly rates = this.settingsService.availableRates;

  readonly amountText = signal('');
  readonly shareAvailable = signal(false);

  readonly amountCents = computed(() => parseAmount(this.amountText(), this.country().decimalSeparator));
  readonly invalid = computed(() => this.amountCents() === null);

  readonly result = computed(() => calculate(this.amountCents() ?? 0, this.settings().rate, this.settings().direction));

  readonly inputLabel = computed(() => (this.settings().direction === 'gross-to-net' ? 'Bruttobetrag' : 'Nettobetrag'));

  readonly placeholder = computed(() => (this.country().decimalSeparator === ',' ? '0,00' : '0.00'));

  constructor() {
    addIcons({ copyOutline, shareOutline, bookmarkOutline, swapVertical });
    void canShare().then((v) => this.shareAvailable.set(v));
  }

  openSettings(): void {
    void this.router.navigateByUrl('/tabs/settings');
  }

  money(cents: number): string {
    return formatMoney(cents, this.country().currency, this.country().locale);
  }

  rateLabel(rate: number): string {
    return formatRate(rate, this.country().locale);
  }

  onAmountInput(ev: CustomEvent<{ value?: string | null }>): void {
    this.amountText.set(ev.detail.value ?? '');
  }

  onDirectionChange(ev: CustomEvent<SegmentChangeEventDetail>): void {
    this.settingsService.update({ direction: ev.detail.value as Direction });
  }

  onRateChange(ev: CustomEvent<SegmentChangeEventDetail>): void {
    const rate = Number(ev.detail.value);
    if (Number.isFinite(rate)) this.settingsService.update({ rate });
  }

  /** Übernimmt das Ergebnis als neue Eingabe in der Gegenrichtung. */
  swap(): void {
    const r = this.result();
    const toGross = this.settings().direction === 'gross-to-net';
    const cents = toGross ? r.netCents : r.grossCents;
    this.amountText.set(this.formatPlain(cents));
    this.settingsService.update({ direction: toGross ? 'net-to-gross' : 'gross-to-net' });
  }

  async copyValue(cents: number, label: string): Promise<void> {
    await copyText(this.formatPlain(cents));
    await this.toast(`${label} kopiert`);
  }

  async copyAll(): Promise<void> {
    await copyText(this.text());
    await this.toast('Ergebnis kopiert');
  }

  async share(): Promise<void> {
    await shareText(this.text());
  }

  async save(): Promise<void> {
    if (this.invalid() || this.amountCents() === 0) {
      await this.toast('Bitte zuerst einen Betrag eingeben');
      return;
    }
    const c = this.country();
    this.history.add({
      ...this.result(),
      direction: this.settings().direction,
      country: c.code,
      currency: c.currency,
      locale: c.locale,
    });
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Im Browser nicht verfügbar
    }
    await this.toast('Im Verlauf gespeichert');
  }

  private text(): string {
    return resultAsText(this.result(), this.settings().direction, this.country().currency, this.country().locale);
  }

  /** Zahl ohne Währungssymbol, z. B. „1.234,56“ – gut zum Einfügen in andere Apps. */
  private formatPlain(cents: number): string {
    return new Intl.NumberFormat(this.country().locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  }

  private async toast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom', positionAnchor: 'tab-bar' });
    await t.present();
  }
}
