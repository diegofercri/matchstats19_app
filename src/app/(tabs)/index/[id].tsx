import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
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
import Groups from "@/components/competition/Groups";
import Knockouts from "@/components/competition/Knockouts";
import KnockoutBrackets from "@/components/competition/KnockoutBrackets";
import SeasonSelect from "@/components/competition/SeasonSelect";
import KnockoutViewSelect, {
  KnockoutViewType,
} from "@/components/competition/KnockoutSelect";
import TabNavigation, {
  TabOption,
} from "@/components/ui/TabNavigation";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@colors";

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const competition = dummyCompetitions.find((comp) => comp.id === id);

  const [activeViewId, setActiveViewId] = useState<string>("");
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    undefined
  );
  const [knockoutView, setKnockoutView] = useState<KnockoutViewType>("list");

  useEffect(() => {
    if (competition) {
      const currentSeasonStillValid = competition.seasons?.find(
        (s) => s.id === selectedSeasonId
      );
      if (!currentSeasonStillValid) {
        const newSeasonId =
          competition.defaultSeasonId || competition.seasons?.[0]?.id;
        setSelectedSeasonId(newSeasonId);
      }
    } else {
      setSelectedSeasonId(undefined);
      setActiveViewId("");
    }
  }, [competition]);

  useFocusEffect(
    useCallback(() => {
      setActiveViewId("matches");
    }, [])
  );

  if (!competition) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Competición no encontrada.</Text>
      </View>
    );
  }

  const selectedSeason = competition?.seasons?.find(
    (s) => s.id === selectedSeasonId
  );

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    // Reset knockout view when season changes
    setKnockoutView("list");
  };

  const handleKnockoutViewChange = (view: KnockoutViewType) => {
    setKnockoutView(view);
  };

  // Check if current season has knockout phase
  const hasKnockoutPhase = selectedSeason?.phases?.some(
    (phase) => phase.type === "knockout"
  );

  // Generate dynamic tab options based on selected season
  const getViewOptions = (): TabOption[] => {
    const options: TabOption[] = [];

    // PARTIDOS - Always first for all competitions
    if (selectedSeason?.phases) {
      // Get all matches from all phases
      const allMatches = selectedSeason.phases.flatMap((phase) =>
        phase.type === "groups"
          ? phase.groups?.flatMap((group) => group.matches) || []
          : phase.rounds?.flatMap((round) => round.matches) || []
      );

      if (allMatches.length > 0) {
        options.push({ id: "matches", label: "Partidos", component: Matches });
      }
    } else if (selectedSeason?.matches && selectedSeason.matches.length > 0) {
      options.push({ id: "matches", label: "Partidos", component: Matches });
    }

    // SECOND - Competition-specific options
    if (selectedSeason?.phases) {
      // Competition has phases - show phase types as tabs
      const hasGroups = selectedSeason.phases.some(
        (phase) => phase.type === "groups"
      );
      const hasKnockouts = selectedSeason.phases.some(
        (phase) => phase.type === "knockout"
      );

      if (hasGroups) {
        options.push({ id: "groups", label: "Grupos", component: Groups });
      }
      if (hasKnockouts) {
        // Use the appropriate knockout component based on selected view
        const KnockoutComponent =
          knockoutView === "brackets" ? KnockoutBrackets : Knockouts;
        options.push({
          id: "knockouts",
          label: "Eliminatorias",
          component: KnockoutComponent,
        });
      }
    } else if (
      selectedSeason?.standings &&
      selectedSeason.standings.length > 0
    ) {
      // Traditional season structure (like LaLiga)
      options.push({
        id: "standings",
        label: "Clasificación",
        component: Standings,
      });
    }

    // INFORMACIÓN - Always last
    options.push({ id: "overview", label: "Información", component: Overview });

    return options;
  };

  const viewOptions = getViewOptions();

  // Ensure active view is valid for current options
  useEffect(() => {
    if (
      viewOptions.length > 0 &&
      !viewOptions.find((opt) => opt.id === activeViewId)
    ) {
      setActiveViewId(viewOptions[0].id);
    }
  }, [viewOptions, activeViewId]);

  const ActiveViewComponent = viewOptions.find(
    (option) => option.id === activeViewId
  )?.component;

  const seasonsForSelect =
    competition?.seasons?.map((season) => ({
      label: season.name,
      value: season.id,
    })) || [];

  // Get data to pass to components
  const getComponentData = () => {
    if (activeViewId === "groups") {
      // Get all groups from all group phases
      const allGroups =
        selectedSeason?.phases
          ?.filter((phase) => phase.type === "groups")
          .flatMap((phase) => phase.groups || []) || [];
      return { groups: allGroups };
    }
    if (activeViewId === "knockouts") {
      // Get all rounds from all knockout phases
      const allRounds =
        selectedSeason?.phases
          ?.filter((phase) => phase.type === "knockout")
          .flatMap((phase) => phase.rounds || []) || [];
      return { rounds: allRounds };
    }
    if (activeViewId === "matches") {
      if (selectedSeason?.phases) {
        // Get all matches from all phases
        const allMatches = selectedSeason.phases.flatMap((phase) =>
          phase.type === "groups"
            ? phase.groups?.flatMap((group) => group.matches) || []
            : phase.rounds?.flatMap((round) => round.matches) || []
        );
        return { matches: allMatches };
      } else {
        // Traditional matches from season
        return { matches: selectedSeason?.matches };
      }
    }
    if (activeViewId === "standings") {
      return { standings: selectedSeason?.standings };
    }

    // Default data for overview and other components
    return {
      competition,
      season: selectedSeason,
      matches: selectedSeason?.matches,
      standings: selectedSeason?.standings,
    };
  };

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
              <Pressable onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color={tintColor} />
              </Pressable>
            );
          },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <Text style={styles.title}>{competition.name}</Text>
        </View>

        <View style={styles.selectorsContainer}>
          <SeasonSelect
            seasons={seasonsForSelect}
            selectedValue={selectedSeasonId}
            onValueChange={handleSeasonChange}
            placeholder="Temporada"
          />

          {/* Only show knockout view selector if season has knockout phase */}
          {hasKnockoutPhase && (
            <KnockoutViewSelect
              selectedView={knockoutView}
              onViewChange={handleKnockoutViewChange}
            />
          )}
        </View>

        <TabNavigation
          options={viewOptions}
          activeTabId={activeViewId}
          onTabChange={setActiveViewId}
        />

        <View style={styles.contentContainer}>
          {ActiveViewComponent && (
            <ActiveViewComponent {...getComponentData()} />
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
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.background.primary,
  },

  imageContainer: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  imageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  errorText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.text.primary,
  },

  selectorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 10,
    gap: 12,
  },

  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
