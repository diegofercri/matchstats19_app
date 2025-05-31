// hooks/useLiveData.ts
import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useLiveData hook
 * Defines live data state and control functions for real-time updates
 */
interface UseLiveDataReturn {
  liveMatches: Match[];
  loading: boolean;
  error: string | null;
  refreshLiveData: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  isAutoRefreshing: boolean;
}

/**
 * Custom hook for managing live match data with auto-refresh capabilities
 * Provides real-time match updates with configurable refresh intervals
 * Handles automatic cleanup and interval management
 * 
 * @param autoRefreshInterval - Refresh interval in milliseconds (default: 60000ms)
 * @returns Object containing live matches data and auto-refresh controls
 */
export const useLiveData = (autoRefreshInterval: number = 60000): UseLiveDataReturn => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Refreshes live match data from the API
   * Fetches current live matches and updates state
   */
  const refreshLiveData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const matches = await footballService.getLiveMatches();
      setLiveMatches(matches);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener datos en vivo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Starts automatic refresh of live data at specified intervals
   * Performs initial refresh and sets up recurring updates
   */
  const startAutoRefresh = useCallback(() => {
    if (!isAutoRefreshing) {
      // Initial refresh
      refreshLiveData();
      
      // Set up interval for recurring updates
      const id = setInterval(refreshLiveData, autoRefreshInterval);
      setIntervalId(id);
      setIsAutoRefreshing(true);
    }
  }, [isAutoRefreshing, autoRefreshInterval, refreshLiveData]);

  /**
   * Stops automatic refresh of live data
   * Clears the refresh interval and updates state
   */
  const stopAutoRefresh = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsAutoRefreshing(false);
    }
  }, [intervalId]);

  /**
   * Cleanup effect to clear interval on component unmount
   * Prevents memory leaks from running intervals
   */
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    liveMatches,
    loading,
    error,
    refreshLiveData,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing
  };
};