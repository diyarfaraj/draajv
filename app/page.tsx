"use client"

import { useState } from "react"
import { DriveEntryList } from "./_components/DriveEntryList"
import { GoogleMapsLoader } from "./_components/GoogleMapsLoader"
import { OdometerTimeline } from "./_components/OdometerTimeline"
import { OdometerReadingForm } from "./_components/OdometerReadingForm"
import { CarRegistry } from "./_components/CarRegistry"
import { Button } from "./_components/ui/button"
import { useRouter } from "next/navigation"
import { Header } from "./_components/Header"
import { FiActivity } from "react-icons/fi"

export default function HomePage() {
  const router = useRouter()
  const [odometerFormOpen, setOdometerFormOpen] = useState(false)
  const [carRegistryOpen, setCarRegistryOpen] = useState(false)

  return (
    <GoogleMapsLoader>
      <main className="container mx-auto p-4">
        <div className="max-w-7xl mx-auto">
          <Header
            showCarRegistryButton
            onCarRegistryClick={() => setCarRegistryOpen(true)}
          />

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Drive Entries (2/3 width on large screens) */}
            <div className="lg:col-span-2">
              <DriveEntryList />
            </div>

            {/* Right Column - Odometer Readings (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mätarställningar</h2>
                    <Button
                      size="sm"
                      onClick={() => setOdometerFormOpen(true)}
                      className="gap-2"
                    >
                      <FiActivity className="w-4 h-4" />
                      <span className="hidden sm:inline">Lägg till</span>
                    </Button>
                  </div>

                  <OdometerTimeline />

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCarRegistryOpen(true)}
                      className="w-full gap-2"
                    >
                      <FiTruck className="w-4 h-4" />
                      <span>Hantera bilar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <OdometerReadingForm
        open={odometerFormOpen}
        onClose={() => setOdometerFormOpen(false)}
      />
      <CarRegistry open={carRegistryOpen} onClose={() => setCarRegistryOpen(false)} />
    </GoogleMapsLoader>
  )
} 