import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BruttoZuNetto } from '../pages/home/brutto-zu-netto/brutto-zu-netto';
import { NettoZuBrutto } from '../pages/home/netto-zu-brutto/netto-zu-brutto';
import { StSatzWahl } from '../pages/home/st-satz-wahl/st-satz-wahl';
import { CurrencyPipe, registerLocaleData } from '../../node_modules/@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe, 'de');

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BruttoZuNetto,
    NettoZuBrutto,
    StSatzWahl
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BruttoZuNetto,
    NettoZuBrutto,
    StSatzWahl
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'de' },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
