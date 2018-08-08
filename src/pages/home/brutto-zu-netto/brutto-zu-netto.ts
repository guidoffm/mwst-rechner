import { Component } from '@angular/core';

@Component({
  templateUrl: 'brutto-zu-netto.html'
})
export class BruttoZuNetto {
  brutto = '11,90';
  netto = '10';
  steuer = '1,90';
  steuerSatz = 19;
  constructor() {

  }

}
