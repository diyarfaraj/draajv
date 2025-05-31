"use client"

import React, { useState, useEffect } from "react"
import { useDriveStore } from "@/store/driveStore"
import { GoogleAddressAutocomplete } from "./_components/GoogleAddressAutocomplete"
import { LoadScript, GoogleMap, DirectionsRenderer } from "@react-google-maps/api"
import { getDistanceInKm } from "@/lib/getDistance"

export default function HomePage() {
  // All hooks at the top
  const [date, setDate] = useState("")
  const [fromAddress, setFromAddress] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [roundtrip, setRoundtrip] = useState(false)
  const [purpose, setPurpose] = useState("")
  const [vehicleType, setVehicleType] = useState("Privat bil")
  const [hasMounted, setHasMounted] = useState(false)
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null)
  const [loadingDistance, setLoadingDistance] = useState(false)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Store
  const { entries, addEntry } = useDriveStore()

  useEffect(() => { setHasMounted(true) }, [])

  useEffect(() => {
    async function fetchDirections() {
      if (!fromAddress || !toAddress) {
        setDirections(null);
        return;
      }
      if (!(window.google && window.google.maps)) return;
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: fromAddress,
          destination: toAddress,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          } else {
            setDirections(null);
          }
        }
      );
    }
    fetchDirections();
  }, [fromAddress, toAddress]);

  useEffect(() => {
    async function handleCalculateDistance() {
      if (!fromAddress || !toAddress) return;
      setLoadingDistance(true);
      const dist = await getDistanceInKm(
        fromAddress,
        toAddress
      );
      setCalculatedDistance(dist);
      setLoadingDistance(false);
    }
    if (fromAddress && toAddress) {
      handleCalculateDistance();
    } else {
      setCalculatedDistance(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAddress, toAddress]);

  if (!hasMounted) return null

  const distance = calculatedDistance
    ? roundtrip
      ? Math.round(calculatedDistance * 2 * 10) / 10
      : Math.round(calculatedDistance * 10) / 10
    : 0;

  // Spara körning
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !fromAddress || !toAddress || distance <= 0) return
    addEntry({
      date,
      purpose,
      vehicleType,
    })
    setDate("")
    setFromAddress("")
    setToAddress("")
    setRoundtrip(false)
    setPurpose("")
    setVehicleType("Privat bil")
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
      language="sv"
      region="SE"
    >
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
                >
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              </div>
            </section>

            {/* Höger kolumn: Formulär + lista */}
            <section className="w-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Ny körning</h2>
              <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Datum *</label>
                  <input type="date" id="date" name="date" className="form-input w-full" required value={date} onChange={e => setDate(e.target.value)} />
                </div>
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
                  <input type="checkbox" id="roundtrip" name="roundtrip" className="form-checkbox" checked={roundtrip} onChange={e => setRoundtrip(e.target.checked)} />
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
                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium mb-1">Fordonstyp</label>
                  <select id="vehicleType" name="vehicleType" className="form-select w-full" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                    <option>Privat bil</option>
                    <option>Tjänstebil</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium mb-1">Syfte</label>
                  <input type="text" id="purpose" name="purpose" className="form-input w-full" value={purpose} onChange={e => setPurpose(e.target.value)} />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition">Spara körning</button>
              </form>

              {/* Lista med körningar */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Alla körningar</h3>
                {entries.length === 0 ? (
                  <p className="text-muted-foreground">Inga körningar sparade än.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {entries.map((entry, i) => (
                      <li key={i} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <span className="block text-xs text-muted-foreground">{fromAddress} → {toAddress}{roundtrip && " (tur & retur)"}</span>
                          <span className="block text-xs text-muted-foreground">{entry.vehicleType}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </LoadScript>
  )
} 