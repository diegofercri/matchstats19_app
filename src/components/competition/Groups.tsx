import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { Group } from '@/types';

interface GroupsProps {
  groups?: Group[];
}

const Groups = ({ groups }: GroupsProps) => {
  if (!groups || groups.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay grupos disponibles para esta fase.</Text>
      </View>
    );
  }

  return (
    <View>
      {groups.map((group) => (
        <View key={group.id} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{group.name}</Text>
          
          {group.standings && group.standings.length > 0 ? (
            <View style={styles.standingsContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.teamColumn]}>Equipo</Text>
                <Text style={[styles.headerText, styles.statColumn]}>PJ</Text>
                <Text style={[styles.headerText, styles.statColumn]}>G</Text>
                <Text style={[styles.headerText, styles.statColumn]}>E</Text>
                <Text style={[styles.headerText, styles.statColumn]}>P</Text>
                <Text style={[styles.headerText, styles.statColumn]}>Pts</Text>
              </View>
              
              {group.standings.map((entry) => (
                <View key={entry.team.id} style={styles.tableRow}>
                  <View style={styles.teamInfo}>
                    <Text style={styles.position}>{entry.position}</Text>
                    <Text style={styles.teamName} numberOfLines={1}>
                      {entry.team.name}
                    </Text>
                  </View>
                  <Text style={[styles.statText, styles.statColumn]}>{entry.played}</Text>
                  <Text style={[styles.statText, styles.statColumn]}>{entry.won}</Text>
                  <Text style={[styles.statText, styles.statColumn]}>{entry.drawn}</Text>
                  <Text style={[styles.statText, styles.statColumn]}>{entry.lost}</Text>
                  <Text style={[styles.pointsText, styles.statColumn]}>{entry.points}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noStandingsText}>
              La clasificación se actualizará cuando comiencen los partidos.
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 12,
  },
  groupCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background.surface,
    borderRadius: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  standingsContainer: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  teamColumn: {
    flex: 1,
    textAlign: 'left',
  },
  statColumn: {
    width: 32,
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  position: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.interactive.primary,
    width: 20,
    textAlign: 'center',
  },
  teamName: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  statText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  noStandingsText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Groups;