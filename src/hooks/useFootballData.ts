// hooks/useFootballData.ts
import { useState, useCallback } from 'react';
import { Match, StandingEntry } from '@/types';
import footballService from '@/services/footballService';

/**
 * Return type interface for useFootballData hook
 * Defines football data operations and state management
 */
interface UseFootballDataReturn {
  loading: boolean;
  error: string | null;
  getLiveMatches: () => Promise<Match[]>;
  getMatches: (params: MatchParams) => Promise<Match[]>;
  getStandings: (league: number, season: number) => Promise<StandingEntry[]>;
  getRounds: (league: number, season: number) => Promise<string[]>;
  clearError: () => void;
}

/**
 * Interface for match filtering parameters
 * Defines available filters for match queries
 */
interface MatchParams {
  league?: number;
  season?: number;
  team?: number;
  status?: string;
  date?: string;
  from?: string;
  to?: string;
  round?: string;
}

/**
 * Custom hook for football data operations with centralized error and loading management
 * Provides wrapper functions around footballService with consistent state handling
 * All operations return empty arrays on error for safe component usage
 * 
 * @returns Object containing data fetching functions and shared state
 */
export const useFootballData = (): UseFootballDataReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Clears the current error state
   * Used for error recovery in UI components
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetches live matches from the API
   * Returns all matches currently being played
   * 
   * @returns Promise resolving to array of live matches (empty on error)
   */
  const getLiveMatches = useCallback(async (): Promise<Match[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const matches = await footballService.getLiveMatches();
      return matches;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener partidos en vivo';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches matches with optional filtering parameters
   * Supports filtering by league, season, team, status, dates, and rounds
   * 
   * @param params - Filtering parameters for match query
   * @returns Promise resolving to array of filtered matches (empty on error)
   */
  const getMatches = useCallback(async (params: MatchParams): Promise<Match[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const matches = await footballService.getMatches(params);
      return matches;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener partidos';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches league standings for a specific season
   * Returns current table positions with team statistics
   * 
   * @param league - League identifier
   * @param season - Season year
   * @returns Promise resolving to array of standing entries (empty on error)
   */
  const getStandings = useCallback(async (league: number, season: number): Promise<StandingEntry[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const standings = await footballService.getStandings(league, season);
      return standings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clasificación';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches available rounds for a specific league and season
   * Returns list of round names for navigation and filtering
   * 
   * @param league - League identifier
   * @param season - Season year
   * @returns Promise resolving to array of round names (empty on error)
   */
  const getRounds = useCallback(async (league: number, season: number): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const rounds = await footballService.getRounds(league, season);
      return rounds;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener rondas';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getLiveMatches,
    getMatches,
    getStandings,
    getRounds,
    clearError
  };
};