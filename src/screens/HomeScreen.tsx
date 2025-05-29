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

export default function HomeScreen() {
  // Custom Hook - Gestión de estado de competiciones
  const { 
    competitions, 
    loading, 
    error, 
    refreshing, 
    handleRefresh,
    reload
  } = useCompetitionsList();

  // Service - Configuración de banner
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

  // Header Component para la lista
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