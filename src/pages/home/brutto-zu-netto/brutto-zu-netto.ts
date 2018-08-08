import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  templateUrl: 'brutto-zu-netto.html'
})
export class BruttoZuNetto implements OnInit {
  bruttoStringVal = '0';
  nettoNumber: number;
  steuerNumber: number;
  bruttoNumber = 0;
  steuerSatz = 'v';

  constructor(private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    this.calculate();
  }

  get steuer() {
    return this.currencyPipe.transform(this.steuerNumber, 'EUR');
  }

  get brutto() {
    return this.currencyPipe.transform(this.bruttoNumber, 'EUR');
  }

  get bruttoString(){
    return this.bruttoStringVal;
  }

  set bruttoString(value) {
    this.bruttoStringVal = value;
    this.bruttoNumber = this.getNumberFromString(value);
    this.calculate();
  }


  get netto() {
    return this.currencyPipe.transform(this.nettoNumber, 'EUR')
  }

  onChangeBrutto(value: string) {
    // this.bruttoNumber = this.getNumberFromString(value);
    // this.calculate();
  }

  steuersatzChanged(value) {
    this.steuerSatz = value;
    this.calculate();
  }

  private getNumberFromString(st: string): number {
    return +st.replace(',', '.');
  }

  private calculate() {
    const steuersatzNumber = this.steuerSatz === 'v' ? 1.19 : 1.07;
    this.nettoNumber = this.bruttoNumber * (1 / steuersatzNumber);
    this.steuerNumber = this.bruttoNumber * (1 - 1 / steuersatzNumber);
  }
}
