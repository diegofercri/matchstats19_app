import { View, Text } from 'react-native';


const Matches = ({ competitionId }: { competitionId: string }) => (
  <View className="p-4">
    <Text className="text-xl font-semibold mb-3 text-slate-100">Partidos</Text>
    <Text className="text-slate-200">Aquí se mostrará el calendario de partidos para la competición ID: {competitionId}.</Text>
    {/* Aquí iría la lógica para cargar y mostrar partidos */}
  </View>
);

export default Matches;