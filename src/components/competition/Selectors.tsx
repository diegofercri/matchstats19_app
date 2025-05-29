import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KnockoutViewType } from '@hooks/useKnockoutView';
import SeasonSelect from '@components/competition/SeasonSelect';
import KnockoutViewSelect from '@components/competition/KnockoutSelect';

interface SeasonOption {
  label: string;
  value: string;
}

interface SelectorsProps {
  seasonsForSelect: SeasonOption[];
  selectedSeasonId: string | undefined;
  onSeasonChange: (seasonId: string) => void;
  hasKnockoutPhase: boolean;
  knockoutView: KnockoutViewType;
  onKnockoutViewChange: (view: KnockoutViewType) => void;
}

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