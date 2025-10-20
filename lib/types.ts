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
  licensePlate?: string; // Optional link to car
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

// Car Registry
export interface Car {
  id: string; // UUID
  licensePlate: string; // e.g., "ABC123"
  make?: string; // e.g., "Volvo"
  model?: string; // e.g., "V60"
  color?: string;
  isDefault: boolean; // User's default car
  createdAt: string; // ISO string
}

export type CarFormValues = Omit<Car, "id" | "createdAt">;

// Odometer Reading
export interface OdometerReading {
  id: string; // UUID
  carId: string; // Foreign key to Car
  licensePlate: string; // Denormalized for easy display
  date: string; // ISO string (YYYY-MM-DD)
  odometer: number; // Mileage in km
  notes?: string; // Optional notes
  createdAt: string; // ISO string for timestamp
}

export type OdometerFormValues = Omit<OdometerReading, "id" | "createdAt">; 