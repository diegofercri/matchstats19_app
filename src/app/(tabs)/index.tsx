import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { dummyCompetitions } from "@/dummyData";
import { FlatList } from "react-native";
import CompetitionListItem from "@/components/CompetitionListItem";
import Banner from "@/components/Banner";

export default function HomeScreen() {
  return (
    <GluestackUIProvider>
      <FlatList
        className="p-4"
        data={dummyCompetitions}
        ListHeaderComponent={
          <Banner
            slug="⚽ Futsal"
            title="Staff Cup II"
            date="14 de Junio - 2025"
            imageUrl="https://staff19torneos.com/wp-content/uploads/2025/05/logo_sc_f1f1f1.png"
          />
        }
        renderItem={({ item }) => <CompetitionListItem competition={item} />}
      />
    </GluestackUIProvider>
  );
}
