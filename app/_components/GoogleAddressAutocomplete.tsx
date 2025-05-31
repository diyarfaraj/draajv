"use client";
import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

export function GoogleAddressAutocomplete({ value, onChange, placeholder, id, name }: Props) {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "se" },
      language: "sv",
    },
    debounce: 300,
    defaultValue: value,
  });

  return (
    <Combobox
      onSelect={(address) => {
        setValue(address, false);
        onChange(address);
        clearSuggestions();
      }}
    >
      <ComboboxInput
        id={id}
        name={name}
        className="form-input w-full"
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        disabled={!ready}
        placeholder={placeholder}
        autoComplete="off"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
} 