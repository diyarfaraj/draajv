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
import { FaCarSide } from "react-icons/fa"

export function DriveEntryList() {
  const router = useRouter()
  const { entries, deleteEntry } = useDriveStore()

  // Calculate totals
  const totalDistance = entries.reduce((sum, e) => sum + (e.distance || 0), 0)
  const totalAmount = totalDistance * 2.5

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
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-2 py-2 md:px-3 font-semibold text-left whitespace-nowrap">Datum</th>
                <th className="px-2 py-2 md:px-3 font-semibold text-left whitespace-nowrap">Resmål</th>
                <th className="px-2 py-2 md:px-3 font-semibold text-left whitespace-nowrap">Beskrivning</th>
                <th className="px-2 py-2 md:px-3 font-semibold text-right whitespace-nowrap">Antal</th>
                <th className="px-2 py-2 md:px-3 font-semibold text-right whitespace-nowrap">Belopp</th>
                <th className="px-2 py-2 md:px-3"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={
                    `border-b last:border-0 hover:bg-accent/40 transition ${idx % 2 === 1 ? 'even:bg-muted/40' : ''}`
                  }
                >
                  <td className="px-2 py-2 md:px-3 whitespace-nowrap flex items-center gap-2">
                    <FaCarSide className="text-blue-500 w-5 h-5 shrink-0" aria-label="Bil" />
                    <span className="text-xs md:text-sm">{entry.date}</span>
                  </td>
                  <td className="px-2 py-2 md:px-3 whitespace-pre-line align-top">
                    <span className="block text-xs md:text-sm font-medium">{entry.fromAddress || entry.location} - {entry.toAddress || entry.location}</span>
                    {entry.roundtrip && (
                      <div className="italic text-xs text-blue-600">Tur och retur</div>
                    )}
                  </td>
                  <td className="px-2 py-2 md:px-3 align-top text-xs md:text-sm">{entry.purpose}</td>
                  <td className="px-2 py-2 md:px-3 text-right align-top text-xs md:text-sm">{entry.distance} km</td>
                  <td className="px-2 py-2 md:px-3 text-right align-top text-xs md:text-sm">{(entry.distance * 2.5).toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK</td>
                  <td className="px-2 py-2 md:px-3 text-right align-top">
                    <div className="flex flex-col md:flex-row gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/new/${entry.id}`)} aria-label="Redigera körning">
                        Redigera
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteEntry(entry.id)} aria-label="Ta bort körning">
                        Ta bort
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/60 font-semibold">
                <td className="px-2 py-2 md:px-3" colSpan={3}>Totalt</td>
                <td className="px-2 py-2 md:px-3 text-right">{totalDistance} km</td>
                <td className="px-2 py-2 md:px-3 text-right">{totalAmount.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
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