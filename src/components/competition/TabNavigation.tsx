import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors } from '@colors';

export interface TabOption {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

interface TabNavigationProps {
  options: TabOption[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  options,
  activeTabId,
  onTabChange,
}) => {
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => onTabChange(option.id)}
            style={[
              styles.button,
              activeTabId === option.id ? styles.buttonActive : styles.buttonInactive
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                activeTabId === option.id ? styles.buttonTextActive : styles.buttonTextInactive
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  buttonActive: {
    backgroundColor: colors.interactive.primary,
  },
  buttonInactive: {
    backgroundColor: colors.background.surface,
  },
  buttonText: {
    fontSize: 14,
  },
  buttonTextActive: {
    color: colors.interactive.primaryText,
    fontWeight: '600',
  },
  buttonTextInactive: {
    color: colors.text.muted,
    fontWeight: '500',
  },
});

export default TabNavigation;