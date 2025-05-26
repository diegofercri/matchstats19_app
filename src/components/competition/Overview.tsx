import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { Competition, Season } from '@/types';

interface OverviewProps {
  competition: Competition;
  season?: Season;
}

const Overview = ({ competition, season }: OverviewProps) => {
  const description = competition?.description || competition.description;
  const startDate = season?.startDate || competition.startDate;
  const endDate = season?.endDate || competition.endDate;

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Fecha de Inicio:</Text>
        <Text style={styles.value}>{new Date(startDate).toLocaleDateString()}</Text>
      </View>
      <View>
        <Text style={styles.label}>Fecha de Fin:</Text>
        <Text style={styles.value}>{new Date(endDate).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  value: {
    fontSize: 13,
    color: colors.text.secondary,
  },
});

export default Overview;