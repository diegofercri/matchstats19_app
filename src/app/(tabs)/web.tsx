import { WebView } from "react-native-webview";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@colors';
import { useRef } from 'react';

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://staff19torneos.com/" }}
        style={styles.webview}
      />
      <View style={styles.controlsContainer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            onPress={() => webViewRef.current?.goBack()} 
            style={[styles.button, styles.backButton]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.interactive.primaryText} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => webViewRef?.current?.goForward()} 
            style={[styles.button, styles.forwardButton]}
          >
            <Ionicons name="arrow-forward" size={24} color={colors.interactive.primaryText} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => webViewRef?.current?.reload()} 
          style={styles.button}
        >
          <View style={styles.reloadIcon}>
            <Ionicons name="reload" size={24} color={colors.interactive.primaryText} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  webview: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.interactive.primary,
    padding: 12,
    borderRadius: 24,
  },
  backButton: {
    marginRight: 4,
  },
  forwardButton: {
    marginLeft: 4,
  },
  reloadIcon: {
    paddingLeft: 2,
  },
});