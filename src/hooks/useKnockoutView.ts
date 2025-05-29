import { useState } from 'react';
import { Season } from '@types';

export type KnockoutViewType = 'list' | 'brackets';

interface UseKnockoutViewReturn {
  knockoutView: KnockoutViewType;
  hasKnockoutPhase: boolean;
  handleKnockoutViewChange: (view: KnockoutViewType) => void;
  resetKnockoutView: () => void;
}

export const useKnockoutView = (selectedSeason: Season | null): UseKnockoutViewReturn => {
  const [knockoutView, setKnockoutView] = useState<KnockoutViewType>('brackets');

  // Check if current season has knockout phase
  const hasKnockoutPhase = selectedSeason?.phases?.some(
    (phase) => phase.type === 'knockout'
  ) || false;

  const handleKnockoutViewChange = (view: KnockoutViewType) => {
    setKnockoutView(view);
  };

  // Reset knockout view to default
  const resetKnockoutView = () => {
    setKnockoutView('brackets');
  };

  return {
    knockoutView,
    hasKnockoutPhase,
    handleKnockoutViewChange,
    resetKnockoutView
  };
};