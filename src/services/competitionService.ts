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

/**
 * Interface for tab option configuration
 * Defines structure for navigation tabs in competition views
 */
export interface TabOption {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

/**
 * Interface for component data structure
 * Contains all possible data that components might need
 */
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
 * Creates appropriate tabs depending on competition format (league/cup/mixed)
 * 
 * @param selectedSeason - Currently selected season data
 * @param knockoutView - Current knockout view type (list or brackets)
 * @returns Array of available tab options for the season
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

    // ADD STANDINGS FOR LEAGUE PHASES
    if (hasLeague) {
      const leaguePhases = selectedSeason.phases.filter(phase => phase.type === "league");
      const hasStandings = leaguePhases.some(phase => 
        phase.standings && phase.standings.length > 0
      );
      
      if (hasStandings) {
        options.push({
          id: "standings",
          label: "Clasificación",
          component: Standings,
        });
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
    options.push({
      id: "standings",
      label: "Clasificación",
      component: Standings,
    });
  }

  // OVERVIEW - Always last
  options.push({ id: "overview", label: "Información", component: Overview });

  return options;
};

/**
 * Checks if season has matches available
 * Verifies both new phase structure and legacy match structure
 * 
 * @param selectedSeason - Season to check for matches
 * @returns True if season has matches, false otherwise
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
 * Extracts relevant data from season structure for each component type
 * 
 * @param activeViewId - Currently active view identifier
 * @param selectedSeason - Current season data
 * @param competition - Current competition data
 * @returns Object with data appropriate for the active component
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
 * Checks if the provided view ID exists in available options
 * 
 * @param viewId - View ID to validate
 * @param viewOptions - Available view options
 * @returns True if view ID is valid, false otherwise
 */
export const isValidViewId = (
  viewId: string,
  viewOptions: TabOption[]
): boolean => {
  return viewOptions.some((option) => option.id === viewId);
};

/**
 * Gets the first valid view ID from options (prioritizes matches)
 * Returns default view with preference for matches tab
 * 
 * @param viewOptions - Available view options
 * @returns Default view ID string
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