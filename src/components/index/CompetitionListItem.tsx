import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Competition } from "@/types";
import { colors } from "@colors";

export default function CompetitionListItem({
  competition,
}: {
  competition: Competition;
}) {
  return (
    <Link
      href={{
        pathname: "./[id]",
        params: { id: competition.id },
      }}
      asChild
    >
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
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
});