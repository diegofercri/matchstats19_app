import { View, Text, StyleSheet } from "react-native";
import { colors } from "@colors";
import { Competition, Season } from "@types";

interface OverviewProps {
  competition: Competition;
  season?: Season;
}

const Overview = ({ competition, season }: OverviewProps) => {
  // Handle missing data gracefully
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
      {/* Descripción Card */}
      {description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descripción</Text>
          <Text style={styles.cardValue}>{description}</Text>
        </View>
      )}

      {/* Fechas Card */}
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

      {/* Temporada Card (si existe) */}
      {season && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Temporada Actual</Text>
          <Text style={styles.seasonName}>{season.name}</Text>
        </View>
      )}

      {/* Información adicional Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles de la Competición</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{competition.name}</Text>
        </View>

        {/*
        // Organizador 
        {competition.organizer && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Organizador:</Text>
            <Text style={styles.value}>{competition.organizer}</Text>
          </View>
        )}

        // Ubicación
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
