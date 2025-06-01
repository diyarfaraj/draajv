# Körjournal

<!--
Meta description: Gratis körjournal för milersättning och bokföring. Open source, modern och enkel att använda.
Keywords: gratis körjournal, milersättning, opensource, körjournal, milersättning, bokföring, skatteverket, export, PDF, CSV
-->

![MIT License](https://img.shields.io/badge/license-MIT-green)

En modern svensk körjournal för milersättning, export och bokföring. Byggd med Next.js, React, Tailwind, Zustand, Google Maps och PWA-stöd.

För persistence används endast chromes inbyggd localStorage. Databasimplementering kan tillkomma senare. 

## 🚗 Funktioner
- Adressökning och rutt med Google Maps
- Automatisk distansberäkning (tur/retur)
- Snygg, mobilanpassad och PWA-ready
- Export till PDF och CSV (Skatteverkets format)
- Profil för användare och företag
- Summering per månad/år
- Dark/light mode
- Open source (MIT)

## 📺 Demo
[Se live-demo på Vercel](https://draajv.vercel.app)

## ⚡️ Kom igång
```sh
pnpm install
cp .env.example .env.local
# Fyll i dina API-nycklar i .env.local
pnpm dev
```

## 🔑 Miljövariabler
Se `.env.example` för vilka variabler som krävs (t.ex. Google Maps API).

## 🛠️ Bidra
Pull requests och issues välkomnas! Se [CONTRIBUTING.md](CONTRIBUTING.md) för riktlinjer.

## 📄 Licens
MIT © 2024 Diyar Faraj 
