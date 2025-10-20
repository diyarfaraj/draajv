import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localForage from 'localforage';
import { OdometerReading, OdometerFormValues } from '@/lib/types';

// Configure localForage only in browser environment
if (typeof window !== 'undefined') {
  localForage.config({
    name: 'KorjournalApp',
    storeName: 'odometer_readings',
    description: 'Lagring för mätarställningar',
  });
}

interface OdometerState {
  readings: OdometerReading[];
  addReading: (readingData: OdometerFormValues) => { success: boolean; error?: string };
  updateReading: (id: string, readingData: Partial<OdometerFormValues>) => void;
  deleteReading: (id: string) => void;
  getReadingById: (id: string) => OdometerReading | undefined;
  getReadingsByCarId: (carId: string) => OdometerReading[];
  getLatestReadingForCar: (carId: string) => OdometerReading | undefined;
  getReadingsByDateRange: (startDate: string, endDate: string) => OdometerReading[];
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
}

export const useOdometerStore = create<OdometerState>()(
  persist(
    (set, get) => ({
      readings: [],
      isInitialized: false,
      setInitialized: (isInitialized: boolean) => set({ isInitialized }),

      addReading: (readingData: OdometerFormValues) => {
        // Validation: Check if odometer is going backwards for the same car
        const latestReading = get().getLatestReadingForCar(readingData.carId);

        if (latestReading && readingData.odometer < latestReading.odometer) {
          const dateDiff = new Date(readingData.date).getTime() - new Date(latestReading.date).getTime();

          // Only warn if the new reading is for a later date but lower odometer
          if (dateDiff > 0) {
            return {
              success: false,
              error: `Mätarställningen (${readingData.odometer} km) är lägre än föregående avläsning (${latestReading.odometer} km från ${latestReading.date}). Mätaren kan inte gå bakåt.`,
            };
          }
        }

        const newReading: OdometerReading = {
          ...readingData,
          id: crypto.randomUUID ? crypto.randomUUID() : `reading-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          readings: [...state.readings, newReading].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));

        return { success: true };
      },

      updateReading: (id: string, readingData: Partial<OdometerFormValues>) => {
        set((state) => ({
          readings: state.readings
            .map((reading) =>
              reading.id === id ? { ...reading, ...readingData } : reading
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        }));
      },

      deleteReading: (id: string) => {
        set((state) => ({
          readings: state.readings.filter((reading) => reading.id !== id),
        }));
      },

      getReadingById: (id: string) => {
        return get().readings.find((reading) => reading.id === id);
      },

      getReadingsByCarId: (carId: string) => {
        return get()
          .readings.filter((reading) => reading.carId === carId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getLatestReadingForCar: (carId: string) => {
        const readings = get()
          .readings.filter((reading) => reading.carId === carId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return readings[0];
      },

      getReadingsByDateRange: (startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return get()
          .readings.filter((reading) => {
            const readingDate = new Date(reading.date).getTime();
            return readingDate >= start && readingDate <= end;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
    }),
    {
      name: 'odometer-readings-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localForage : {
          getItem: async () => null,
          setItem: async () => {},
          removeItem: async () => {},
        }
      ),
      onRehydrateStorage: () => (state?: OdometerState) => {
        if (state) state.setInitialized(true);
      },
    }
  )
);

// Eagerly initialize the store
if (typeof window !== 'undefined') {
  useOdometerStore.getState().setInitialized(false);
}
