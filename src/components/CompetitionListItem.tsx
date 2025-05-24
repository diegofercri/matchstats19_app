import React from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Image, View } from "react-native";
import { Competition } from "@/types";

export default function CompetitionListItem({ competition }: {competition: Competition;}) {
  return (
    <Card
      size={"lg"}
      variant={"filled"}
      className={"mb-4 flex flex-row items-center gap-5 rounded-3xl"}
    >
      <Image source={{ uri: competition.image }} className={"w-16 h-16"} alt={competition.name} />
      <View>
        <Heading size="md" className={"mb-1"}>
          {competition.name}
        </Heading>
        <Text size="sm">{competition.description}</Text>
      </View>
    </Card>
  );
}
