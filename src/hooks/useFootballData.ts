// hooks/useFootballData.ts
import { useState, useCallback } from 'react';
import { Match, StandingEntry } from '@/types';
import footballService from '@/services/footballService';

interface UseFootballDataReturn {
  loading: boolean;
  error: string | null;
  getLiveMatches: () => Promise<Match[]>;
  getMatches: (params: MatchParams) => Promise<Match[]>;
  getStandings: (league: number, season: number) => Promise<StandingEntry[]>;
  getRounds: (league: number, season: number) => Promise<string[]>;
  clearError: () => void;
}

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

export const useFootballData = (): UseFootballDataReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getLiveMatches = useCallback(async (): Promise<Match[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔴 Obteniendo partidos en vivo...');
      
      const matches = await footballService.getLiveMatches();
      console.log(`✅ Partidos en vivo: ${matches.length}`);
      return matches;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener partidos en vivo';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getMatches = useCallback(async (params: MatchParams): Promise<Match[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log('⚽ Obteniendo partidos...', params);
      
      const matches = await footballService.getMatches(params);
      console.log(`✅ Partidos obtenidos: ${matches.length}`);
      return matches;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener partidos';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStandings = useCallback(async (league: number, season: number): Promise<StandingEntry[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📊 Obteniendo clasificación: Liga ${league}, Temporada ${season}`);
      
      const standings = await footballService.getStandings(league, season);
      console.log(`✅ Clasificación obtenida: ${standings.length} equipos`);
      return standings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clasificación';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getRounds = useCallback(async (league: number, season: number): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Obteniendo rondas: Liga ${league}, Temporada ${season}`);
      
      const rounds = await footballService.getRounds(league, season);
      console.log(`✅ Rondas obtenidas: ${rounds.length}`);
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