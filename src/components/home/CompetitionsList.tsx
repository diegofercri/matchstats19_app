import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Competition } from "@types";
import CompetitionListItem from "@components/home/CompetitionListItem";
import { colors } from "@colors";

interface CompetitionsListProps {
  competitions: Competition[];
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function CompetitionsList({
  competitions,
  refreshing,
  onRefresh,
  ListHeaderComponent,
}: CompetitionsListProps) {
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
