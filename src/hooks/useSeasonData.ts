// hooks/useSeasonData.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Match, StandingEntry, Season } from '@/types';
import footballService from '@/services/footballService';

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

export const useSeasonData = (
  competitionId: string | undefined,
  season: Season | null
): UseSeasonDataReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [rounds, setRounds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer datos de la season si ya están disponibles
  const seasonData = useMemo(() => {
    if (!season) return { matches: [], standings: [], rounds: [] };
    
    let allMatches: Match[] = [];
    let allStandings: StandingEntry[] = [];
    
    if (season.phases) {
      // Extraer de fases
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
      // Usar datos legacy
      allMatches = season.matches || [];
      allStandings = season.standings || [];
    }
    
    // Extraer rondas únicas
    const uniqueRounds = [...new Set(allMatches.map(match => match.round))];
    
    return {
      matches: allMatches,
      standings: allStandings,
      rounds: uniqueRounds
    };
  }, [season]);

  useEffect(() => {
    if (seasonData.matches.length > 0) {
      // Usar datos de la season
      setMatches(seasonData.matches);
      setStandings(seasonData.standings);
      setRounds(seasonData.rounds);
    } else if (competitionId && season) {
      // Cargar datos adicionales si no están en la season
      loadAdditionalData();
    } else {
      // Limpiar datos
      setMatches([]);
      setStandings([]);
      setRounds([]);
    }
  }, [competitionId, season, seasonData]);

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

      console.log(`📋 Cargando datos adicionales: Liga ${leagueId}, Temporada ${seasonYear}`);

      // Cargar en paralelo
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
      console.error('❌ Error loading season data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSeasonData = async (): Promise<void> => {
    await loadAdditionalData();
  };

  const getMatchesByRound = useCallback((round: string): Match[] => {
    return matches.filter(match => match.round === round);
  }, [matches]);

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