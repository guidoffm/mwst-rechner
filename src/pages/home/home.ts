import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BruttoZuNetto } from './brutto-zu-netto/brutto-zu-netto';
import { NettoZuBrutto } from './netto-zu-brutto/netto-zu-brutto';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  bruttoZuNetto = BruttoZuNetto;
  nettoZuBrutto = NettoZuBrutto;
  constructor(public navCtrl: NavController) {

  }

}
