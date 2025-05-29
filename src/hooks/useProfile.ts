import { useState, useEffect } from 'react';
import { User } from '@types';

interface UseProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Datos de perfil dummy
      const dummyProfile: User = {
        id: '1',
        name: 'Usuario Demo',
        email: 'usuario@example.com',
        image: 'https://diegofercri.dev/img/mylogo.png', // TODO
      };
      
      setProfile(dummyProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!profile) return;
      
      setLoading(true);
      
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setProfile(null);
    // Aquí iría la lógica de logout real
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    logout
  };
};