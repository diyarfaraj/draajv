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
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { UserProfileModal } from "./UserProfileModal"
import { useUserProfileStore } from "@/store/userProfileStore"
import { FiSettings, FiEdit2, FiCopy, FiTrash2 } from "react-icons/fi"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/_components/ui/tooltip"

export function DriveEntryList() {
  const router = useRouter()
  const { entries, deleteEntry, addEntry } = useDriveStore()
  const [profileOpen, setProfileOpen] = useState(false)
  const { profile } = useUserProfileStore()
  const [duplicateOpen, setDuplicateOpen] = useState(false)
  const [duplicateDate, setDuplicateDate] = useState("")
  const [duplicateSource, setDuplicateSource] = useState<DriveEntry | null>(null)

  // Calculate totals
  const totalDistance = entries.reduce((sum, e) => sum + (e.distance || 0), 0)
  const totalAmount = totalDistance * 2.5

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Alla körningar</h3>
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline" aria-label="Profil" onClick={() => setProfileOpen(true)}>
            <FiSettings className="w-5 h-5" />
          </Button>
          <Button onClick={() => router.push("/new")}>Ny körning</Button>
          <Button variant="outline" onClick={handleExportCsv}>Exportera CSV</Button>
          <Button variant="outline" onClick={handleExportPdf}>Exportera PDF</Button>
        </div>
      </div>
      <UserProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => router.push(`/new/${entry.id}`)} aria-label="Redigera körning">
                              <FiEdit2 className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Redigera</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => { setDuplicateSource(entry); setDuplicateDate(""); setDuplicateOpen(true) }} aria-label="Duplicera körning">
                              <FiCopy className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicera</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={() => deleteEntry(entry.id)} aria-label="Ta bort körning" className="min-w-[44px]">
                              <FiTrash2 className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ta bort</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
      <Dialog open={duplicateOpen} onOpenChange={setDuplicateOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Välj nytt datum</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => {
            e.preventDefault()
            if (!duplicateSource || !duplicateDate) return
            const { id, createdAt, ...rest } = duplicateSource
            addEntry({
              ...rest,
              date: duplicateDate,
            })
            setDuplicateOpen(false)
          }} className="space-y-4">
            <input
              type="date"
              className="form-input w-full"
              value={duplicateDate}
              onChange={e => setDuplicateDate(e.target.value)}
              required
            />
            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setDuplicateOpen(false)}>Avbryt</Button>
              <Button type="submit">Duplicera</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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

function handleExportPdf() {
  const { entries } = useDriveStore.getState()
  const { profile } = useUserProfileStore.getState()
  const doc = new jsPDF({ orientation: "landscape" })

  // --- Custom Header ---
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text("Utläggsrapport", 14, 20)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(profile.company || "", 14, 28)

  // User info
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(profile.name || "", 14, 44)
  doc.setFontSize(11)
  doc.text(profile.email || "", 14, 52)
  doc.text(`Anställningsnummer: ${profile.employeeId || ""}`, 14, 60)
  doc.setFontSize(10)
  doc.text(`Avdelning: ${profile.department || ""}`, 14, 68)
  doc.text(`Utbetalningskonto: ${profile.account || ""}`, 14, 76)

  // Right column: total, date, purpose, ref
  const totalAmount = entries.reduce((sum, e) => sum + (e.distance || 0) * 2.5, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`Totalt belopp: ${totalAmount.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK`, 150, 44)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const today = new Date().toISOString().slice(0, 10)
  doc.text(`Datum: ${today}`, 150, 52)
  doc.text(`Syfte / Beskrivning: ${profile.purpose || ""}`, 150, 60)
  doc.text(`Ref: ${profile.ref || ""}`, 150, 68)

  // --- Table ---
  const tableData = entries.map(e => [
    e.date,
    `${e.fromAddress || e.location} - ${e.toAddress || e.location}${e.roundtrip ? ' (tur och retur)' : ''}`,
    e.purpose,
    `${e.distance} km`,
    `${(e.distance * 2.5).toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK`
  ])
  autoTable(doc, {
    head: [["Datum", "Resmål", "Beskrivning", "Antal", "Belopp"]],
    body: tableData,
    startY: 90,
    styles: { font: "helvetica", fontSize: 10 },
    headStyles: { fillColor: [240,240,240], textColor: 30, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250,250,250] },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Add summary row at the end
      if (data.pageNumber === (doc.internal as any).getNumberOfPages()) {
        const totalDistance = entries.reduce((sum, e) => sum + (e.distance || 0), 0)
        const totalAmount = totalDistance * 2.5
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        const finalY = (doc as any).lastAutoTable?.finalY ?? (data.cursor ? data.cursor.y + 10 : 40)
        doc.text(
          `Totalt: ${totalDistance} km    ${totalAmount.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK`,
          14,
          finalY + 10
        )
        doc.setFont('helvetica', 'normal')
      }
    }
  })
  doc.save(`korjournal_${today}.pdf`)
} 