import { Component, inject } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { copyOutline, timeOutline, trashOutline } from 'ionicons/icons';

import type { HistoryEntry } from '../core/history.service';
import { HistoryService } from '../core/history.service';
import { copyText, resultAsText } from '../core/share';
import { formatMoney, formatRate } from '../core/vat';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonNote,
    IonIcon,
    IonText,
  ],
})
export class HistoryPage {
  private readonly history = inject(HistoryService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  readonly entries = this.history.entries;

  constructor() {
    addIcons({ trashOutline, copyOutline, timeOutline });
  }

  money(e: HistoryEntry, cents: number): string {
    return formatMoney(cents, e.currency, e.locale);
  }

  rate(e: HistoryEntry): string {
    return formatRate(e.rate, e.locale);
  }

  date(e: HistoryEntry): string {
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(e.timestamp);
  }

  async copy(e: HistoryEntry, sliding?: IonItemSliding): Promise<void> {
    await sliding?.close();
    await copyText(resultAsText(e, e.direction, e.currency, e.locale));
    const t = await this.toastCtrl.create({
      message: 'Kopiert',
      duration: 1200,
      position: 'bottom',
      positionAnchor: 'tab-bar',
    });
    await t.present();
  }

  remove(e: HistoryEntry): void {
    this.history.remove(e.id);
  }

  async clearAll(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Verlauf löschen?',
      message: 'Alle gespeicherten Berechnungen werden entfernt.',
      buttons: [
        { text: 'Abbrechen', role: 'cancel' },
        { text: 'Löschen', role: 'destructive', handler: () => this.history.clear() },
      ],
    });
    await alert.present();
  }
}
