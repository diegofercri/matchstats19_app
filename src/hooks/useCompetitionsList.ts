// hooks/useCompetitionsList.ts
import { useState, useEffect } from 'react';
import { Competition } from '@/types';
import footballService from '@/services/footballService';

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

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Iniciando carga de competiciones...');
      
      const competitionsData = await footballService.getMainCompetitions();
      setCompetitions(competitionsData);
      
      console.log(`✅ Competiciones cargadas: ${competitionsData.length}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las competiciones';
      setError(errorMessage);
      console.error('❌ Error loading competitions:', err);
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