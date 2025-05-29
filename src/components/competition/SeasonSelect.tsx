// SeasonSelect.tsx
import React from "react";
import Select, { SelectOption } from "@components/ui/Select";

interface Season {
  label: string;
  value: string;
  isDisabled?: boolean;
}

interface SeasonSelectProps {
  seasons: Season[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SeasonSelect({
  seasons,
  selectedValue,
  onValueChange,
  placeholder = "Temporada",
  disabled = false,
}: SeasonSelectProps) {
  // Convert seasons to SelectOption format
  const options: SelectOption[] = seasons.map(season => ({
    label: season.label,
    value: season.value,
    isDisabled: season.isDisabled,
  }));

  return (
    <Select
      options={options}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      width={140}
    />
  );
}

export default SeasonSelect;