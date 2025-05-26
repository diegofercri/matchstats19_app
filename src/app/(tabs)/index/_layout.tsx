// app/(tabs)/index/_layout.tsx
import { Stack } from 'expo-router';

export default function IndexStackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" // Corresponde al archivo app/(tabs)/index/index.tsx
        options={{ 
          title: 'Competiciones', // O el título que prefieras para la lista
          // El header de la pantalla de detalle [id].tsx se configurará en su propio archivo
        }} 
      />
      {/* No necesitas declarar explícitamente "[id]" aquí si sus opciones 
          (como el título dinámico) están en app/(tabs)/[id].tsx.
          Expo Router lo enrutará como parte de este stack si se navega correctamente.
      */}
    </Stack>
  );
}