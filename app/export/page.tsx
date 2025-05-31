"use client"
import { useDriveStore } from "@/store/driveStore"
import { generateCsv } from "@/lib/utils"
import { Button } from "@/app/_components/ui/button"

export default function ExportPage() {
  const { entries } = useDriveStore()

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
    <main className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Exportera körjournal</h1>
      <p className="mb-4">Ladda ner alla körningar som CSV enligt Skatteverkets specifikation.</p>
      <Button onClick={handleExport} className="w-full">Exportera CSV</Button>
    </main>
  )
} 