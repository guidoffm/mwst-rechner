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

Icons und Splashscreens werden aus `assets/` erzeugt (Quellen neu rendern: `node scripts/render-icons.mjs assets`):

```bash
npx capacitor-assets generate --iconBackgroundColor '#4FD8D0' --iconBackgroundColorDark '#0B2F35' \
  --splashBackgroundColor '#FFFFFF' --splashBackgroundColorDark '#121212'
```

## Versionen erhöhen

- `package.json` und `src/environments/*.ts` → `version`
- Android: `android/app/build.gradle` → `versionCode` (muss bei jedem Upload steigen) und `versionName`
- iOS: Xcode → Target App → General → Version / Build

## Signierung (Android)

Release-Builds werden automatisch mit dem Upload-Key der Altiros GmbH signiert:

- Keystore: `~/.keystores/altiros/mwst-rechner-upload.jks` (Alias `upload`, gültig bis 2056) – **nicht im Repo**
- Passwort: macOS-Schlüsselbund, Dienst `mwst-rechner-upload-keystore`
  (alternativ `MWST_UPLOAD_KEYSTORE` / `MWST_UPLOAD_PASSWORD` setzen)

```bash
npm run build && npx cap sync android
cd android && JAVA_HOME=$(brew --prefix openjdk@21)/libexec/openjdk.jdk/Contents/Home ./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

**Keystore und Passwort unbedingt sichern** (z. B. Passwort-Manager). Beim Anlegen der App in der Play Console
Play App Signing verwenden – dann kann ein verlorener Upload-Key zurückgesetzt werden.

## iOS-Upload (TestFlight / App Store Connect)

```bash
npm run build && npx cap sync ios
cd ios/App
xcodebuild -project App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath /tmp/MwSt.xcarchive archive DEVELOPMENT_TEAM=95A4WUY64Y CODE_SIGN_STYLE=Automatic \
  CURRENT_PROJECT_VERSION=$(date +%Y%m%d.%H%M) -allowProvisioningUpdates
xcodebuild -exportArchive -archivePath /tmp/MwSt.xcarchive -exportOptionsPlist ExportOptions.plist \
  -exportPath /tmp/export -allowProvisioningUpdates   # lädt direkt zu App Store Connect hoch
```

## Store-Veröffentlichung – offene Punkte

- [x] App-ID **`com.altiros.mwstrechner`** (Android + iOS). Der alte Play-Eintrag `com.altiros.mwst`
      (v1.4 von 2015) ist nicht in Play App Signing und sein Schlüssel verloren – er kann nicht aktualisiert werden.
- [x] Upload-Keystore angelegt (siehe oben)
- [x] Play Console (Konto Altiros GmbH): App „MwSt-Rechner“ angelegt, Play App Signing aktiv,
      AAB 20001 als Entwurf im internen Test-Track
- [x] App Store Connect (Team Altiros GmbH, 95A4WUY64Y): App „MwSt-Rechner: Brutto & Netto“ (Apple ID 6837748315,
      SKU `mwst-rechner`), Version 2.0.0, erster Build hochgeladen; manuelle Freigabe nach Review
- [ ] Interne Tester (Play) bzw. TestFlight-Gruppe einrichten und auf echten Geräten testen
- [ ] Website: Produktseite https://www.altiros.com/mwst-rechner/ und Datenschutz
      https://www.altiros.com/mwst-rechner/privacy/ (Branch `mwst-rechner` in `altiros/website-hugo`) veröffentlichen
- [ ] Store-Screenshots, Beschreibung, Kategorie „Finanzen“ bzw. „Business“
- [ ] Play Console: Datensicherheit („keine Daten erhoben“), Inhaltseinstufung, Zielgruppe
- [ ] App Store Connect: App-Datenschutz („Keine Daten erfasst“); Export-Compliance ist im Info.plist gesetzt
