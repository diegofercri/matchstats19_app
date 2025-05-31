// SeasonSelect.tsx
import React from "react";
import Select, { SelectOption } from "@components/ui/Select";

/**
 * Interface for season data structure
 * Defines season properties for selector options
 */
interface Season {
  label: string;
  value: string;
  isDisabled?: boolean;
}

/**
 * Props interface for SeasonSelect component
 * Defines season selection behavior and appearance options
 */
interface SeasonSelectProps {
  seasons: Season[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Season selector component for competition filtering
 * Provides dropdown interface for selecting competition seasons
 * Wraps generic Select component with season-specific configuration
 * 
 * @param props - Season select properties including options and handlers
 * @returns JSX element containing Select component configured for seasons
 */
function SeasonSelect({
  seasons,
  selectedValue,
  onValueChange,
  placeholder = "Temporada",
  disabled = false,
}: SeasonSelectProps) {
  /**
   * Converts seasons to SelectOption format
   * Maps season data to generic Select component option structure
   */
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