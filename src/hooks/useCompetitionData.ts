import { useState, useEffect } from 'react';
import { dummyCompetitions } from '@/dummyData';
import { Competition } from '@types';

interface UseCompetitionDataReturn {
  competition: Competition | null;
  loading: boolean;
  error: string | null;
}

export const useCompetitionData = (competitionId: string | undefined): UseCompetitionDataReturn => {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompetition = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!competitionId) {
          setError('ID de competición no proporcionado');
          return;
        }

        const foundCompetition = dummyCompetitions.find((comp) => comp.id === competitionId);
        
        if (!foundCompetition) {
          setError('Competición no encontrada');
          setCompetition(null);
        } else {
          setCompetition(foundCompetition);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar la competición';
        setError(errorMessage);
        setCompetition(null);
      } finally {
        setLoading(false);
      }
    };

    loadCompetition();
  }, [competitionId]);

  return {
    competition,
    loading,
    error
  };
};