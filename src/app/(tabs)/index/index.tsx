// app/(tabs)/index.tsx
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { dummyCompetitions } from "@/dummyData";
import { FlatList } from "react-native";
import CompetitionListItem from "@/components/CompetitionListItem";
import Banner from "@/components/Banner";
import React from 'react';
import { Competition } from '@/types';

export default function HomeScreen() {
  const Wrapper = GluestackUIProvider;

  return (
    <Wrapper>
      <FlatList
        className="flex-1 px-4 pt-4"
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