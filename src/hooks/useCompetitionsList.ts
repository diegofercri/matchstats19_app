import { useState, useEffect } from 'react';
import { dummyCompetitions } from '@/dummyData';
import { Competition } from '@types';

interface UseCompetitionsListReturn {
  competitions: Competition[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  handleRefresh: () => Promise<void>;
  reload: () => Promise<void>;
}

export const useCompetitionsList = (): UseCompetitionsListReturn => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Simula carga inicial de datos
  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);      
      setCompetitions(dummyCompetitions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las competiciones';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadCompetitions();
    setRefreshing(false);
  };

  return {
    competitions,
    loading,
    error,
    refreshing,
    handleRefresh,
    reload: loadCompetitions
  };
};