import React from "react";
import GenericSelect, { SelectOption } from "@components/ui/Select";

export type KnockoutViewType = 'list' | 'brackets';

interface KnockoutViewSelectProps {
  selectedView: KnockoutViewType;
  onViewChange: (view: KnockoutViewType) => void;
  disabled?: boolean;
}

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

function KnockoutViewSelect({
  selectedView,
  onViewChange,
  disabled = false,
}: KnockoutViewSelectProps) {
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