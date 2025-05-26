import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from "react-native";
import {
  Stack,
  useLocalSearchParams,
  useFocusEffect,
  router,
} from "expo-router";
import { dummyCompetitions } from "@/dummyData";
import Overview from "@/components/competition/Overview";
import Matches from "@/components/competition/Matches";
import Standings from "@/components/competition/Standigns";
import SeasonSelect from "@/components/competition/SeasonSelect";
import TabNavigation, { TabOption } from "@/components/competition/TabNavigation";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@colors';

const VIEW_OPTIONS: TabOption[] = [
  { id: "standings", label: "Clasificación", component: Standings },
  { id: "matches", label: "Partidos", component: Matches },
  { id: "overview", label: "Información", component: Overview },
];

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const competition = dummyCompetitions.find((comp) => comp.id === id);

  const [activeViewId, setActiveViewId] = useState(VIEW_OPTIONS[0].id);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (competition) {
      const currentSeasonStillValid = competition.seasons?.find(
        (s) => s.id === selectedSeasonId
      );
      if (!currentSeasonStillValid) {
        setSelectedSeasonId(
          competition.defaultSeasonId || competition.seasons?.[0]?.id
        );
      }
    } else {
      setSelectedSeasonId(undefined);
    }
  }, [competition]);

  useFocusEffect(
    useCallback(() => {
      setActiveViewId(VIEW_OPTIONS[0].id);
    }, [])
  );

  if (!competition) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Competición no encontrada.
        </Text>
      </View>
    );
  }

  const selectedSeason = competition?.seasons?.find(
    (s) => s.id === selectedSeasonId
  );

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
  };

  const ActiveViewComponent = VIEW_OPTIONS.find(
    (option) => option.id === activeViewId
  )?.component;

  const seasonsForSelect = competition?.seasons?.map(season => ({
    label: season.name,
    value: season.id,
  })) || [];

  return (
    <>
      <Stack.Screen
        options={{
          title: competition.name,
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          headerLeft: ({ tintColor, canGoBack }) => {
            if (!canGoBack) {
              return null;
            }
            return (
              <Pressable
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={tintColor}
                />
              </Pressable>
            );
          },
        }}
      />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: competition.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {competition.name}
          </Text>
        </View>

        <View style={styles.seasonSelectContainer}>
          <SeasonSelect
            seasons={seasonsForSelect}
            selectedValue={selectedSeasonId}
            onValueChange={handleSeasonChange}
            placeholder="Temporada"
          />
        </View>

        <TabNavigation
          options={VIEW_OPTIONS}
          activeTabId={activeViewId}
          onTabChange={setActiveViewId}
        />

        <View style={styles.contentContainer}>
          {ActiveViewComponent && (
            <ActiveViewComponent
              competition={competition}
              season={selectedSeason}
              matches={selectedSeason?.matches}
              standings={selectedSeason?.standings}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.background.primary,
  },
  
  imageContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 42,
  },
  imageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  
  errorText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 42,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text.primary,
  },
  
  seasonSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});