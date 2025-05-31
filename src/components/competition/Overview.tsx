import { View, Text, StyleSheet } from "react-native";
import { colors } from "@colors";
import { Competition, Season } from "@types";

/**
 * Props interface for Overview component
 * Defines competition and optional season data for display
 */
interface OverviewProps {
  competition: Competition;
  season?: Season;
}

/**
 * Overview component displaying competition and season information
 * Shows detailed information in card-based layout with description, dates, and details
 * Handles missing data gracefully with fallback messages
 * 
 * @param props - Overview properties containing competition and optional season data
 * @returns JSX element containing competition overview with multiple information cards
 */
const Overview = ({ competition, season }: OverviewProps) => {
  /**
   * Handle missing data gracefully
   * Shows empty state when competition data is not available
   */
  if (!competition) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay información disponible.</Text>
      </View>
    );
  }

  const description = competition?.description;
  const startDate = season?.startDate || competition.startDate;
  const endDate = season?.endDate || competition.endDate;

  /**
   * Formats date string to Spanish locale format
   * Handles invalid dates gracefully with fallback message
   * 
   * @param dateString - Date string to format
   * @returns Formatted date string or fallback message
   */
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Fecha no disponible";
    }
  };

  return (
    <View style={styles.container}>
      {/* Description Card */}
      {description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descripción</Text>
          <Text style={styles.cardValue}>{description}</Text>
        </View>
      )}

      {/* Dates Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de Fechas</Text>

        <View style={styles.dateSection}>
          <Text style={styles.label}>Fecha de Inicio:</Text>
          <Text style={styles.value}>
            {startDate ? formatDate(startDate) : "No especificada"}
          </Text>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.label}>Fecha de Fin:</Text>
          <Text style={styles.value}>
            {endDate ? formatDate(endDate) : "No especificada"}
          </Text>
        </View>
      </View>

      {/* Season Card (if exists) */}
      {season && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Temporada Actual</Text>
          <Text style={styles.seasonName}>{season.name}</Text>
        </View>
      )}

      {/* Additional information Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles de la Competición</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{competition.name}</Text>
        </View>

        {/*
        // Organizer 
        {competition.organizer && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Organizador:</Text>
            <Text style={styles.value}>{competition.organizer}</Text>
          </View>
        )}

        // Location
        {competition.location && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.value}>{competition.location}</Text>
          </View>
        )}
        */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  cardValue: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: "center",
  },
  dateSection: {
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  seasonName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.interactive.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  seasonDescription: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Overview;