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

- [x] **App-ID** `com.altiros.mwst` (bestehender Play-Store-Eintrag der Altiros GmbH, letzte Version 1.4 /
      versionCode 50 von 2015, 10.000+ Downloads, 4,2 ★)
- [ ] **Android-Signaturschlüssel**: Play App Signing ist für die App *nicht* aktiv. Ein Update muss mit dem
      Original-Keystore (APK 1.4 von 2015) signiert werden. Empfehlung: Keystore wiederfinden und bei der
      ersten Veröffentlichung Play App Signing aktivieren (Play Console → App-Integrität → App-Signatur).
      Ohne den alten Schlüssel ist kein Update möglich – dann nur Neuanlage unter neuer ID.
- [ ] **iOS**: Bundle ID `com.altiros.mwst` im Apple Developer Portal (Team Altiros GmbH) registrieren und in
      App Store Connect eine neue App anlegen (dort existiert noch keine).
- [ ] Datenschutzerklärung: `docs/datenschutz.html` – Anschrift/E-Mail ergänzen, GitHub Pages (Branch `master`, Ordner `/docs`) aktivieren → `https://guidoffm.github.io/mwst-rechner/datenschutz.html`
- [ ] Store-Screenshots, Beschreibung, Kategorie „Finanzen“ bzw. „Produktivität“
- [ ] Play Console: Data-Safety-Formular („keine Daten erhoben“), Inhaltseinstufung, Zielgruppe
- [ ] App Store Connect: App-Datenschutz („Keine Daten erfasst“), Export-Compliance (keine Verschlüsselung)
