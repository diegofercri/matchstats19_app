import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Competition } from "@types";
import { colors, componentThemes } from "@colors";

type CompetitionListItemProps = {
  competition: Competition;
};

export default function CompetitionListItem({
  competition,
}: CompetitionListItemProps) {
  return (
    <Link href={{ pathname: `/home/competition/${competition.id}` }} asChild>
      <Pressable style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: competition.image }}
            style={styles.image}
            alt={competition.name}
          />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {competition.name}
            </Text>
            <Text
              style={styles.description}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {competition.description}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: componentThemes.card.background,
    borderRadius: 12,
    padding: 16,
    gap: 20,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevación para Android
    elevation: 3,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: componentThemes.card.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
});
