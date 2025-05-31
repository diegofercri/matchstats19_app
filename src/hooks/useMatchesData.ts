// hooks/useMatchesData.ts
import { useState, useEffect, useMemo } from 'react';
import { Match, Season } from '@/types';
import footballService from '@/services/footballService';

interface UseMatchesDataReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refreshMatches: () => Promise<void>;
}

export const useMatchesData = (
  competitionId: string | undefined,
  season: Season | null
): UseMatchesDataReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer matches de la season (priorizando phases)
  const seasonMatches = useMemo(() => {
    if (!season) return [];
    
    if (season.phases) {
      // Extraer matches de todas las fases
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

  useEffect(() => {
    if (seasonMatches.length > 0) {
      // Si ya tenemos matches en la season, usarlos
      setMatches(seasonMatches);
    } else if (competitionId && season) {
      // Si no hay matches, intentar cargarlos
      loadMatches();
    } else {
      setMatches([]);
    }
  }, [competitionId, season, seasonMatches]);

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
      console.error('❌ Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

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