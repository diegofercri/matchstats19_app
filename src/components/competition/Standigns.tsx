import { View, Text } from 'react-native';


const Standings = ({ competitionId }: { competitionId: string }) => (
  <View className="p-4">
    <Text className="text-xl font-semibold mb-3 text-slate-100">Clasificación</Text>
    <Text className="text-slate-200">Aquí se mostrará la clasificación para la competición ID: {competitionId}.</Text>
    {/* Aquí iría la lógica para cargar y mostrar clasificación */}
  </View>
);

export default Standings;