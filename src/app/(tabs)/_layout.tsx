// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { HomeIcon } from "@components/icons/Home";
import { ProfileIcon } from "@components/icons/Profile";
import { WebIcon } from "@components/icons/Web";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          headerShown: false,
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
    </Tabs>
  );
}
