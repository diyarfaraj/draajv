"use client"

import { useState } from "react"
import { DriveEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import { DriveEntryForm } from "./DriveEntryForm"
import { useDriveStore } from "@/store/driveStore"

interface DriveEntryListProps {
  entries: DriveEntry[]
  onEdit: (id: string, data: Omit<DriveEntry, "id" | "distance" | "createdAt">) => void
  onDelete: (id: string) => void
}

export function DriveEntryList({ entries, onEdit, onDelete }: DriveEntryListProps) {
  const [editingEntry, setEditingEntry] = useState<DriveEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<DriveEntry | null>(null)

  const handleEdit = (entry: DriveEntry) => {
    setEditingEntry(entry)
  }

  const handleDelete = (entry: DriveEntry) => {
    setDeletingEntry(entry)
  }

  const handleEditSubmit = (data: Omit<DriveEntry, "id" | "distance" | "createdAt">) => {
    if (editingEntry) {
      onEdit(editingEntry.id, data)
      setEditingEntry(null)
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingEntry) {
      onDelete(deletingEntry.id)
      setDeletingEntry(null)
    }
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {formatDate(entry.date, entry.startTime)}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(entry)}
              >
                Redigera
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(entry)}
              >
                Radera
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tid</p>
                <p>{entry.startTime} - {entry.endTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sträcka</p>
                <p>{entry.distance} km</p>
              </div>
              <div>
                <p className="text-muted-foreground">Syfte</p>
                <p>{entry.purpose}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ort</p>
                <p>{entry.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingEntry && (
        <Dialog open onOpenChange={() => setEditingEntry(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redigera körning</DialogTitle>
            </DialogHeader>
            <DriveEntryForm
              onSubmit={handleEditSubmit}
              defaultValues={editingEntry}
              submitLabel="Uppdatera"
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!deletingEntry} onOpenChange={() => setDeletingEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att radera körningen permanent. Denna åtgärd kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 