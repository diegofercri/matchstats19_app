import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { dummyCompetitions } from "@/dummyData";
import { FlatList, StyleSheet } from "react-native";
import CompetitionListItem from "@/components/index/CompetitionListItem";
import Banner from "@/components/index/Banner";
import React from 'react';
import { Competition } from '@/types';
import { colors } from '@colors';

export default function HomeScreen() {
  const Wrapper = GluestackUIProvider;

  return (
    <Wrapper>
      <FlatList
        style={styles.container}
        data={dummyCompetitions}
        ListHeaderComponent={
          <Banner
            slug="⚽ Futsal"
            title="Staff Cup II"
            date="14 de Junio - 2025"
            imageUrl="https://staff19torneos.com/wp-content/uploads/2025/05/logo_sc_f1f1f1.png"
          />
        }
        renderItem={({ item }: { item: Competition }) => (
          <CompetitionListItem competition={item} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Wrapper>
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