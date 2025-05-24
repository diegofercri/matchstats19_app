// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { HomeIcon } from "@components/icons/Home"; // Asegúrate que estas rutas son correctas
import { ProfileIcon } from "@components/icons/Profile";
import { WebIcon } from "@components/icons/Web";
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerShown: true,
          tabBarIcon: ({ color }) => <HomeIcon fill={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerShown: true,
          tabBarIcon: ({ color }) => <ProfileIcon fill={color} />,
        }}
      />
      <Tabs.Screen
        name="web"
        options={{
          title: "Web",
          headerShown: true,
          tabBarIcon: ({ color }) => <WebIcon fill={color} />,
        }}
      />

      {/* Define la ruta [id].tsx pero NO la muestra en la barra de pestañas */}
      <Tabs.Screen
        name="[id]" // Corresponde al archivo app/(tabs)/[id].tsx
        options={{
          href: null, // ¡MUY IMPORTANTE! Esto oculta la pantalla de la barra de pestañas.
                      // La pantalla sigue siendo navegable, pero no es una pestaña principal.
        }}
      />
    </Tabs>
  );
}