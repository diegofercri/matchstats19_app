// hooks/useCompetitionsList.ts
import { useState, useEffect } from 'react';
import { Competition } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useCompetitionsList hook
 * Defines competitions list state and control functions
 */
interface UseCompetitionsListReturn {
  competitions: Competition[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  handleRefresh: () => Promise<void>;
  reload: () => Promise<void>;
}

/**
 * Custom hook for managing competitions list data
 * Handles loading, refreshing, and error states for competitions display
 * Automatically loads competitions on hook initialization
 * 
 * @returns Object containing competitions data, loading states, and refresh functions
 */
export const useCompetitionsList = (): UseCompetitionsListReturn => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * Effect to load competitions on hook initialization
   */
  useEffect(() => {
    loadCompetitions();
  }, []);

  /**
   * Loads competitions data from the API
   * Fetches main competitions and updates state accordingly
   */
  const loadCompetitions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const competitionsData = await footballService.getMainCompetitions();
      setCompetitions(competitionsData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las competiciones';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles pull-to-refresh functionality
   * Sets refreshing state and reloads competitions data
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadCompetitions();
    setRefreshing(false);
  };

  return {
    competitions,
    loading,
    error,
    refreshing,
    handleRefresh,
    reload: loadCompetitions
  };
};