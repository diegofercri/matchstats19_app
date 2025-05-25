import { View, Text } from 'react-native';
import { Competition } from '@/types';


const Overview = ({ competition }: { competition: Competition }) => (
  <View className="p-4">
    <View className="mb-3">
      <Text className="text-base font-semibold text-slate-100">Descripción:</Text>
      <Text className="text-base text-slate-200">{competition.description}</Text>
    </View>
    <View className="mb-3">
      <Text className="text-base font-semibold text-slate-100">Fecha de Inicio:</Text>
      <Text className="text-base text-slate-200">{new Date(competition.startDate).toLocaleDateString()}</Text>
    </View>
    <View>
      <Text className="text-base font-semibold text-slate-100">Fecha de Fin:</Text>
      <Text className="text-base text-slate-200">{new Date(competition.endDate).toLocaleDateString()}</Text>
    </View>
  </View>
);

export default Overview;