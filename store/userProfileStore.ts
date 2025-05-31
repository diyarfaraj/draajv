import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  name: string
  email: string
  employeeId: string
  department: string
  account: string
  company: string
  ref: string
  purpose: string
}

interface UserProfileState {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
  updateProfile: (profile: Partial<UserProfile>) => void
}

const defaultProfile: UserProfile = {
  name: 'Ditt Namn',
  email: 'namn@example.com',
  employeeId: '01',
  department: 'Avdelning',
  account: '1234567890',
  company: 'Ditt Företag AB',
  ref: 'Ref123',
  purpose: 'Milersättning',
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      setProfile: (profile) => set({ profile }),
      updateProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),
    }),
    { name: 'user-profile-storage' }
  )
) 