import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DriveEntry } from "./types";
import { format, parse, isValid } from 'date-fns';
import { sv } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, time?: string) {
  // Visar t.ex. 2025-05-31 kl 08:30
  if (!date) return ""
  const [year, month, day] = date.split("-")
  let out = `${year}-${month}-${day}`
  if (time) out += ` kl ${time}`
  return out
}

export function calculateDistance(start: number, end: number): number {
  if (isNaN(start) || isNaN(end) || end < start) {
    return 0;
  }
  return end - start;
}

export function generateCsv(entries: DriveEntry[]): string {
  // Skatteverkets format: Datum;Starttid;Sluttid;Start mätarställning;Stop mätarställning;Sträcka;Syfte;Ort
  const header = "Datum;Starttid;Sluttid;Start mätarställning;Stop mätarställning;Sträcka;Syfte;Ort"
  const rows = entries.map(e =>
    [
      e.date,
      e.startTime,
      e.endTime,
      e.startOdometer,
      e.endOdometer,
      e.distance,
      e.purpose.replace(/;/g, ","), // undvik semikolon i fält
      (e.location ?? "").replace(/;/g, ","),
    ].join(";")
  )
  return [header, ...rows].join("\n")
}

export function getCurrentDateISO() {
  return new Date().toISOString().split("T")[0]
}

export function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5)
} 