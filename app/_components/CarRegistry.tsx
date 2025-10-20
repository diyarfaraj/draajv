"use client"

import { useState } from "react"
import { useCarStore } from "@/store/carStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { carSchema, type CarSchemaType } from "@/lib/schemas"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { FiEdit2, FiTrash2, FiStar } from "react-icons/fi"
import { Car } from "@/lib/types"

interface CarRegistryProps {
  open: boolean
  onClose: () => void
}

export function CarRegistry({ open, onClose }: CarRegistryProps) {
  const { cars, addCar, updateCar, deleteCar, setDefaultCar } = useCarStore()
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CarSchemaType>({
    resolver: zodResolver(carSchema),
    defaultValues: editingCar || {
      licensePlate: "",
      make: "",
      model: "",
      color: "",
      isDefault: false,
    },
  })

  const onSubmit = (data: CarSchemaType) => {
    if (editingCar) {
      updateCar(editingCar.id, data)
    } else {
      addCar(data)
    }
    reset()
    setEditingCar(null)
  }

  const handleEdit = (car: Car) => {
    setEditingCar(car)
    reset({
      licensePlate: car.licensePlate,
      make: car.make || "",
      model: car.model || "",
      color: car.color || "",
      isDefault: car.isDefault,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna bil?")) {
      deleteCar(id)
    }
  }

  const handleSetDefault = (id: string) => {
    setDefaultCar(id)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bilregister</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Car Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium">{editingCar ? "Redigera bil" : "Lägg till ny bil"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="licensePlate" className="text-sm font-medium">
                  Registreringsnummer *
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  {...register("licensePlate")}
                  className="form-input w-full uppercase"
                  placeholder="ABC123"
                  maxLength={7}
                />
                {errors.licensePlate && (
                  <p className="text-sm text-red-600">{errors.licensePlate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="make" className="text-sm font-medium">
                  Märke
                </label>
                <input
                  type="text"
                  id="make"
                  {...register("make")}
                  className="form-input w-full"
                  placeholder="Volvo"
                />
                {errors.make && <p className="text-sm text-red-600">{errors.make.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  Modell
                </label>
                <input
                  type="text"
                  id="model"
                  {...register("model")}
                  className="form-input w-full"
                  placeholder="V60"
                />
                {errors.model && <p className="text-sm text-red-600">{errors.model.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="color" className="text-sm font-medium">
                  Färg
                </label>
                <input
                  type="text"
                  id="color"
                  {...register("color")}
                  className="form-input w-full"
                  placeholder="Svart"
                />
                {errors.color && <p className="text-sm text-red-600">{errors.color.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                {...register("isDefault")}
                className="form-checkbox"
              />
              <label htmlFor="isDefault" className="text-sm">
                Använd som standardbil
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingCar ? "Uppdatera" : "Lägg till"}
              </Button>
              {editingCar && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCar(null)
                    reset({
                      licensePlate: "",
                      make: "",
                      model: "",
                      color: "",
                      isDefault: false,
                    })
                  }}
                >
                  Avbryt
                </Button>
              )}
            </div>
          </form>

          {/* Cars List */}
          <div className="space-y-2">
            <h3 className="font-medium">Mina bilar ({cars.length})</h3>
            {cars.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Inga bilar tillagda än
              </p>
            ) : (
              <div className="space-y-2">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className={`p-3 rounded-lg border ${
                      car.isDefault ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-border"
                    } flex items-center justify-between`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{car.licensePlate}</span>
                        {car.isDefault && (
                          <FiStar className="text-blue-600 fill-blue-600 w-4 h-4" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {[car.make, car.model, car.color].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!car.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetDefault(car.id)}
                          title="Sätt som standard"
                        >
                          <FiStar className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(car)}>
                        <FiEdit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(car.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Stäng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
