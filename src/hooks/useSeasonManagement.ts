import { useState, useEffect } from 'react';
import { Competition, Season } from '@types';

interface SeasonOption {
  label: string;
  value: string;
}

interface UseSeasonManagementReturn {
  selectedSeasonId: string | undefined;
  selectedSeason: Season | null;
  seasonsForSelect: SeasonOption[];
  handleSeasonChange: (seasonId: string) => void;
}

export const useSeasonManagement = (competition: Competition | null): UseSeasonManagementReturn => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(undefined);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  // Effect to handle competition changes and validate selected season
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

  // Effect to update selected season when seasonId changes
  useEffect(() => {
    if (competition && selectedSeasonId) {
      const season = competition.seasons?.find(s => s.id === selectedSeasonId);
      setSelectedSeason(season || null);
    } else {
      setSelectedSeason(null);
    }
  }, [competition, selectedSeasonId]);

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
  };

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