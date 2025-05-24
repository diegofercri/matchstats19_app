// app/(tabs)/[id].tsx
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { dummyCompetitions } from '@/dummyData';

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const competition = dummyCompetitions.find(comp => comp.id === id);

  if (!competition) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-slate-100">Competición no encontrada.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: competition.name,
          headerShown: true,
        }}
      />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Image
            source={{ uri: competition.image }}
            className="w-full h-52 rounded-lg mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold mb-4 text-center text-slate-100">{competition.name}</Text>

          <View className="mb-3">
            <Text className="text-base font-semibold text-slate-100">Descripción:</Text>
            <Text className="text-base text-slate-200">{competition.description}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-base font-semibold text-slate-100">Fecha de Inicio:</Text>
            <Text className="text-base text-slate-200">{new Date(competition.startDate).toLocaleDateString()}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-base font-semibold text-slate-100">Fecha de Fin:</Text>
            <Text className="text-base text-slate-200">{new Date(competition.endDate).toLocaleDateString()}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}