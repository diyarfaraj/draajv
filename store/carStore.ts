import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localForage from 'localforage';
import { Car, CarFormValues } from '@/lib/types';

// Configure localForage only in browser environment
if (typeof window !== 'undefined') {
  localForage.config({
    name: 'KorjournalApp',
    storeName: 'cars',
    description: 'Lagring för bilregister',
  });
}

interface CarState {
  cars: Car[];
  addCar: (carData: CarFormValues) => void;
  updateCar: (id: string, carData: Partial<CarFormValues>) => void;
  deleteCar: (id: string) => void;
  getCarById: (id: string) => Car | undefined;
  getCarByLicensePlate: (licensePlate: string) => Car | undefined;
  setDefaultCar: (id: string) => void;
  getDefaultCar: () => Car | undefined;
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
}

export const useCarStore = create<CarState>()(
  persist(
    (set, get) => ({
      cars: [],
      isInitialized: false,
      setInitialized: (isInitialized: boolean) => set({ isInitialized }),

      addCar: (carData: CarFormValues) => {
        const newCar: Car = {
          ...carData,
          id: crypto.randomUUID ? crypto.randomUUID() : `car-${Date.now()}`,
          licensePlate: carData.licensePlate.toUpperCase().trim(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          cars: [...state.cars, newCar].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        }));
      },

      updateCar: (id: string, carData: Partial<CarFormValues>) => {
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id
              ? {
                  ...car,
                  ...carData,
                  licensePlate: carData.licensePlate
                    ? carData.licensePlate.toUpperCase().trim()
                    : car.licensePlate,
                }
              : car
          ),
        }));
      },

      deleteCar: (id: string) => {
        set((state) => ({
          cars: state.cars.filter((car) => car.id !== id),
        }));
      },

      getCarById: (id: string) => {
        return get().cars.find((car) => car.id === id);
      },

      getCarByLicensePlate: (licensePlate: string) => {
        const normalized = licensePlate.toUpperCase().trim();
        return get().cars.find((car) => car.licensePlate === normalized);
      },

      setDefaultCar: (id: string) => {
        set((state) => ({
          cars: state.cars.map((car) => ({
            ...car,
            isDefault: car.id === id,
          })),
        }));
      },

      getDefaultCar: () => {
        return get().cars.find((car) => car.isDefault);
      },
    }),
    {
      name: 'car-registry-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localForage : {
          getItem: async () => null,
          setItem: async () => {},
          removeItem: async () => {},
        }
      ),
      onRehydrateStorage: () => (state?: CarState) => {
        if (state) state.setInitialized(true);
      },
    }
  )
);

// Eagerly initialize the store
if (typeof window !== 'undefined') {
  useCarStore.getState().setInitialized(false);
}
