import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Competition } from "@types";
import CompetitionListItem from "@components/home/CompetitionListItem";
import { colors } from "@colors";

/**
 * Props interface for CompetitionsList component
 * Defines list data, refresh functionality, and optional header component
 */
interface CompetitionsListProps {
  competitions: Competition[];
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

/**
 * Competitions list component with pull-to-refresh functionality
 * Displays scrollable list of competitions with optional header content
 * Features refresh control with branded colors and optimized performance
 * 
 * @param props - List properties including data, refresh state, and optional header
 * @returns JSX element containing FlatList with competitions and refresh control
 */
export function CompetitionsList({
  competitions,
  refreshing,
  onRefresh,
  ListHeaderComponent,
}: CompetitionsListProps) {
  /**
   * Renders individual competition item
   * Wraps CompetitionListItem with proper data binding
   * 
   * @param item - Competition data for rendering
   * @returns Competition list item component
   */
  const renderItem = ({ item }: { item: Competition }) => (
    <CompetitionListItem competition={item} />
  );

  return (
    <FlatList
      style={styles.container}
      data={competitions}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.interactive.primary]}
          tintColor={colors.interactive.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.background.primary,
  },
});