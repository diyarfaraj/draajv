"use client"

import { useState } from "react"
import { DriveEntry } from "@/lib/types"
import { DriveEntryForm } from "./_components/DriveEntryForm"
import { DriveEntryList } from "./_components/DriveEntryList"
import { useDriveStore } from "@/store/driveStore"
import { ThemeToggle } from "./_components/ThemeToggle"
import { Button } from "./_components/ui/button"
import { generateCsv } from "@/lib/utils"

export default function Home() {
  const { entries, addEntry, updateEntry, deleteEntry } = useDriveStore()
  const [showForm, setShowForm] = useState(false)

  const handleAddEntry = (data: Omit<DriveEntry, "id" | "distance" | "createdAt">) => {
    addEntry(data)
    setShowForm(false)
  }

  const handleEditEntry = (id: string, data: Omit<DriveEntry, "id" | "distance" | "createdAt">) => {
    updateEntry(id, data)
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
  }

  const handleExport = () => {
    const csv = generateCsv(entries)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `korjournal-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Körjournal</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleExport} variant="outline">
            Exportera CSV
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full">
          Ny körning
        </Button>
      ) : (
        <DriveEntryForm onSubmit={handleAddEntry} />
      )}

      <DriveEntryList
        entries={entries}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
      />
    </main>
  )
} 