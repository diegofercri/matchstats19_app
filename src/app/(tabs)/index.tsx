import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text className='text-3xl font-thin'>Hello World</Text>
      <StatusBar style="auto" />
    </View>
  );
}
