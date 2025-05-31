"use client"

import React, { useState, useEffect } from "react"
import { useDriveStore } from "@/store/driveStore"
import { GoogleAddressAutocomplete } from "./_components/GoogleAddressAutocomplete"
import { LoadScript } from "@react-google-maps/api"

export default function HomePage() {
  // Form state
  const [date, setDate] = useState("")
  const [fromAddress, setFromAddress] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [roundtrip, setRoundtrip] = useState(false)
  const [purpose, setPurpose] = useState("")
  const [vehicleType, setVehicleType] = useState("Privat bil")
  const [hasMounted, setHasMounted] = useState(false)

  // Store
  const { entries, addEntry } = useDriveStore()

  useEffect(() => { setHasMounted(true) }, [])

  if (!hasMounted) return null

  // Dummy distance calculation (replace with real API if needed)
  function calculateDistance(from: string, to: string) {
    if (!from || !to) return 0
    // Här kan du koppla in Google Maps API eller liknande
    // Just nu returneras alltid 56 km som exempel
    return 56
  }

  const baseDistance = calculateDistance(fromAddress, toAddress)
  const distance = roundtrip ? baseDistance * 2 : baseDistance

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
                <iframe
                  title="Karta"
                  src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d106057.0193950292!2d11.818626!3d57.70887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x464ff369c2b2e6e1%3A0x4019078290cfc70!2zR8O2dGVib3Jn!3m2!1d57.70887!2d11.97456!4m5!1s0x4650c1e2b2e6e1%3A0x4019078290cfc70!2zU8O2ZGVybGp1bmdzZ2F0YW4gOCwgR8O2dGVib3Jn!3m2!1d57.70887!2d11.97456!5e0!3m2!1ssv!2sse!4v1717171717171!5m2!1ssv!2sse"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
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
                  <input type="number" className="form-input w-full text-center" value={distance} readOnly />
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