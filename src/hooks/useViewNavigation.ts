import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Season } from '@types';
import { KnockoutViewType } from './useKnockoutView';

interface UseViewNavigationReturn {
  activeViewId: string;
  setActiveViewId: (viewId: string) => void;
  requestedViewId: string;
  clearRequestedView: () => void;
}

export const useViewNavigation = (
  selectedSeason: Season | null, 
  knockoutView: KnockoutViewType
): UseViewNavigationReturn => {
  const [activeViewId, setActiveViewId] = useState<string>('');
  const [requestedViewId, setRequestedViewId] = useState<string>('');

  // Request matches when screen focuses
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused - requesting matches');
      setRequestedViewId('matches');
    }, [])
  );

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