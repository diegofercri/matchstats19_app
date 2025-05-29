import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Competition } from "@types";
import { colors } from "@colors";

interface HeaderProps {
  competition: Competition;
}

export function Header({ competition }: HeaderProps) {
  return (
    <>
      {/* Competition Image */}
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: competition.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Competition Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{competition.name}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  imageWrapper: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border.muted,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.text.primary,
  },
});
