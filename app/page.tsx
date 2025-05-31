"use client"

import { DriveEntryList } from "./_components/DriveEntryList"
import { GoogleMapsLoader } from "./_components/GoogleMapsLoader"
import { Button } from "./_components/ui/button"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./_components/ThemeToggle"

export default function HomePage() {
  const router = useRouter()

  return (
    <GoogleMapsLoader>
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Körjournal</h1>
            <ThemeToggle />
          </div>
          <DriveEntryList />
        </div>
      </main>
    </GoogleMapsLoader>
  )
} 