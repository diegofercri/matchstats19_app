import {
  Season,
  Competition,
  Match,
  Group,
  KnockoutRound,
  StandingEntry,
} from "@/types";
import { KnockoutViewType } from "@/hooks/useKnockoutView";

// Import components
import Overview from "@/components/competition/Overview";
import Matches from "@/components/competition/Matches";
import Standings from "@/components/competition/Standigns";
import Groups from "@/components/competition/Groups";
import Knockouts from "@/components/competition/Knockouts";
import KnockoutBrackets from "@/components/competition/KnockoutBrackets";

export interface TabOption {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

export interface ComponentData {
  competition?: Competition;
  season?: Season;
  matches?: Match[];
  standings?: StandingEntry[];
  groups?: Group[];
  rounds?: KnockoutRound[];
}

/**
 * Generates dynamic tab options based on selected season structure
 */
export const generateViewOptions = (
  selectedSeason: Season | null,
  knockoutView: KnockoutViewType
): TabOption[] => {
  const options: TabOption[] = [];

  // MATCHES - Always first for all competitions
  if (hasMatches(selectedSeason)) {
    options.push({ id: "matches", label: "Partidos", component: Matches });
  }

  // Competition-specific options
  if (selectedSeason?.phases) {
    const hasGroups = selectedSeason.phases.some(
      (phase) => phase.type === "groups"
    );
    const hasKnockouts = selectedSeason.phases.some(
      (phase) => phase.type === "knockout"
    );
    const hasLeague = selectedSeason.phases.some(
      (phase) => phase.type === "league"
    );

    if (hasGroups) {
      options.push({ id: "groups", label: "Grupos", component: Groups });
    }

    // AGREGAR STANDINGS PARA FASES DE LIGA
    if (hasLeague) {
      const leaguePhases = selectedSeason.phases.filter(phase => phase.type === "league");
      const hasStandings = leaguePhases.some(phase => 
        phase.standings && phase.standings.length > 0
      );
      
      if (hasStandings) {
        console.log(`✅ Agregando pestaña Clasificación - ${leaguePhases[0].standings?.length} equipos`);
        options.push({
          id: "standings",
          label: "Clasificación",
          component: Standings,
        });
      } else {
        console.log(`⚠️ No se agregó Clasificación - sin standings en fases de liga`);
      }
    }

    if (hasKnockouts) {
      const KnockoutComponent =
        knockoutView === "brackets" ? KnockoutBrackets : Knockouts;
      options.push({
        id: "knockouts",
        label: "Eliminatorias",
        component: KnockoutComponent,
      });
    }
  } else if (selectedSeason?.standings && selectedSeason.standings.length > 0) {
    // Traditional season structure (like LaLiga) - LEGACY
    console.log(`✅ Agregando pestaña Clasificación (legacy) - ${selectedSeason.standings.length} equipos`);
    options.push({
      id: "standings",
      label: "Clasificación",
      component: Standings,
    });
  } else {
    console.log(`⚠️ No se encontraron standings para mostrar pestaña Clasificación`);
  }

  // OVERVIEW - Always last
  options.push({ id: "overview", label: "Información", component: Overview });

  console.log(`🎯 Pestañas generadas: ${options.map(o => o.label).join(', ')}`);
  return options;
};

/**
 * Checks if season has matches available
 */
const hasMatches = (selectedSeason: Season | null): boolean => {
  if (!selectedSeason) return false;

  if (selectedSeason.phases) {
    const allMatches = selectedSeason.phases.flatMap((phase) =>
      phase.type === "groups"
        ? phase.groups?.flatMap((group) => group.matches) || []
        : phase.type === "knockout"
        ? phase.rounds?.flatMap((round) => round.matches) || []
        : []
    );
    return allMatches.length > 0;
  }

  return Boolean(selectedSeason.matches && selectedSeason.matches.length > 0);
};

/**
 * Prepares appropriate data for each component based on active view
 */
export const getComponentData = (
  activeViewId: string,
  selectedSeason: Season | null,
  competition: Competition | null
): ComponentData => {
  switch (activeViewId) {
    case "groups":
      return {
        groups:
          selectedSeason?.phases
            ?.filter((phase) => phase.type === "groups")
            .flatMap((phase) => phase.groups || []) || [],
      };

    case "knockouts":
      return {
        rounds:
          selectedSeason?.phases
            ?.filter((phase) => phase.type === "knockout")
            .flatMap((phase) => phase.rounds || []) || [],
      };

    case "matches":
      if (selectedSeason?.phases) {
        const allMatches = selectedSeason.phases.flatMap((phase) =>
          phase.type === "groups"
            ? phase.groups?.flatMap((group) => group.matches) || []
            : phase.type === "knockout"
            ? phase.rounds?.flatMap((round) => round.matches) || []
            : []
        );
        return { matches: allMatches };
      }
      return { matches: selectedSeason?.matches || [] };

    case "standings":
      return { standings: selectedSeason?.standings || [] };

    default:
      // Default data for overview and other components
      return {
        competition: competition || undefined,
        season: selectedSeason || undefined,
        matches: selectedSeason?.matches || [],
        standings: selectedSeason?.standings || [],
      };
  }
};

/**
 * Validates if a view ID is valid for current options
 */
export const isValidViewId = (
  viewId: string,
  viewOptions: TabOption[]
): boolean => {
  return viewOptions.some((option) => option.id === viewId);
};

/**
 * Gets the first valid view ID from options (prioritizes matches)
 */
export const getDefaultViewId = (viewOptions: TabOption[]): string => {
  // Prioritize matches if available
  const matchesOption = viewOptions.find((option) => option.id === "matches");
  if (matchesOption) {
    return "matches";
  }

  // Otherwise return first available option
  return viewOptions.length > 0 ? viewOptions[0].id : "";
};
