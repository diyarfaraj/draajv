import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import localForage from 'localforage';
import { DriveEntry, DriveFormValues } from '@/lib/types';
import { calculateDistance } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is installed, or use crypto.randomUUID

// Configure localForage if needed (e.g., custom store name)
localForage.config({
  name: 'KorjournalApp',
  storeName: 'drive_entries',
  description: 'Lagring för körjournaldata',
});

interface DriveState {
  entries: DriveEntry[];
  addEntry: (entryData: DriveFormValues) => void;
  updateEntry: (id: string, entryData: DriveFormValues) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => DriveEntry | undefined;
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;
}

const driveStoreCreator: StateCreator<DriveState, [], [], DriveState> = (set, get) => ({
  entries: [],
  isInitialized: false,
  setInitialized: (isInitialized: boolean) => set({ isInitialized }),
  addEntry: (entryData: DriveFormValues) => {
    const newEntry: DriveEntry = {
      ...entryData,
      id: crypto.randomUUID ? crypto.randomUUID() : uuidv4(), // Use crypto.randomUUID if available
      distance: calculateDistance(entryData.startOdometer, entryData.endOdometer),
      createdAt: new Date().toISOString(),
    };
    set((state: DriveState) => ({
      entries: [newEntry, ...state.entries].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    }));
  },
  updateEntry: (id: string, entryData: DriveFormValues) => {
    set((state: DriveState) => ({
      entries: state.entries.map((entry: DriveEntry) =>
        entry.id === id
          ? { ...entry, ...entryData, distance: calculateDistance(entryData.startOdometer, entryData.endOdometer) }
          : entry
      ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    }));
  },
  deleteEntry: (id: string) => {
    set((state: DriveState) => ({
      entries: state.entries.filter((entry: DriveEntry) => entry.id !== id),
    }));
  },
  getEntryById: (id: string) => {
    return get().entries.find((entry: DriveEntry) => entry.id === id);
  }
});

export const useDriveStore = create<DriveState>()(
  persist(
    driveStoreCreator,
    {
      name: 'drive-entries-storage', // name of the item in storage
      storage: createJSONStorage(() => localForage), // use localForage
      onRehydrateStorage: () => (state?: DriveState) => {
        if (state) state.setInitialized(true);
      },
    } as PersistOptions<DriveState> // Type assertion for PersistOptions
  )
);

// Eagerly initialize the store by calling a method or accessing a property
// This helps kick off the rehydration process from localForage
useDriveStore.getState().setInitialized(false); // Initial call to ensure hydration starts 