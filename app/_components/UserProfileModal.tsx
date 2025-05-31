"use client"

import { useState } from "react"
import { useUserProfileStore } from "@/store/userProfileStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/ui/dialog"
import { Button } from "@/app/_components/ui/button"

interface UserProfileModalProps {
  open: boolean
  onClose: () => void
}

export function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const { profile, updateProfile } = useUserProfileStore()
  const [form, setForm] = useState(profile)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSave() {
    updateProfile(form)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Profiluppgifter</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSave() }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Namn</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">E-post</label>
              <input name="email" value={form.email} onChange={handleChange} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Anställningsnummer</label>
              <input name="employeeId" value={form.employeeId} onChange={handleChange} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Avdelning</label>
              <input name="department" value={form.department} onChange={handleChange} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Utbetalningskonto</label>
              <input name="account" value={form.account} onChange={handleChange} className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Företag</label>
              <input name="company" value={form.company} onChange={handleChange} className="form-input w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">Syfte / Beskrivning</label>
              <input name="purpose" value={form.purpose} onChange={handleChange} className="form-input w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">Ref</label>
              <input name="ref" value={form.ref} onChange={handleChange} className="form-input w-full" />
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Avbryt</Button>
            <Button type="submit">Spara</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 