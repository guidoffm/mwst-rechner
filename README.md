# MwSt-Rechner

Mehrwertsteuer-Rechner für Android und iOS (Ionic 9 + Angular 22 + Capacitor 8).

## Funktionen

- Brutto ➤ Netto und Netto ➤ Brutto
- Steuersätze für Deutschland (19 / 7 %), Österreich (20 / 13 / 10 %) und Schweiz (8,1 / 3,8 / 2,6 %)
- Eigener Steuersatz (z. B. für andere Länder)
- Exakte Cent-Rechnung mit kaufmännischer Rundung (Netto + Steuer = Brutto)
- Eingabe im deutschen Format („1.234,56“) oder mit Punkt
- Einzelne Beträge oder das ganze Ergebnis kopieren, Ergebnis teilen
- Verlauf gespeicherter Berechnungen (lokal auf dem Gerät)
- Dark Mode, keine Werbung, kein Tracking, keine Netzwerkzugriffe

## Voraussetzungen

- Node ≥ 24.15 (`nvm use`, siehe `.nvmrc`)
- Android: Android Studio bzw. SDK 36, **JDK 21**
  (`export JAVA_HOME=$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home`)
- iOS: Xcode

## Entwicklung

```bash
npm install
npm start            # Browser, http://localhost:4200
npm test             # Unit-Tests (Vitest) + E2E (Playwright)
npm run lint
```

## Native Builds

```bash
npm run build && npx cap sync
npx cap open android # Android Studio → Build › Generate Signed App Bundle (.aab)
npx cap open ios     # Xcode → Product › Archive → App Store Connect
```

Icons und Splashscreens werden aus `assets/` erzeugt:

```bash
npx capacitor-assets generate --iconBackgroundColor '#2F6BFF' --iconBackgroundColorDark '#1238A8' \
  --splashBackgroundColor '#FFFFFF' --splashBackgroundColorDark '#121212'
```

## Versionen erhöhen

- `package.json` und `src/environments/*.ts` → `version`
- Android: `android/app/build.gradle` → `versionCode` (muss bei jedem Upload steigen) und `versionName`
- iOS: Xcode → Target App → General → Version / Build

## Store-Veröffentlichung – offene Punkte

- [ ] **App-ID**: `capacitor.config.ts`, `android/app/build.gradle` (`applicationId`, `namespace`) und
      Xcode (Bundle Identifier) – aktuell `de.mwstrechner.app`. Soll der alte Play-Store-Eintrag weitergeführt
      werden, muss hier dessen Application ID stehen, und der alte Upload-Key bzw. Play App Signing wird benötigt.
- [ ] Android Upload-Keystore anlegen/wiederfinden (nicht ins Repo einchecken!)
- [ ] Datenschutzerklärung als öffentliche URL (Text siehe Einstellungen-Seite der App)
- [ ] Store-Screenshots, Beschreibung, Kategorie „Finanzen“ bzw. „Produktivität“
- [ ] Play Console: Data-Safety-Formular („keine Daten erhoben“), Inhaltseinstufung, Zielgruppe
- [ ] App Store Connect: App-Datenschutz („Keine Daten erfasst“), Export-Compliance (keine Verschlüsselung)
