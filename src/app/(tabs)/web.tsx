// src/app/(tabs)/web.tsx
import { WebView } from "react-native-webview";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WebViewScreen() {
  let webViewRef: WebView | null = null;

  return (
    <View className="flex-1">
      <WebView
        ref={(ref) => (webViewRef = ref)}
        source={{ uri: "https://staff19torneos.com/" }}
        className="flex-1"
      />
      <View className="absolute top-4 left-0 right-0 px-4 flex-row justify-between">
        <View className="flex-row">
          <TouchableOpacity 
            onPress={() => webViewRef?.goBack()} 
            className="bg-[#d8ff00] p-3 mr-1 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="dark" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => webViewRef?.goForward()} 
            className="bg-[#d8ff00] p-3 ml-1 rounded-full"
          >
            <Ionicons name="arrow-forward" size={24} color="dark" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => webViewRef?.reload()} 
          className="bg-[#d8ff00] p-3 rounded-full"
        >
          <View className="pl-0.5">
            <Ionicons name="reload" size={24} color="dark" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}