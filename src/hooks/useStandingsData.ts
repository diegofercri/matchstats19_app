// hooks/useStandingsData.ts
import { useState, useEffect, useMemo } from 'react';
import { StandingEntry, Season } from '@/types';
import footballService from '@/services/footballService';

interface UseStandingsDataReturn {
  standings: StandingEntry[];
  loading: boolean;
  error: string | null;
  refreshStandings: () => Promise<void>;
}

export const useStandingsData = (
  competitionId: string | undefined,
  season: Season | null
): UseStandingsDataReturn => {
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer standings de la season
  const seasonStandings = useMemo(() => {
    if (!season) return [];
    
    if (season.phases) {
      // Buscar standings en fases de tipo 'league'
      const leaguePhases = season.phases.filter(phase => phase.type === 'league');
      return leaguePhases.flatMap(phase => phase.standings || []);
    }
    
    return season.standings || [];
  }, [season]);

  useEffect(() => {
    if (seasonStandings.length > 0) {
      // Si ya tenemos standings en la season, usarlos
      setStandings(seasonStandings);
    } else if (competitionId && season) {
      // Si no hay standings, intentar cargarlos
      loadStandings();
    } else {
      setStandings([]);
    }
  }, [competitionId, season, seasonStandings]);

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
      console.error('❌ Error loading standings:', err);
    } finally {
      setLoading(false);
    }
  };

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