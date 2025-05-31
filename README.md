# Körjournal

En modern, responsiv körjournal för den svenska marknaden. Byggd med Next.js 14, TypeScript, Tailwind CSS och PWA-stöd.

## Funktioner

- Registrera körningar med datum, tid, mätarställning, syfte och ort
- Automatisk beräkning av körsträcka
- Redigera och radera körningar
- Exportera till CSV enligt Skatteverkets specifikation
- Mörkt/ljust tema
- Offlinestöd via PWA
- Responsiv design för alla enheter

## Teknisk stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-komponenter
- Zustand för state management
- localForage för persistent lagring
- next-pwa för PWA-stöd

## Installation

1. Klona repot:
   ```bash
   git clone https://github.com/yourusername/korjournal.git
   cd korjournal
   ```

2. Installera beroenden:
   ```bash
   pnpm install
   ```

3. Starta utvecklingsservern:
   ```bash
   pnpm dev
   ```

4. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Byggning

För att bygga appen för produktion:

```bash
pnpm build
```

Starta produktionsservern:

```bash
pnpm start
```

## Återställning av data

För att återställa all lagrad data, öppna webbläsarens utvecklarverktyg (F12) och kör:

```javascript
localForage.clear()
```

## Tester

Kör tester med:

```bash
pnpm test
```

## Licens

MIT 