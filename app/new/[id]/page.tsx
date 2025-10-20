"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDriveStore } from "@/store/driveStore"
import { useCarStore } from "@/store/carStore"
import { useOdometerStore } from "@/store/odometerStore"
import { useUserProfileStore } from "@/store/userProfileStore"
import { GoogleAddressAutocomplete } from "../../_components/GoogleAddressAutocomplete"
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api"
import { getDistanceInKm } from "@/lib/getDistance"
import { GoogleMapsLoader } from "../../_components/GoogleMapsLoader"
import { Button } from "../../_components/ui/button"
import { FiInfo } from "react-icons/fi"

export default function EditDrivePage() {
  const router = useRouter()
  const params = useParams()
  const { getEntryById, updateEntry } = useDriveStore()

  // State for form fields - initialize with defaults
  const [date, setDate] = useState("")
  const [fromAddress, setFromAddress] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [roundtrip, setRoundtrip] = useState(false)
  const [purpose, setPurpose] = useState("")
  const [vehicleType, setVehicleType] = useState("Privat bil")
  const [category, setCategory] = useState<"Tjänsteresa" | "Övrigt">("Tjänsteresa")
  const [selectedCarId, setSelectedCarId] = useState<string>("")
  const [startOdometer, setStartOdometer] = useState<number>(0)
  const [endOdometer, setEndOdometer] = useState<number>(0)
  const [hasMounted, setHasMounted] = useState(false)
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null)
  const [loadingDistance, setLoadingDistance] = useState(false)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Stores
  const { cars } = useCarStore()
  const { getLatestReadingForCar } = useOdometerStore()
  const { setDefaultAddresses } = useUserProfileStore()

  // Get the ID and entry
  const id = params && 'id' in params ? (typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "") : ""
  const entry = id ? getEntryById(id) : undefined

  // Initialize form fields from entry
  useEffect(() => {
    if (entry) {
      setDate(entry.date)
      setFromAddress(entry.fromAddress || entry.location || "")
      setToAddress(entry.toAddress || entry.location || "")
      setRoundtrip(entry.roundtrip)
      setPurpose(entry.purpose)
      setVehicleType(entry.vehicleType)
      setCategory(entry.category || "Tjänsteresa")
      setStartOdometer(entry.startOdometer || 0)
      setEndOdometer(entry.endOdometer || 0)

      // If entry has a license plate, find and set the car
      if (entry.licensePlate) {
        const car = cars.find(c => c.licensePlate === entry.licensePlate)
        if (car) {
          setSelectedCarId(car.id)
        }
      }
    }
  }, [entry, cars])

  useEffect(() => { setHasMounted(true) }, [])

  useEffect(() => {
    async function fetchDirections() {
      if (!fromAddress || !toAddress || !mapLoaded) {
        setDirections(null)
        return
      }
      if (!(window.google && window.google.maps)) return
      const directionsService = new window.google.maps.DirectionsService()

      directionsService.route(
        {
          origin: fromAddress,
          destination: roundtrip ? fromAddress : toAddress,
          waypoints: roundtrip ? [{ location: toAddress, stopover: false }] : [],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result)
          } else {
            setDirections(null)
          }
        }
      )
    }
    fetchDirections()
  }, [fromAddress, toAddress, mapLoaded, roundtrip])

  useEffect(() => {
    async function handleCalculateDistance() {
      if (!fromAddress || !toAddress) return
      setLoadingDistance(true)
      const dist = await getDistanceInKm(fromAddress, toAddress)
      setCalculatedDistance(dist)
      setLoadingDistance(false)
    }
    if (fromAddress && toAddress) {
      handleCalculateDistance()
    } else {
      setCalculatedDistance(null)
    }
  }, [fromAddress, toAddress])

  // Check for invalid params or missing entry
  if (!params || !('id' in params) || !id) {
    return (
      <main className="container mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">Körning hittades inte</h2>
        <Button onClick={() => router.push("/")}>Tillbaka</Button>
      </main>
    )
  }

  if (!entry) {
    return (
      <main className="container mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">Körning hittades inte</h2>
        <Button onClick={() => router.push("/")}>Tillbaka</Button>
      </main>
    )
  }

  if (!hasMounted) return null

  const distance = calculatedDistance
    ? roundtrip
      ? Math.round(calculatedDistance * 2 * 10) / 10
      : Math.round(calculatedDistance * 10) / 10
    : 0

  // Get selected car info
  const selectedCar = cars.find(c => c.id === selectedCarId)
  const latestReading = selectedCarId ? getLatestReadingForCar(selectedCarId) : null

  // Spara ändringar
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entry || !date || !fromAddress || !toAddress || distance <= 0) return

    // Save addresses as defaults for next time
    setDefaultAddresses(fromAddress, toAddress)

    updateEntry(entry.id, {
      date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      startOdometer: startOdometer,
      endOdometer: endOdometer,
      fromAddress,
      toAddress,
      roundtrip,
      purpose,
      vehicleType,
      category,
      licensePlate: selectedCar?.licensePlate,
    })
    router.push("/")
  }

  return (
    <GoogleMapsLoader>
      <main className="min-h-screen w-full bg-background text-foreground">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vänster kolumn: Karta */}
            <section className="w-full h-[350px] md:h-[600px] flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Karta</h2>
              <div className="flex-1 border-2 border-dashed rounded-lg overflow-hidden">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{ lat: 59.3293, lng: 18.0686 }} // Stockholm default
                  zoom={7}
                  onLoad={() => setMapLoaded(true)}
                >
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              </div>
            </section>

            {/* Höger kolumn: Formulär */}
            <section className="w-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Redigera körning</h2>
              <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Datum *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-input w-full"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>

                {/* Car Selection */}
                {cars.length > 0 && (
                  <div>
                    <label htmlFor="car" className="block text-sm font-medium mb-1">Bil</label>
                    <select
                      id="car"
                      value={selectedCarId}
                      onChange={e => setSelectedCarId(e.target.value)}
                      className="form-select w-full"
                    >
                      <option value="">Ingen bil vald</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                          {car.licensePlate} {car.make && `- ${car.make}`} {car.model && car.model}
                        </option>
                      ))}
                    </select>
                    {latestReading && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded flex items-start gap-2">
                        <FiInfo className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <p className="text-xs text-blue-800 dark:text-blue-200">
                          Senaste mätarställning: <strong>{latestReading.odometer} km</strong> ({latestReading.date})
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fromAddress" className="block text-sm font-medium mb-1">Från adress</label>
                    <GoogleAddressAutocomplete
                      id="fromAddress"
                      name="fromAddress"
                      placeholder="Ange startadress"
                      value={fromAddress}
                      onChange={setFromAddress}
                    />
                  </div>
                  <div>
                    <label htmlFor="toAddress" className="block text-sm font-medium mb-1">Till adress</label>
                    <GoogleAddressAutocomplete
                      id="toAddress"
                      name="toAddress"
                      placeholder="Ange destinationsadress"
                      value={toAddress}
                      onChange={setToAddress}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="roundtrip"
                    name="roundtrip"
                    className="form-checkbox"
                    checked={roundtrip}
                    onChange={e => setRoundtrip(e.target.checked)}
                  />
                  <label htmlFor="roundtrip" className="text-sm">Tur och retur</label>
                </div>
                <div>
                  <label className="block text-xs mb-1">Sträcka (km)</label>
                  <input
                    type="number"
                    className="form-input w-full text-center"
                    value={loadingDistance ? "" : distance}
                    readOnly
                    placeholder={loadingDistance ? "Beräknar..." : ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium mb-1">Fordonstyp</label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      className="form-select w-full"
                      value={vehicleType}
                      onChange={e => setVehicleType(e.target.value)}
                    >
                      <option>Privat bil</option>
                      <option>Tjänstebil</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Kategori</label>
                    <select
                      id="category"
                      name="category"
                      className="form-select w-full"
                      value={category}
                      onChange={e => setCategory(e.target.value as "Tjänsteresa" | "Övrigt")}
                    >
                      <option value="Tjänsteresa">Tjänsteresa</option>
                      <option value="Övrigt">Övrigt</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium mb-1">Syfte</label>
                  <input
                    type="text"
                    id="purpose"
                    name="purpose"
                    className="form-input w-full"
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">Spara ändringar</Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/")} className="flex-1">
                    Avbryt
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </GoogleMapsLoader>
  )
} 