"use client"

import { useState } from "react"
import { DriveEntry } from "@/lib/types"
import { formatDate, generateCsv } from "@/lib/utils"
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
import { useRouter } from "next/navigation"

export function DriveEntryList() {
  const router = useRouter()
  const { entries, deleteEntry } = useDriveStore()

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Alla körningar</h3>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/new")}>Ny körning</Button>
          <Button variant="outline" onClick={handleExportCsv}>Exportera CSV</Button>
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">Inga körningar sparade än.</p>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div>
                <span className="font-medium">{entry.date}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {entry.vehicleType}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {entry.purpose}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {entry.fromAddress || entry.location} → {entry.toAddress || entry.location}
                  {entry.roundtrip && (
                    <span className="inline-flex items-center ml-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-blue-500 mr-0.5"
                        aria-label="Tur och retur"
                      >
                        <path fillRule="evenodd" d="M4.75 4.75a.75.75 0 0 1 .75-.75h6.19l-1.22-1.22a.75.75 0 1 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.22-1.22H5.5a.75.75 0 0 1-.75-.75zm10.5 10.5a.75.75 0 0 1-.75.75h-6.19l1.22 1.22a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 1 1 1.06 1.06l-1.22 1.22h6.19a.75.75 0 0 1 .75.75z" clipRule="evenodd" />
                      </svg>
                      (tur och retur)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/new/${entry.id}`)}
                >
                  Redigera
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteEntry(entry.id)}
                >
                  Ta bort
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function handleExportCsv() {
  const { entries } = useDriveStore.getState()
  const csv = generateCsv(entries)
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }) // UTF-8 BOM
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `korjournal_${new Date().toISOString().slice(0,10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
} 