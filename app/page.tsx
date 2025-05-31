"use client"

import React, { useState } from "react"
import { useDriveStore } from "@/store/driveStore"

export default function HomePage() {
  // Form state
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [startOdometer, setStartOdometer] = useState("")
  const [endOdometer, setEndOdometer] = useState("")
  const [purpose, setPurpose] = useState("")
  const [location, setLocation] = useState("")

  // Store
  const { entries, addEntry } = useDriveStore()

  // Kalkyl
  const distance = (() => {
    const start = parseFloat(startOdometer)
    const end = parseFloat(endOdometer)
    if (isNaN(start) || isNaN(end) || end < start) return 0
    return Math.round((end - start) * 10) / 10
  })()

  // Spara körning
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !startTime || !endTime || !purpose || !location || distance <= 0) return
    addEntry({
      date,
      startTime,
      endTime,
      startOdometer: startOdometer ? Number(startOdometer) : 0,
      endOdometer: endOdometer ? Number(endOdometer) : 0,
      purpose,
      location,
    })
    setDate("")
    setStartTime("")
    setEndTime("")
    setStartOdometer("")
    setEndOdometer("")
    setPurpose("")
    setLocation("")
  }

  return (
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
                  <label htmlFor="startTime" className="block text-sm font-medium mb-1">Starttid</label>
                  <input type="time" id="startTime" name="startTime" className="form-input w-full" required value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium mb-1">Sluttid</label>
                  <input type="time" id="endTime" name="endTime" className="form-input w-full" required value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startOdometer" className="block text-sm font-medium mb-1">Start-mätarställning</label>
                  <input type="number" id="startOdometer" name="startOdometer" className="form-input w-full" min={0} value={startOdometer} onChange={e => setStartOdometer(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="endOdometer" className="block text-sm font-medium mb-1">Slut-mätarställning</label>
                  <input type="number" id="endOdometer" name="endOdometer" className="form-input w-full" min={0} value={endOdometer} onChange={e => setEndOdometer(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium mb-1">Syfte</label>
                <input type="text" id="purpose" name="purpose" className="form-input w-full" required value={purpose} onChange={e => setPurpose(e.target.value)} />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">Ort</label>
                <input type="text" id="location" name="location" className="form-input w-full" required value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Sträcka (km)</label>
                <input type="number" className="form-input w-full text-center" value={distance} readOnly />
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
                        <span className="font-medium">{entry.date}</span> – {entry.purpose} ({entry.distance} km)
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-sm">{entry.location}</span>
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
  )
} 