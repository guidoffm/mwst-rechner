import { Component } from '@angular/core';
import { CurrencyPipe } from '../../../../node_modules/@angular/common';

@Component({
  templateUrl: 'netto-zu-brutto.html'
})
export class NettoZuBrutto {

  nettoStringVal = '0';
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

  get nettoString(){
    return this.nettoStringVal;
  }

  set nettoString(value) {
    this.nettoStringVal = value;
    this.nettoNumber = this.getNumberFromString(value);
    this.calculate();
  }

  get netto() {
    return this.currencyPipe.transform(this.nettoNumber, 'EUR')
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
    this.bruttoNumber = this.nettoNumber * steuersatzNumber;
    this.steuerNumber = this.nettoNumber * (steuersatzNumber - 1);
  }

}
