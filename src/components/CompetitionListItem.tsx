// components/CompetitionListItem.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Image, View, Pressable } from "react-native"; // Importa Pressable en lugar de TouchableOpacity
import { Competition } from "@/types";
import { Link } from 'expo-router';

export default function CompetitionListItem({ competition }: { competition: Competition; }) {
  return (
    <Link href={`/${competition.id}`} asChild>
      <Pressable
        // className para estilos de layout y base que no dependen del estado de presión
        className="mb-4"
        // La prop 'style' puede ser una función que recibe el estado de presión
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1.0, // Cambia la opacidad cuando está presionado
            // Puedes añadir otros cambios de estilo basados en el estado 'pressed' aquí
            // transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1.0 }], // Ejemplo: un ligero encogimiento
          },
          // Si tienes estilos base que quieres mantener en el objeto StyleSheet (aunque aquí usamos NativeWind)
          // podrías añadirlos aquí también.
        ]}
      >
        {/* El contenido de tu Card no cambia */}
        <Card
          size={"lg"}
          variant={"filled"}
          className={"flex flex-row items-center gap-5 p-4 rounded-xl shadow"}
          // Ajusta las clases de la Card según el diseño que ya tenías o quieras.
        >
          <Image
            source={{ uri: competition.image }}
            className={"w-16 h-16 rounded"}
            alt={competition.name}
          />
          <View className="flex-1">
            <Heading size="md" className={"mb-1 font-semibold"}>
              {competition.name}
            </Heading>
            <Text size="sm" numberOfLines={2} ellipsizeMode="tail">
              {competition.description}
            </Text>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}