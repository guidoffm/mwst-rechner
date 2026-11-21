import { Component, computed, inject, signal } from '@angular/core';
import type { RadioGroupChangeEventDetail } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { environment } from '../../environments/environment';
import type { CountryCode } from '../core/countries';
import { COUNTRY_LIST } from '../core/countries';
import { SettingsService } from '../core/settings.service';
import { formatRate, parseAmount } from '../core/vat';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonInput,
    IonButton,
    IonNote,
  ],
})
export class SettingsPage {
  private readonly settingsService = inject(SettingsService);

  readonly countries = COUNTRY_LIST;
  readonly settings = this.settingsService.settings;
  readonly country = this.settingsService.country;
  readonly version = environment.version;

  readonly customText = signal('');
  readonly customRate = computed(() => {
    const cents = parseAmount(this.customText(), this.country().decimalSeparator);
    if (cents === null || this.customText().trim() === '') return null;
    const rate = cents / 100;
    return rate >= 0 && rate <= 100 ? rate : null;
  });

  constructor() {
    void this.settingsService.ready.then(() => {
      const c = this.settings().customRate;
      if (c !== null) this.customText.set(this.format(c));
    });
  }

  format(rate: number): string {
    return formatRate(rate, this.country().locale);
  }

  onCountryChange(ev: CustomEvent<RadioGroupChangeEventDetail>): void {
    this.settingsService.update({ country: ev.detail.value as CountryCode });
  }

  onCustomInput(ev: CustomEvent<{ value?: string | null }>): void {
    this.customText.set(ev.detail.value ?? '');
  }

  saveCustom(): void {
    const rate = this.customRate();
    if (rate !== null) this.settingsService.setCustomRate(rate);
  }

  removeCustom(): void {
    this.customText.set('');
    this.settingsService.setCustomRate(null);
  }
}
