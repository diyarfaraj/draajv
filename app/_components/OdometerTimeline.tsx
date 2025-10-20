"use client"

import { useState } from "react"
import { useOdometerStore } from "@/store/odometerStore"
import { useCarStore } from "@/store/carStore"
import { Button } from "./ui/button"
import { FiTrash2, FiTrendingUp, FiCalendar } from "react-icons/fi"
import { OdometerReading } from "@/lib/types"

export function OdometerTimeline() {
  const { readings, deleteReading } = useOdometerStore()
  const { cars } = useCarStore()
  const [selectedCarId, setSelectedCarId] = useState<string>("all")

  const filteredReadings =
    selectedCarId === "all"
      ? readings
      : readings.filter((r) => r.carId === selectedCarId)

  const calculateDistanceDriven = (reading: OdometerReading, index: number): number | null => {
    // Find next older reading for same car
    const nextReading = filteredReadings
      .slice(index + 1)
      .find((r) => r.carId === reading.carId)

    if (!nextReading) return null

    return Math.round((reading.odometer - nextReading.odometer) * 10) / 10
  }

  const handleDelete = (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna avläsning?")) {
      deleteReading(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mätarställningar</h3>
        {cars.length > 0 && (
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            className="form-select text-sm"
          >
            <option value="all">Alla bilar</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.licensePlate}
              </option>
            ))}
          </select>
        )}
      </div>

      {filteredReadings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FiCalendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Inga mätarställningar sparade än</p>
          <p className="text-sm mt-1">Lägg till din första avläsning för att börja spåra</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredReadings.map((reading, index) => {
            const car = cars.find((c) => c.id === reading.carId)
            const distanceDriven = calculateDistanceDriven(reading, index)

            return (
              <div
                key={reading.id}
                className="p-3 rounded-lg border border-border hover:bg-accent/20 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm bg-muted px-2 py-0.5 rounded">
                        {reading.licensePlate}
                      </span>
                      <span className="text-sm text-muted-foreground">{reading.date}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-1">
                      <span className="text-2xl font-bold">
                        {reading.odometer.toLocaleString("sv-SE")} km
                      </span>
                      {distanceDriven !== null && distanceDriven > 0 && (
                        <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <FiTrendingUp className="w-4 h-4" />
                          <span>+{distanceDriven} km</span>
                        </div>
                      )}
                    </div>

                    {reading.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{reading.notes}</p>
                    )}

                    {car && (car.make || car.model) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {[car.make, car.model].filter(Boolean).join(" ")}
                      </p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(reading.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredReadings.length > 0 && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Totalt {filteredReadings.length} avläsningar</span>
            {selectedCarId !== "all" && filteredReadings.length > 0 && (
              <span>
                Senaste: {filteredReadings[0].odometer.toLocaleString("sv-SE")} km
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
