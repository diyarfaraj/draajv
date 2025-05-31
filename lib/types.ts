export interface DriveEntry {
  id: string; // UUID
  date: string; // ISO string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  startOdometer: number;
  endOdometer: number;
  fromAddress: string;
  toAddress: string;
  roundtrip: boolean;
  /** @deprecated */
  location?: string;
  distance: number; // Automatically calculated
  purpose: string;
  vehicleType: string;
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