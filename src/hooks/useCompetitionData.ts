// hooks/useCompetitionData.ts
import { useState, useEffect } from 'react';
import { Competition } from '@/types';
import footballService from '@/services/footballService';

interface UseCompetitionDataReturn {
  competition: Competition | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const useCompetitionData = (competitionId: string | undefined): UseCompetitionDataReturn => {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompetition();
  }, [competitionId]);

  const loadCompetition = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!competitionId) {
        setError('ID de competición no proporcionado');
        setCompetition(null);
        return;
      }

      console.log(`🔍 Cargando competición: ${competitionId}`);
      
      const competitionData = await footballService.getCompetitionData(competitionId);
      
      if (!competitionData) {
        setError('Competición no encontrada');
        setCompetition(null);
      } else {
        setCompetition(competitionData);
        console.log(`✅ Competición cargada: ${competitionData.name}`);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la competición';
      setError(errorMessage);
      setCompetition(null);
      console.error('❌ Error loading competition:', err);
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