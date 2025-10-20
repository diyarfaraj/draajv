"use client"

import { useState } from "react"
import { useCarStore } from "@/store/carStore"
import { useOdometerStore } from "@/store/odometerStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { odometerReadingSchema, type OdometerReadingSchemaType } from "@/lib/schemas"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { getCurrentDateISO } from "@/lib/utils"
import { FiAlertCircle } from "react-icons/fi"

interface OdometerReadingFormProps {
  open: boolean
  onClose: () => void
}

export function OdometerReadingForm({ open, onClose }: OdometerReadingFormProps) {
  const { cars, getDefaultCar } = useCarStore()
  const { addReading, getLatestReadingForCar } = useOdometerStore()
  const [error, setError] = useState<string | null>(null)
  const [selectedCarId, setSelectedCarId] = useState<string>("")

  const defaultCar = getDefaultCar()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<OdometerReadingSchemaType>({
    resolver: zodResolver(odometerReadingSchema),
    defaultValues: {
      carId: defaultCar?.id || "",
      licensePlate: defaultCar?.licensePlate || "",
      date: getCurrentDateISO(),
      odometer: 0,
      notes: "",
    },
  })

  const watchedCarId = watch("carId")

  const onSubmit = (data: OdometerReadingSchemaType) => {
    setError(null)
    const result = addReading(data)

    if (!result.success) {
      setError(result.error || "Ett fel uppstod")
      return
    }

    reset({
      carId: defaultCar?.id || "",
      licensePlate: defaultCar?.licensePlate || "",
      date: getCurrentDateISO(),
      odometer: 0,
      notes: "",
    })
    onClose()
  }

  const handleCarChange = (carId: string) => {
    setSelectedCarId(carId)
    const car = cars.find((c) => c.id === carId)
    if (car) {
      setValue("carId", car.id)
      setValue("licensePlate", car.licensePlate)
    }
  }

  const latestReading = watchedCarId ? getLatestReadingForCar(watchedCarId) : null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lägg till mätarställning</DialogTitle>
        </DialogHeader>

        {cars.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Du måste lägga till en bil först
            </p>
            <Button onClick={onClose}>Stäng</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="carId" className="text-sm font-medium">
                Välj bil *
              </label>
              <select
                id="carId"
                {...register("carId")}
                onChange={(e) => handleCarChange(e.target.value)}
                className="form-select w-full"
              >
                <option value="">Välj en bil...</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.licensePlate}
                    {car.make && ` - ${car.make}`}
                    {car.model && ` ${car.model}`}
                  </option>
                ))}
              </select>
              {errors.carId && (
                <p className="text-sm text-red-600">{errors.carId.message}</p>
              )}
            </div>

            {latestReading && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Senaste avläsning: <span className="font-semibold">{latestReading.odometer} km</span> ({latestReading.date})
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Datum *
                </label>
                <input
                  type="date"
                  id="date"
                  {...register("date")}
                  className="form-input w-full"
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="odometer" className="text-sm font-medium">
                  Mätarställning (km) *
                </label>
                <input
                  type="number"
                  id="odometer"
                  {...register("odometer")}
                  className="form-input w-full"
                  min="0"
                  step="1"
                  placeholder="0"
                />
                {errors.odometer && (
                  <p className="text-sm text-red-600">{errors.odometer.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Anteckningar (valfritt)
              </label>
              <textarea
                id="notes"
                {...register("notes")}
                className="form-input w-full"
                rows={2}
                placeholder="T.ex. Service utförd, däckbyte..."
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                Spara avläsning
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Avbryt
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
