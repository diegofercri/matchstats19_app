import { useState } from 'react';
import { Season } from '@types';

/**
 * Type definition for knockout view display modes
 * Defines how knockout matches are presented to users
 */
export type KnockoutViewType = 'list' | 'brackets';

/**
 * Return type interface for useKnockoutView hook
 * Defines knockout view state and control functions
 */
interface UseKnockoutViewReturn {
  knockoutView: KnockoutViewType;
  hasKnockoutPhase: boolean;
  handleKnockoutViewChange: (view: KnockoutViewType) => void;
  resetKnockoutView: () => void;
}

/**
 * Custom hook for managing knockout phase view preferences
 * Handles view mode switching between list and brackets display
 * Detects knockout phase availability in season structure
 * 
 * @param selectedSeason - Currently selected season data
 * @returns Object containing view state, knockout phase detection, and control functions
 */
export const useKnockoutView = (selectedSeason: Season | null): UseKnockoutViewReturn => {
  const [knockoutView, setKnockoutView] = useState<KnockoutViewType>('brackets');

  /**
   * Check if current season has knockout phase
   * Searches through season phases to detect knockout phase availability
   */
  const hasKnockoutPhase = selectedSeason?.phases?.some(
    (phase) => phase.type === 'knockout'
  ) || false;

  /**
   * Handles knockout view mode changes
   * Updates the current knockout view preference
   * 
   * @param view - New knockout view type to set
   */
  const handleKnockoutViewChange = (view: KnockoutViewType) => {
    setKnockoutView(view);
  };

  /**
   * Resets knockout view to default mode
   * Returns view to brackets mode (default preference)
   */
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