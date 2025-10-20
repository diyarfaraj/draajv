# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Körjournal** is a Swedish mileage log application for tracking mileage reimbursement (milersättning). It's a Next.js 14 PWA (Progressive Web App) that runs entirely in the browser with client-side data persistence using localForage/IndexedDB. The app includes Google Maps integration for address autocomplete and route visualization, and exports data to PDF/CSV formats compatible with Swedish tax authority (Skatteverket) requirements.

## Development Commands

```bash
# Install dependencies (use pnpm as shown in README)
pnpm install

# Development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint

# Format code with Prettier
pnpm format

# Run tests (Vitest)
pnpm test
```

## Environment Setup

Copy `.env.example` to `.env.local` and add:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Required for Google Maps Places API and Distance Matrix API

## Architecture

### State Management (Zustand + localForage)

The app uses **Zustand** for state management with **localForage** for IndexedDB persistence:

1. **driveStore** (`store/driveStore.ts`) - Manages all drive entries (körningar)
   - Persists to IndexedDB via localForage with the key `drive-entries-storage`
   - Handles CRUD operations for drive entries
   - Automatically calculates distance from odometer readings
   - Includes migration logic for legacy `location` field to `fromAddress`/`toAddress`
   - Tracks rehydration state with `isInitialized` flag
   - Entries are sorted by `createdAt` descending (newest first)

2. **userProfileStore** (`store/userProfileStore.ts`) - User/company profile information
   - Persists to localStorage via Zustand's default storage (key: `user-profile-storage`)
   - Used for PDF export headers (name, company, employee ID, account, etc.)

**Important**: Always check `isInitialized` before rendering drive data to avoid hydration mismatches between server and client.

### Data Models

Core types are defined in `lib/types.ts`:

- **DriveEntry** - Main entity with fields:
  - `id` (UUID), `date` (YYYY-MM-DD), `startTime`/`endTime` (HH:mm)
  - `startOdometer`/`endOdometer` (km), `distance` (auto-calculated)
  - `fromAddress`/`toAddress` (replaces deprecated `location` field)
  - `roundtrip` (boolean), `purpose`, `vehicleType`, `createdAt` (ISO timestamp)

- **DriveFormValues** - Type for form submission (omits `id`, `distance`, `createdAt`)

Form validation uses **Zod** schemas in `lib/schemas.ts` with Swedish error messages.

### Routing Structure

```
/                    - Home page with drive entry list
/new                 - Create new drive entry (with map + distance calculation)
/new/[id]            - Edit existing drive entry
/export              - Export page (CSV only, but PDF export also available from home)
```

All pages are client components (`"use client"`) due to browser-only state management.

### Google Maps Integration

- **GoogleMapsLoader** component wraps pages requiring Maps API
- **GoogleAddressAutocomplete** - Uses `use-places-autocomplete` + `@reach/combobox` for Swedish address search (restricted to `country: "se"`)
- **Distance Calculation** - Done via `lib/getDistance.ts` calling `/api/distance` endpoint with Distance Matrix API
- **Route Visualization** - Uses `@react-google-maps/api` with DirectionsRenderer on `/new` page
- Roundtrip routes use waypoints (origin → destination → origin)

### Export Functionality

Located in `app/_components/DriveEntryList.tsx`:

1. **CSV Export** (`generateCsv` in `lib/utils.ts`)
   - Format: Skatteverket-compliant semicolon-delimited
   - Headers: `Datum;Starttid;Sluttid;Start mätarställning;Stop mätarställning;Sträcka;Syfte;Ort`
   - UTF-8 with BOM for Excel compatibility

2. **PDF Export** (uses `jspdf` + `jspdf-autotable`)
   - Landscape orientation
   - Custom header with company info and user profile
   - Itemized table with summary row
   - Filename: `korjournal_YYYY-MM-DD.pdf`

### Distance Calculation Methods

Two approaches used in the app:

1. **Odometer-based** (DriveEntryForm) - Manual entry of start/end odometer readings
   - `calculateDistance(start, end)` in `lib/utils.ts`
   - Simple subtraction: `end - start`

2. **Address-based** (NewDrivePage) - Automatic via Google Distance Matrix API
   - `getDistanceInKm(origin, destination)` in `lib/getDistance.ts`
   - Calls `/api/distance` route (not yet implemented in codebase - API call goes directly to Google)
   - Supports roundtrip calculation (distance × 2)

### UI Components

Built with **shadcn/ui** patterns:
- Base components in `app/_components/ui/` (button, card, dialog, alert-dialog, tooltip)
- Uses **Radix UI** primitives with Tailwind CSS
- Theme toggle supports dark/light mode via `next-themes`
- Icons from `lucide-react` and `react-icons` (FiSettings, FiEdit2, FiCopy, FiTrash2, FaCarSide)

### PWA Configuration

- Configured via `next-pwa` in `next.config.mjs`
- Service worker disabled in development
- Manifest at `/manifest.webmanifest`
- Theme colors defined in `app/layout.tsx` metadata

## Key Patterns & Conventions

1. **Client-side only architecture** - No server-side data fetching or API routes (except potential Distance Matrix proxy)
2. **Swedish language** - All UI text, comments, and variable names use Swedish terminology
3. **Path alias** - `@/` maps to project root (configured in `tsconfig.json`)
4. **Mileage rate** - Hardcoded at 2.5 SEK/km throughout the app (for milersättning calculation)
5. **Form handling** - React Hook Form + Zod validation
6. **Date/time formats** - ISO strings (YYYY-MM-DD, HH:mm) per Swedish standards
7. **Entry ordering** - Always sorted by `createdAt` descending after mutations

## Testing

- Test framework: **Vitest**
- Testing library: `@testing-library/react`
- JSDOM for browser environment simulation
- Run tests: `pnpm test`

## Common Tasks

### Adding a new field to DriveEntry

1. Update `DriveEntry` interface in `lib/types.ts`
2. Update `driveEntrySchema` in `lib/schemas.ts` (if form-submitted)
3. Update Zustand store methods in `store/driveStore.ts` (addEntry, updateEntry)
4. Update form components (DriveEntryForm or NewDrivePage)
5. Update display in DriveEntryList table
6. Update CSV/PDF export functions if needed

### Modifying export formats

- **CSV**: Edit `generateCsv` in `lib/utils.ts`
- **PDF**: Edit `handleExportPdf` in `app/_components/DriveEntryList.tsx`

### Working with Google Maps

- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- API needs Places API and Distance Matrix API enabled
- Test autocomplete with Swedish addresses
- Routes are calculated client-side via DirectionsService

## Migration Notes

The app previously used a single `location` field but now uses `fromAddress`/`toAddress`. The `getEntryById` method in `driveStore.ts` includes migration logic to handle legacy data.
