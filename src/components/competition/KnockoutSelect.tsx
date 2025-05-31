import React from "react";
import GenericSelect, { SelectOption } from "@components/ui/Select";

/**
 * Type definition for knockout view display modes
 * Defines available visualization options for knockout phases
 */
export type KnockoutViewType = 'list' | 'brackets';

/**
 * Props interface for KnockoutViewSelect component
 * Defines knockout view selection behavior and state management
 */
interface KnockoutViewSelectProps {
  selectedView: KnockoutViewType;
  onViewChange: (view: KnockoutViewType) => void;
  disabled?: boolean;
}

/**
 * Available knockout view options with Spanish labels for UI
 * Provides user-friendly options for knockout phase visualization
 */
const knockoutViewOptions: SelectOption[] = [
  {
    label: "Lista",
    value: "list"
  },
  {
    label: "Brackets",
    value: "brackets"
  }
];

/**
 * Knockout view selector component for switching between display modes
 * Provides dropdown interface for selecting knockout phase visualization type
 * Wraps generic Select component with knockout-specific configuration
 * 
 * @param props - Knockout view select properties including current view and change handler
 * @returns JSX element containing Select component configured for knockout views
 */
function KnockoutViewSelect({
  selectedView,
  onViewChange,
  disabled = false,
}: KnockoutViewSelectProps) {
  /**
   * Handles view change with proper type casting
   * Converts string value to KnockoutViewType for type safety
   * 
   * @param value - Selected view value as string
   */
  const handleViewChange = (value: string) => {
    onViewChange(value as KnockoutViewType);
  };

  return (
    <GenericSelect
      options={knockoutViewOptions}
      selectedValue={selectedView}
      onValueChange={handleViewChange}
      placeholder="Vista"
      disabled={disabled}
      width={120}
    />
  );
}

export default KnockoutViewSelect;