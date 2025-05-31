// hooks/useSeasonData.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Match, StandingEntry, Season } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useSeasonData hook
 * Defines season data state, filtering functions, and control methods
 */
interface UseSeasonDataReturn {
  matches: Match[];
  standings: StandingEntry[];
  rounds: string[];
  loading: boolean;
  error: string | null;
  refreshSeasonData: () => Promise<void>;
  getMatchesByRound: (round: string) => Match[];
  getMatchesByStatus: (status: string) => Match[];
}

/**
 * Custom hook for managing comprehensive season data
 * Handles matches, standings, and rounds from season structure or API
 * Provides filtering utilities and refresh capabilities
 * 
 * @param competitionId - Competition identifier
 * @param season - Selected season data
 * @returns Object containing season data, loading state, and utility functions
 */
export const useSeasonData = (
  competitionId: string | undefined,
  season: Season | null
): UseSeasonDataReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract data from season structure if available
   * Processes both phase-based and legacy season data structures
   */
  const seasonData = useMemo(() => {
    if (!season) return { matches: [], standings: [], rounds: [] };
    
    let allMatches: Match[] = [];
    let allStandings: StandingEntry[] = [];
    
    if (season.phases) {
      // Extract from phases structure
      season.phases.forEach(phase => {
        if (phase.type === 'league') {
          allMatches.push(...(phase.matches || []));
          allStandings.push(...(phase.standings || []));
        } else if (phase.type === 'knockout') {
          phase.rounds?.forEach(round => {
            allMatches.push(...(round.matches || []));
          });
        } else if (phase.type === 'groups') {
          phase.groups?.forEach(group => {
            allMatches.push(...(group.matches || []));
            allStandings.push(...(group.standings || []));
          });
        }
      });
    } else {
      // Use legacy data structure
      allMatches = season.matches || [];
      allStandings = season.standings || [];
    }
    
    // Extract unique rounds from matches
    const uniqueRounds = [...new Set(allMatches.map(match => match.round))];
    
    return {
      matches: allMatches,
      standings: allStandings,
      rounds: uniqueRounds
    };
  }, [season]);

  /**
   * Effect to handle season data loading
   * Uses existing season data or fetches additional data from API
   */
  useEffect(() => {
    if (seasonData.matches.length > 0) {
      // Use data from season structure
      setMatches(seasonData.matches);
      setStandings(seasonData.standings);
      setRounds(seasonData.rounds);
    } else if (competitionId && season) {
      // Load additional data if not available in season
      loadAdditionalData();
    } else {
      // Clear data when no season selected
      setMatches([]);
      setStandings([]);
      setRounds([]);
    }
  }, [competitionId, season, seasonData]);

  /**
   * Loads additional season data from API
   * Fetches matches, standings, and rounds in parallel for better performance
   */
  const loadAdditionalData = async (): Promise<void> => {
    if (!competitionId || !season) return;

    try {
      setLoading(true);
      setError(null);

      const leagueId = parseInt(competitionId);
      const seasonYear = parseInt(season.name);

      if (isNaN(leagueId) || isNaN(seasonYear)) {
        throw new Error('IDs inválidos');
      }

      // Load data in parallel for better performance
      const [matchesData, standingsData, roundsData] = await Promise.all([
        footballService.getMatches({ league: leagueId, season: seasonYear }),
        footballService.getStandings(leagueId, seasonYear),
        footballService.getRounds(leagueId, seasonYear)
      ]);

      setMatches(matchesData);
      setStandings(standingsData);
      setRounds(roundsData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos de temporada';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes season data by reloading from API
   * Used for manual refresh or pull-to-refresh functionality
   */
  const refreshSeasonData = async (): Promise<void> => {
    await loadAdditionalData();
  };

  /**
   * Filters matches by specific round
   * Returns all matches that belong to the specified round
   * 
   * @param round - Round name to filter by
   * @returns Array of matches for the specified round
   */
  const getMatchesByRound = useCallback((round: string): Match[] => {
    return matches.filter(match => match.round === round);
  }, [matches]);

  /**
   * Filters matches by status
   * Returns all matches with the specified status
   * 
   * @param status - Match status to filter by
   * @returns Array of matches with the specified status
   */
  const getMatchesByStatus = useCallback((status: string): Match[] => {
    return matches.filter(match => match.status === status);
  }, [matches]);

  return {
    matches,
    standings,
    rounds,
    loading,
    error,
    refreshSeasonData,
    getMatchesByRound,
    getMatchesByStatus
  };
};