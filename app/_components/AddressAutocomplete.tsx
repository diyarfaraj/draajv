"use client"
import * as React from "react"
import { SearchBox } from "@mapbox/search-js-react"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  name?: string
}

export function AddressAutocomplete({ value, onChange, placeholder, id, name }: AddressAutocompleteProps) {
  return (
    <SearchBox
      accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
      value={value}
      onRetrieve={(res) => {
        if (res && res.features && res.features[0]) {
          onChange(res.features[0].properties.full_address || res.features[0].place_name)
        }
      }}
      options={{
        language: "sv",
        country: "SE",
        types: ["address", "place", "locality"],
      }}
      inputProps={{
        id,
        name,
        placeholder,
        className: "form-input w-full",
        autoComplete: "off",
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
      }}
    />
  )
} 