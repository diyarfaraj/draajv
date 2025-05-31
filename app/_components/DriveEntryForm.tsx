"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { driveEntrySchema, type DriveEntrySchemaType } from "@/lib/schemas"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { getCurrentDateISO, getCurrentTime } from "@/lib/utils"

interface DriveEntryFormProps {
  onSubmit: (data: DriveEntrySchemaType) => void
  defaultValues?: Partial<DriveEntrySchemaType>
  submitLabel?: string
}

export function DriveEntryForm({ onSubmit, defaultValues, submitLabel = "Spara" }: DriveEntryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriveEntrySchemaType>({
    resolver: zodResolver(driveEntrySchema),
    defaultValues: {
      date: defaultValues?.date || getCurrentDateISO(),
      purpose: defaultValues?.purpose || "",
      location: defaultValues?.location || "",
      vehicleType: defaultValues?.vehicleType || "",
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? "Redigera körning" : "Ny körning"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Datum
              </label>
              <input
                type="date"
                id="date"
                {...register("date")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Ort
              </label>
              <input
                type="text"
                id="location"
                {...register("location")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="T.ex. Stockholm"
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Starttid
              </label>
              <input
                type="time"
                id="startTime"
                {...register("startTime")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                Sluttid
              </label>
              <input
                type="time"
                id="endTime"
                {...register("endTime")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="startOdometer" className="text-sm font-medium">
                Start mätarställning (km)
              </label>
              <input
                type="number"
                id="startOdometer"
                {...register("startOdometer")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                min="0"
                step="1"
              />
              {errors.startOdometer && (
                <p className="text-sm text-destructive">{errors.startOdometer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="endOdometer" className="text-sm font-medium">
                Stop mätarställning (km)
              </label>
              <input
                type="number"
                id="endOdometer"
                {...register("endOdometer")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                min="0"
                step="1"
              />
              {errors.endOdometer && (
                <p className="text-sm text-destructive">{errors.endOdometer.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="purpose" className="text-sm font-medium">
              Syfte
            </label>
            <input
              type="text"
              id="purpose"
              {...register("purpose")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="T.ex. Kundbesök"
            />
            {errors.purpose && (
              <p className="text-sm text-destructive">{errors.purpose.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 