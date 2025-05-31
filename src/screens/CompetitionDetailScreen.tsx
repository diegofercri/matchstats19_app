import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

// Custom Hooks
import { useCompetitionData } from '@hooks/useCompetitionData';
import { useSeasonManagement } from '@hooks/useSeasonManagement';
import { useViewNavigation } from '@hooks/useViewNavigation';
import { useKnockoutView } from '@hooks/useKnockoutView';

// Services
import { 
  generateViewOptions, 
  getComponentData, 
  isValidViewId, 
  getDefaultViewId 
} from '@services/competitionService';

// Components
import { Header } from '@components/competition/Header';
import { Selectors } from '@components/competition/Selectors';
import TabNavigation from '@components/ui/TabNavigation';
import { LoadingScreen } from '@components/ui/LoadingScreen';
import { ErrorScreen } from '@components/ui/ErrorScreen';

import { colors } from '@colors';

/**
 * Competition detail screen component
 * Displays comprehensive competition information with multiple view options
 * Manages season selection, view navigation, and knockout presentation modes
 */
export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Custom Hooks (Separation of Concerns)
  const { competition, loading, error } = useCompetitionData(id);
  const { 
    selectedSeasonId, 
    selectedSeason, 
    seasonsForSelect, 
    handleSeasonChange 
  } = useSeasonManagement(competition);
  
  const { 
    knockoutView, 
    hasKnockoutPhase, 
    handleKnockoutViewChange, 
    resetKnockoutView 
  } = useKnockoutView(selectedSeason);
  
  const { activeViewId, setActiveViewId, requestedViewId, clearRequestedView } = useViewNavigation(selectedSeason, knockoutView);

  // Generate view options based on current season structure
  const viewOptions = generateViewOptions(selectedSeason, knockoutView);

  /**
   * Handle initial view selection (only when requested)
   * Manages deep linking and initial view state
   */
  useEffect(() => {
    if (!competition || !selectedSeason || viewOptions.length === 0) return;
    
    // Only act if there's a specific view being requested
    if (requestedViewId) {

      if (isValidViewId(requestedViewId, viewOptions)) {
        setActiveViewId(requestedViewId);
      } else {
        // Fallback to default
        const defaultView = getDefaultViewId(viewOptions);
        setActiveViewId(defaultView);
      }
      
      // Clear the request so it doesn't interfere with manual selections
      clearRequestedView();
    }
  }, [competition, selectedSeason, viewOptions, requestedViewId, setActiveViewId, clearRequestedView]);

  /**
   * Separate validation for cases where activeViewId becomes invalid
   * Ensures active view is always valid for current season structure
   */
  useEffect(() => {
    if (!competition || !selectedSeason || viewOptions.length === 0) return;
    
    // Only validate if no specific view is being requested and current view is invalid
    if (!requestedViewId && activeViewId && !isValidViewId(activeViewId, viewOptions)) {
      const defaultView = getDefaultViewId(viewOptions);
      setActiveViewId(defaultView);
    }
  }, [competition, selectedSeason, viewOptions, activeViewId, requestedViewId, setActiveViewId]);

  /**
   * Handle season change with knockout view reset
   * Resets knockout view mode when switching seasons
   * 
   * @param seasonId - Selected season identifier
   */
  const onSeasonChange = (seasonId: string) => {
    handleSeasonChange(seasonId);
    resetKnockoutView();
  };

  // Loading State
  if (loading) {
    return <LoadingScreen />;
  }

  // Error State
  if (error || !competition) {
    return (
      <ErrorScreen 
        message={error || 'Competición no encontrada'} 
        showRetryButton={false}
      />
    );
  }

  // Get active component and its data
  const ActiveViewComponent = viewOptions.find(
    option => option.id === activeViewId
  )?.component;
  
  const componentData = getComponentData(activeViewId, selectedSeason, competition);

  return (
    <>
      <Stack.Screen
        options={{
          title: competition.name
        }}
      />
      {/* Main Screen Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header competition={competition} />
        
        <Selectors
          seasonsForSelect={seasonsForSelect}
          selectedSeasonId={selectedSeasonId}
          onSeasonChange={onSeasonChange}
          hasKnockoutPhase={hasKnockoutPhase}
          knockoutView={knockoutView}
          onKnockoutViewChange={handleKnockoutViewChange}
        />

        <TabNavigation
          options={viewOptions}
          activeTabId={activeViewId}
          onTabChange={setActiveViewId}
        />

        <View style={styles.contentContainer}>
          {ActiveViewComponent && (
            <ActiveViewComponent {...componentData} />
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
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});