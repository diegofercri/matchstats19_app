import { useState, useEffect } from 'react';
import { Competition, Season } from '@types';

/**
 * Interface for season selector options
 * Used in dropdown/picker components for season selection
 */
interface SeasonOption {
  label: string;
  value: string;
}

/**
 * Return type interface for useSeasonManagement hook
 * Defines season management state and control functions
 */
interface UseSeasonManagementReturn {
  selectedSeasonId: string | undefined;
  selectedSeason: Season | null;
  seasonsForSelect: SeasonOption[];
  handleSeasonChange: (seasonId: string) => void;
}

/**
 * Custom hook for managing season selection within competitions
 * Handles season state, validation, and provides selector options
 * 
 * @param competition - Competition data containing available seasons
 * @returns Object containing season state, selection options, and change handler
 */
export const useSeasonManagement = (competition: Competition | null): UseSeasonManagementReturn => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(undefined);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  /**
   * Effect to handle competition changes and validate selected season
   * Ensures selected season is valid for current competition or selects default
   */
  useEffect(() => {
    if (competition) {
      // Check if current season is still valid
      const currentSeasonStillValid = competition.seasons?.find(
        (s) => s.id === selectedSeasonId
      );
      
      if (!currentSeasonStillValid) {
        // Select default season
        const newSeasonId = competition.defaultSeasonId || competition.seasons?.[0]?.id;
        setSelectedSeasonId(newSeasonId);
      }
    } else {
      // Reset if no competition
      setSelectedSeasonId(undefined);
    }
  }, [competition, selectedSeasonId]);

  /**
   * Effect to update selected season when seasonId changes
   * Keeps selectedSeason object in sync with selectedSeasonId
   */
  useEffect(() => {
    if (competition && selectedSeasonId) {
      const season = competition.seasons?.find(s => s.id === selectedSeasonId);
      setSelectedSeason(season || null);
    } else {
      setSelectedSeason(null);
    }
  }, [competition, selectedSeasonId]);

  /**
   * Handles season selection changes
   * Updates the selected season ID state
   * 
   * @param seasonId - New season ID to select
   */
  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
  };

  /**
   * Creates selector options array from available seasons
   * Formats season data for use in picker/dropdown components
   */
  const seasonsForSelect: SeasonOption[] = competition?.seasons?.map((season) => ({
    label: season.name,
    value: season.id,
  })) || [];

  return {
    selectedSeasonId,
    selectedSeason,
    seasonsForSelect,
    handleSeasonChange
  };
};