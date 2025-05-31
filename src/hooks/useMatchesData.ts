// hooks/useMatchesData.ts
import { useState, useEffect, useMemo } from 'react';
import { Match, Season } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useMatchesData hook
 * Defines matches data state and control functions
 */
interface UseMatchesDataReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refreshMatches: () => Promise<void>;
}

/**
 * Custom hook for managing matches data for competitions
 * Handles loading matches from season structure or fetching from API when needed
 * Prioritizes phase-based structure over legacy matches field
 * 
 * @param competitionId - Competition identifier
 * @param season - Selected season data
 * @returns Object containing matches data, loading state, and refresh function
 */
export const useMatchesData = (
  competitionId: string | undefined,
  season: Season | null
): UseMatchesDataReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract matches from season data (prioritizing phases structure)
   * Processes all phase types: groups, knockout, and league
   */
  const seasonMatches = useMemo(() => {
    if (!season) return [];
    
    if (season.phases) {
      // Extract matches from all phases
      return season.phases.flatMap(phase => {
        if (phase.type === 'groups') {
          return phase.groups?.flatMap(group => group.matches) || [];
        } else if (phase.type === 'knockout') {
          return phase.rounds?.flatMap(round => round.matches) || [];
        } else if (phase.type === 'league') {
          return phase.matches || [];
        }
        return [];
      });
    }
    
    return season.matches || [];
  }, [season]);

  /**
   * Effect to handle matches data loading
   * Uses existing season data or fetches from API when necessary
   */
  useEffect(() => {
    if (seasonMatches.length > 0) {
      // If we already have matches in season, use them
      setMatches(seasonMatches);
    } else if (competitionId && season) {
      // If no matches available, try to load them
      loadMatches();
    } else {
      setMatches([]);
    }
  }, [competitionId, season, seasonMatches]);

  /**
   * Loads matches data from API
   * Fetches fresh matches data for the current competition and season
   */
  const loadMatches = async (): Promise<void> => {
    if (!competitionId || !season) return;

    try {
      setLoading(true);
      setError(null);

      const leagueId = parseInt(competitionId);
      const seasonYear = parseInt(season.name);

      if (isNaN(leagueId) || isNaN(seasonYear)) {
        throw new Error('IDs inválidos');
      }

      const matchesData = await footballService.getMatches({
        league: leagueId,
        season: seasonYear
      });

      setMatches(matchesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar partidos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes matches data by reloading from API
   * Used for manual refresh or pull-to-refresh functionality
   */
  const refreshMatches = async (): Promise<void> => {
    await loadMatches();
  };

  return {
    matches,
    loading,
    error,
    refreshMatches
  };
};