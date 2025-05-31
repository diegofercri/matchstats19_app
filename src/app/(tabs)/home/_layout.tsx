import React from 'react';
import { Stack } from 'expo-router';

/**
 * Home layout component for stack navigation within the home tab
 * Provides stack navigation between home screen and competition detail screens
 * Features minimal back button styling for clean navigation experience
 * 
 * @returns JSX element containing Stack navigator with home and competition screens
 */
export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Inicio', 
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="competition/[id]"
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}