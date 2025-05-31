import React from 'react';
import { View, StyleSheet } from 'react-native';

// Custom Hooks
import { useCompetitionsList } from '@hooks/useCompetitionsList';

// Services
import { getBannerData } from '@services/homeService';

// Components
import { CompetitionsList } from '@components/home/CompetitionsList';
import { HomeBanner } from '@components/home/HomeBanner';
import { LoadingScreen } from '@components/ui/LoadingScreen';
import { ErrorScreen } from '@components/ui/ErrorScreen';

import { colors } from '@colors';

/**
 * Home screen component displaying competitions list and promotional banner
 * Main entry point for browsing available football competitions
 */
export default function HomeScreen() {
  // Custom Hook - Competition state management
  const { 
    competitions, 
    loading, 
    error, 
    refreshing, 
    handleRefresh,
    reload
  } = useCompetitionsList();

  // Service - Banner configuration
  const bannerData = getBannerData();

  // Loading State
  if (loading && competitions.length === 0) {
    return <LoadingScreen />;
  }

  // Error State
  if (error && competitions.length === 0) {
    return (
      <ErrorScreen 
        message={error} 
        onRetry={reload}
      />
    );
  }

  /**
   * Header component for the competitions list
   * Renders promotional banner at the top
   */
  const ListHeaderComponent = () => (
    <HomeBanner {...bannerData} />
  );

  return (
    <View style={styles.container}>
      <CompetitionsList
        competitions={competitions}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});