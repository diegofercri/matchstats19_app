import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@colors";

interface Season {
  label: string;
  value: string;
  isDisabled?: boolean;
}

interface SeasonSelectProps {
  seasons: Season[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SeasonSelect({
  seasons,
  selectedValue,
  onValueChange,
  placeholder = "Temporada",
  disabled = false,
}: SeasonSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const defaultValue = selectedValue || (seasons.length > 0 ? seasons[0].value : undefined);
  const selectedSeason = seasons.find(season => season.value === defaultValue);
  const displayText = selectedSeason ? selectedSeason.label : placeholder;
  
  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={styles.triggerText}>
          {displayText}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.text.tertiary}
          style={styles.arrow}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdown}>
          {seasons.map((item, index) => (
            <Pressable
              key={item.value}
              style={[
                styles.option,
                index === seasons.length - 1 && styles.lastOption,
                item.value === defaultValue && styles.selectedOption,
                item.isDisabled && styles.disabledOption
              ]}
              onPress={() => !item.isDisabled && handleSelect(item.value)}
              disabled={item.isDisabled}
            >
              <Text style={[
                styles.optionText,
                item.value === defaultValue && styles.selectedOptionText,
                item.isDisabled && styles.disabledOptionText
              ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    position: 'relative',
    zIndex: 1000,
  },
  trigger: {
    backgroundColor: colors.background.surface,
    borderRadius: 9999,
    paddingLeft: 18,
    paddingRight: 14,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  triggerText: {
    color: colors.text.tertiary,
    fontSize: 14,
    flex: 1,
  },
  arrow: {
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1001,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: colors.interactive.hover,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  selectedOptionText: {
    color: colors.interactive.primary,
    fontWeight: '600',
  },
  disabledOptionText: {
    color: colors.text.muted,
  },
});

export default SeasonSelect;