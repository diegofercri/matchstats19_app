// hooks/useCompetitionData.ts
import { useState, useEffect } from 'react';
import { Competition } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useCompetitionData hook
 * Defines competition data state and control functions
 */
interface UseCompetitionDataReturn {
  competition: Competition | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Custom hook for managing individual competition data
 * Handles loading complete competition information including seasons and phases
 * Automatically reloads when competition ID changes
 * 
 * @param competitionId - Competition identifier to load data for
 * @returns Object containing competition data, loading state, and reload function
 */
export const useCompetitionData = (competitionId: string | undefined): UseCompetitionDataReturn => {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect to load competition data when ID changes
   * Triggers reload on competition ID updates
   */
  useEffect(() => {
    loadCompetition();
  }, [competitionId]);

  /**
   * Loads complete competition data from the API
   * Fetches competition details, seasons, and phase structure
   */
  const loadCompetition = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!competitionId) {
        setError('ID de competición no proporcionado');
        setCompetition(null);
        return;
      }
      
      const competitionData = await footballService.getCompetitionData(competitionId);
      
      if (!competitionData) {
        setError('Competición no encontrada');
        setCompetition(null);
      } else {
        setCompetition(competitionData);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la competición';
      setError(errorMessage);
      setCompetition(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    competition,
    loading,
    error,
    reload: loadCompetition
  };
};