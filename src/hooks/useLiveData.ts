// hooks/useLiveData.ts
import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types';
import footballService from '@/services/footballService';

interface UseLiveDataReturn {
  liveMatches: Match[];
  loading: boolean;
  error: string | null;
  refreshLiveData: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  isAutoRefreshing: boolean;
}

export const useLiveData = (autoRefreshInterval: number = 60000): UseLiveDataReturn => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const refreshLiveData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const matches = await footballService.getLiveMatches();
      setLiveMatches(matches);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener datos en vivo';
      setError(errorMessage);
      console.error('❌ Error refreshing live data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startAutoRefresh = useCallback(() => {
    if (!isAutoRefreshing) {
      console.log(`🔄 Iniciando auto-refresh cada ${autoRefreshInterval / 1000}s`);
      
      // Refresh inicial
      refreshLiveData();
      
      // Configurar intervalo
      const id = setInterval(refreshLiveData, autoRefreshInterval);
      setIntervalId(id);
      setIsAutoRefreshing(true);
    }
  }, [isAutoRefreshing, autoRefreshInterval, refreshLiveData]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalId) {
      console.log('⏹️ Deteniendo auto-refresh');
      clearInterval(intervalId);
      setIntervalId(null);
      setIsAutoRefreshing(false);
    }
  }, [intervalId]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    liveMatches,
    loading,
    error,
    refreshLiveData,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing
  };
};