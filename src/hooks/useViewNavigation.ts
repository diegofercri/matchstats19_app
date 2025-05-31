import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Season } from '@types';
import { KnockoutViewType } from './useKnockoutView';

/**
 * Return type interface for useViewNavigation hook
 * Defines view navigation state and control functions
 */
interface UseViewNavigationReturn {
  activeViewId: string;
  setActiveViewId: (viewId: string) => void;
  requestedViewId: string;
  clearRequestedView: () => void;
}

/**
 * Custom hook for managing view navigation within competition screens
 * Handles active view state and automatic view requests on screen focus
 * 
 * @param selectedSeason - Currently selected season data
 * @param knockoutView - Current knockout view type setting
 * @returns Object containing view navigation state and control functions
 */
export const useViewNavigation = (
  selectedSeason: Season | null, 
  knockoutView: KnockoutViewType
): UseViewNavigationReturn => {
  const [activeViewId, setActiveViewId] = useState<string>('');
  const [requestedViewId, setRequestedViewId] = useState<string>('');

  /**
   * Request matches view when screen gains focus
   * Ensures matches are shown by default when user navigates to screen
   */
  useFocusEffect(
    useCallback(() => {
      setRequestedViewId('matches');
    }, [])
  );

  /**
   * Clears the requested view state
   * Used after processing view requests to prevent interference with manual navigation
   */
  const clearRequestedView = () => {
    setRequestedViewId('');
  };

  return {
    activeViewId,
    setActiveViewId,
    requestedViewId,
    clearRequestedView
  };
};