// hooks/useStandingsData.ts
import { useState, useEffect, useMemo } from 'react';
import { StandingEntry, Season } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useStandingsData hook
 * Defines standings data state and control functions
 */
interface UseStandingsDataReturn {
  standings: StandingEntry[];
  loading: boolean;
  error: string | null;
  refreshStandings: () => Promise<void>;
}

/**
 * Custom hook for managing standings data for competitions
 * Handles loading standings from season data or fetching from API when needed
 * 
 * @param competitionId - Competition identifier
 * @param season - Selected season data
 * @returns Object containing standings data, loading state, and refresh function
 */
export const useStandingsData = (
  competitionId: string | undefined,
  season: Season | null
): UseStandingsDataReturn => {
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract standings from season data
   * Checks both phase-based structure and legacy standings field
   */
  const seasonStandings = useMemo(() => {
    if (!season) return [];
    
    if (season.phases) {
      // Look for standings in 'league' type phases
      const leaguePhases = season.phases.filter(phase => phase.type === 'league');
      return leaguePhases.flatMap(phase => phase.standings || []);
    }
    
    return season.standings || [];
  }, [season]);

  /**
   * Effect to handle standings data loading
   * Uses existing season data or fetches from API when necessary
   */
  useEffect(() => {
    if (seasonStandings.length > 0) {
      // If we already have standings in season, use them
      setStandings(seasonStandings);
    } else if (competitionId && season) {
      // If no standings available, try to load them
      loadStandings();
    } else {
      setStandings([]);
    }
  }, [competitionId, season, seasonStandings]);

  /**
   * Loads standings data from API
   * Fetches fresh standings data for the current competition and season
   */
  const loadStandings = async (): Promise<void> => {
    if (!competitionId || !season) return;

    try {
      setLoading(true);
      setError(null);

      const leagueId = parseInt(competitionId);
      const seasonYear = parseInt(season.name);

      if (isNaN(leagueId) || isNaN(seasonYear)) {
        throw new Error('IDs inválidos');
      }

      const standingsData = await footballService.getStandings(leagueId, seasonYear);
      setStandings(standingsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar clasificación';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes standings data by reloading from API
   * Used for manual refresh or pull-to-refresh functionality
   */
  const refreshStandings = async (): Promise<void> => {
    await loadStandings();
  };

  return {
    standings,
    loading,
    error,
    refreshStandings
  };
};