// app/(tabs)/[id].tsx
import React, { useState, useCallback } from "react"; // Importado useCallback
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { Stack, useLocalSearchParams, useFocusEffect } from "expo-router"; // Importado useFocusEffect
import { dummyCompetitions } from "@/dummyData";
import Overview from "@/components/competition/Overview";
import Matches from "@/components/competition/Matches";
import Standings from "@/components/competition/Standigns"; // Mantengo "Standigns" como lo escribiste

const VIEW_OPTIONS = [
  { id: "standings", label: "Clasificación", component: Standings },
  { id: "matches", label: "Partidos", component: Matches },
  { id: "overview", label: "Información", component: Overview },
];

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const competition = dummyCompetitions.find((comp) => comp.id === id);

  // Inicializa con el primer botón, se reseteará en useFocusEffect
  const [activeViewId, setActiveViewId] = useState(VIEW_OPTIONS[0].id);

  // Hook para resetear la vista activa cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      // Siempre establece la vista activa al primer elemento de VIEW_OPTIONS
      setActiveViewId(VIEW_OPTIONS[0].id);
    }, []) // El array de dependencias vacío asegura que el callback se memoriza
          // y el efecto se ejecuta al enfocar/desenfocar la pantalla.
  );

  if (!competition) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-slate-100">
          Competición no encontrada.
        </Text>
      </View>
    );
  }

  const ActiveViewComponent = VIEW_OPTIONS.find(
    (option) => option.id === activeViewId
  )?.component;

  return (
    <>
      <Stack.Screen
        options={{
          title: competition.name,
          headerShown: true,
        }}
      />
      {/* ScrollView principal de la página.*/}
      <ScrollView className="flex-1">
        <View
          style={{
            alignItems: 'center',
            paddingTop: 24, // Equivalente a py-6 ( Tailwind: 6 * 4px = 24px )
            paddingHorizontal: 16, // Equivalente a px-4
          }}
        >
          <View
            style={{
              width: 160, // Equivalente a w-40
              height: 160, // Equivalente a h-40
              borderRadius: 80,
              backgroundColor: '#202020',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24, // Equivalente a p-6
            }}
          >
            <Image
              source={{ uri: competition.image }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Contenedor del título.*/}
        <View className="p-4">
          <Text className="p-4 text-2xl font-bold text-center text-slate-100">
            {competition.name}
          </Text>
        </View>

        {/* Botones de Navegación Interna - CON SCROLL HORIZONTAL Y SEPARACIÓN */}
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 4,
              paddingBottom: 16,
              alignItems: "center",
              gap: 12,
            }}
          >
            {VIEW_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => setActiveViewId(option.id)}
                className={`py-3 px-4 rounded-full ${
                  activeViewId === option.id ? "bg-[#d8ff00]" : "bg-[#202020]"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeViewId === option.id
                      ? "text-zinc-900"
                      : "text-slate-100"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Contenido Dinámico según la vista activa */}
        <View className="mt-1 px-4 pb-4">
          {ActiveViewComponent && competition && (
            <ActiveViewComponent
              competition={competition}
              competitionId={competition.id}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}