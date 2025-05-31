export interface DriveEntry {
  id: string; // UUID
  date: string; // ISO string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  startOdometer: number;
  endOdometer: number;
  distance: number; // Automatically calculated
  purpose: string;
  location: string;
  createdAt: string; // ISO string for timestamp
}

export type DriveFormValues = Omit<DriveEntry, "id" | "distance" | "createdAt">;

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalDistance: number;
}

export interface YearlySummary {
  year: string; // YYYY
  totalDistance: number;
} 