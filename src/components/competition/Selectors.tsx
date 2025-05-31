import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KnockoutViewType } from '@hooks/useKnockoutView';
import SeasonSelect from '@components/competition/SeasonSelect';
import KnockoutViewSelect from '@components/competition/KnockoutSelect';

/**
 * Interface for season selector options
 * Defines structure for season dropdown options
 */
interface SeasonOption {
  label: string;
  value: string;
}

/**
 * Props interface for Selectors component
 * Defines all selector states and change handlers for competition controls
 */
interface SelectorsProps {
  seasonsForSelect: SeasonOption[];
  selectedSeasonId: string | undefined;
  onSeasonChange: (seasonId: string) => void;
  hasKnockoutPhase: boolean;
  knockoutView: KnockoutViewType;
  onKnockoutViewChange: (view: KnockoutViewType) => void;
}

/**
 * Selectors component for competition filtering and view controls
 * Displays season selector and conditional knockout view selector
 * Provides centralized control interface for competition display options
 * 
 * @param props - Selector properties including options, states, and change handlers
 * @returns JSX element containing season and knockout view selectors
 */
export function Selectors({
  seasonsForSelect,
  selectedSeasonId,
  onSeasonChange,
  hasKnockoutPhase,
  knockoutView,
  onKnockoutViewChange
}: SelectorsProps) {
  return (
    <View style={styles.selectorsContainer}>
      <SeasonSelect
        seasons={seasonsForSelect}
        selectedValue={selectedSeasonId}
        onValueChange={onSeasonChange}
        placeholder="Temporada"
      />

      {/* Only show knockout view selector if season has knockout phase */}
      {hasKnockoutPhase && (
        <KnockoutViewSelect
          selectedView={knockoutView}
          onViewChange={onKnockoutViewChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 10,
    gap: 12,
  },
});