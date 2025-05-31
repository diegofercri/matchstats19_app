// Select.tsx
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@colors";

/**
 * Interface for select option items
 * Defines structure for dropdown options with labels, values, and disabled state
 */
export interface SelectOption {
  label: string;
  value: string;
  isDisabled?: boolean;
}

/**
 * Props interface for Select component
 * Defines configuration options for dropdown selector behavior and appearance
 */
interface SelectProps {
  options: SelectOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: number;
}

/**
 * Custom select dropdown component with modal overlay
 * Provides native-like dropdown functionality with customizable options
 * Features modal-based dropdown, disabled states, and precise positioning
 * 
 * @param props - Select component properties including options and handlers
 * @returns JSX element containing trigger button and modal dropdown
 */
function Select({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Seleccionar",
  disabled = false,
  width = 140,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  
  const defaultValue = selectedValue || (options.length > 0 ? options[0].value : undefined);
  const selectedOption = options.find(option => option.value === defaultValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  
  /**
   * Handles option selection
   * Updates selected value and closes dropdown
   * 
   * @param value - Selected option value
   */
  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  /**
   * Closes the dropdown modal
   */
  const closeDropdown = () => {
    setIsOpen(false);
  };

  /**
   * Handles trigger button press
   * Measures trigger position and opens/closes dropdown accordingly
   */
  const handleTriggerPress = () => {
    if (!disabled) {
      if (!isOpen) {
        // Measure trigger position before opening
        triggerRef.current?.measureInWindow((x, y, width, height) => {
          setTriggerLayout({ x, y, width, height });
          setIsOpen(true);
        });
      } else {
        setIsOpen(false);
      }
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      <Pressable
        ref={triggerRef}
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={handleTriggerPress}
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

      {/* Modal overlay for detecting outside clicks */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={closeDropdown}
        >
          <View style={[
            styles.dropdownContainer, 
            { 
              width: triggerLayout.width,
              left: triggerLayout.x,
              top: triggerLayout.y + triggerLayout.height + 4,
            }
          ]}>
            <View style={styles.dropdown}>
              {options.map((item, index) => (
                <Pressable
                  key={item.value}
                  style={[
                    styles.option,
                    index === options.length - 1 && styles.lastOption,
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
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
  },
  dropdown: {
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

export default Select;