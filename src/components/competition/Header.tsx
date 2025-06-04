import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Competition } from "@types";
import { colors } from "@colors";

/**
 * Props interface for Header component
 * Defines competition data for header display
 */
interface HeaderProps {
  competition: Competition;
}

/**
 * Header component for competition detail screens
 * Displays competition logo and title with elegant styling and shadows
 * Features centered layout with prominent competition branding
 * 
 * @param props - Header properties containing competition data
 * @returns JSX element containing competition image and title header
 */
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
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
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