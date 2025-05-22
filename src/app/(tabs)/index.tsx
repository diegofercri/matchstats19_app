import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { dummyCompetitions } from "@/dummyData";
import { Text, FlatList } from "react-native";

export default function HomeScreen() {
  return (
    <GluestackUIProvider>
      {
        <FlatList
          data={dummyCompetitions}
          renderItem={({ item }) => (
            <Text className="text-white">{item.name}</Text>
          )}
          keyExtractor={(item) => item.id}
        />
      }
    </GluestackUIProvider>
  );
}
