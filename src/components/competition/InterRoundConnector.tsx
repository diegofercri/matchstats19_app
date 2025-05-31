import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@colors';
import { 
  CONNECTOR_THICKNESS, 
  CONNECTOR_HORIZONTAL_SEGMENT_LENGTH, 
  EFFECTIVE_MATCH_CARD_HEIGHT, 
  MATCH_SPACING_IN_COLUMN 
} from '@constants/bracketConstants';

/**
 * Props interface for InterRoundConnector component
 * Defines number of source matches for connector calculation
 */
interface InterRoundConnectorProps {
  numSourceMatches: number; 
}

/**
 * Inter-round connector component for tournament bracket visualization
 * Creates visual connections between tournament rounds with calculated positioning
 * Handles single match and multiple match scenarios with appropriate line routing
 * 
 * @param props - Connector properties including source match count
 * @returns JSX element containing connector lines or null for invalid configurations
 */
export const InterRoundConnector: React.FC<InterRoundConnectorProps> = ({ numSourceMatches }) => {
  const numTargetConnectorUnits = Math.floor(numSourceMatches / 2);

  if (numSourceMatches === 1 && numTargetConnectorUnits === 0) {
    return (
      <View style={styles.interRoundConnectorContainer}>
        <View style={styles.singleConnectorRow}>
          <View style={styles.singleConnectorLine} />
        </View>
      </View>
    );
  }

  if (numTargetConnectorUnits === 0) {
    return null; 
  }

  return (
    <View style={styles.interRoundConnectorContainer}>
      {Array.from({ length: numTargetConnectorUnits }).map((_, i) => (
        <ConnectorUnit key={`connector-unit-${i}`} />
      ))}
    </View>
  );
};

/**
 * Connector unit component for individual match pair connections
 * Creates complex line routing between two source matches to one target position
 * Features horizontal and vertical line segments with precise positioning
 * 
 * @returns JSX element containing connector lines for match pair routing
 */
const ConnectorUnit = () => {
  const totalHeightPerPair = (EFFECTIVE_MATCH_CARD_HEIGHT * 2) + MATCH_SPACING_IN_COLUMN;
  const verticalOffsetToFirstCardCenter = EFFECTIVE_MATCH_CARD_HEIGHT / 1.47;
  const verticalDistanceBetweenCardCenters = EFFECTIVE_MATCH_CARD_HEIGHT + MATCH_SPACING_IN_COLUMN;
  const verticalOffsetToSecondCardCenter = verticalOffsetToFirstCardCenter + verticalDistanceBetweenCardCenters;
  const midPointBetweenCards = (verticalOffsetToFirstCardCenter + verticalOffsetToSecondCardCenter) / 2;

  return (
    <View style={[styles.connectorUnit, { height: totalHeightPerPair }]}>
      <View style={styles.connectorSegment}>
        {/* Horizontal line from first card */}
        <View style={[
          styles.horizontalLine,
          { top: verticalOffsetToFirstCardCenter - (CONNECTOR_THICKNESS / 2) }
        ]} />
        
        {/* Vertical line connecting both cards */}
        <View style={[
          styles.verticalLine,
          {
            height: verticalDistanceBetweenCardCenters,
            top: verticalOffsetToFirstCardCenter - (CONNECTOR_THICKNESS / 2),
            left: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH - CONNECTOR_THICKNESS
          }
        ]} />
        
        {/* Horizontal line from second card */}
        <View style={[
          styles.horizontalLine,
          { top: verticalOffsetToSecondCardCenter - (CONNECTOR_THICKNESS / 2) }
        ]} />
      </View>
      
      {/* Horizontal line to next round */}
      <View style={[
        styles.nextRoundLine,
        { marginTop: midPointBetweenCards - (CONNECTOR_THICKNESS / 2) }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  interRoundConnectorContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0,
    marginHorizontal: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH > 10 ? 5 : 10, 
  },
  singleConnectorRow: {
    height: EFFECTIVE_MATCH_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleConnectorLine: {
    width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH * 2, 
    height: CONNECTOR_THICKNESS,
    backgroundColor: colors.background.tertiary,
  },
  connectorUnit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  connectorSegment: {
    position: 'relative', 
    width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
    height: '100%', 
  },
  horizontalLine: {
    position: 'absolute',
    backgroundColor: colors.background.tertiary,
    width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
    height: CONNECTOR_THICKNESS,
    left: 0,
  },
  verticalLine: {
    position: 'absolute',
    backgroundColor: colors.background.tertiary,
    width: CONNECTOR_THICKNESS,
  },
  nextRoundLine: {
    width: CONNECTOR_HORIZONTAL_SEGMENT_LENGTH,
    height: CONNECTOR_THICKNESS,
    backgroundColor: colors.background.tertiary,
  },
});