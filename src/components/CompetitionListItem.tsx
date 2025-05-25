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
    <Link href={`/(tabs)/${competition.id}`} asChild>
      <Pressable className="mb-4" >
        <Card
          size={"lg"}
          variant={"filled"}
          className={"flex flex-row items-center gap-5 p-4 rounded-xl shadow"}
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