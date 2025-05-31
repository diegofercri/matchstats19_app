import { useState, useEffect } from 'react';
import { Profile } from '@types';

/**
 * Return type interface for useProfile hook
 * Defines profile management state and control functions
 */
interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  logout: () => void;
}

/**
 * Custom hook for managing user profile data and authentication state
 * Handles profile loading, updates, and logout functionality
 * Currently uses dummy data for development purposes
 * 
 * @returns Object containing profile state, loading state, and management functions
 */
export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect to load profile data on hook initialization
   */
  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Loads user profile data
   * Currently returns dummy data for development/testing
   * TODO: Replace with actual API call
   */
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Dummy profile data for development
      const dummyProfile: Profile = {
        id: '1',
        name: 'Usuario',
        surname: 'Demo',
        email: 'usuario@example.com',
        image: 'https://diegofercri.dev/img/mylogo.png', // TODO: Replace with actual profile image
      };
      
      setProfile(dummyProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates user profile with partial data
   * Merges new data with existing profile information
   * 
   * @param updates - Partial profile data to update
   */
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!profile) return;
      
      setLoading(true);
      
      // Merge updates with existing profile data
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      
      // TODO: Add API call to persist changes
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user logout
   * Clears profile state and performs logout cleanup
   * TODO: Add actual logout logic (clear tokens, navigate, etc.)
   */
  const logout = () => {
    setProfile(null);
    // TODO: Add real logout logic here
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    logout
  };
};