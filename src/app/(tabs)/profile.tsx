import { Text, StyleSheet, View } from "react-native";
import { colors } from '@colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  text: {
    color: colors.text.primary,
  },
});