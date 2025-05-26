// components/competition/SeasonSelect.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native'; // Importa View y StyleSheet
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem
} from "@/components/ui/select"; // Asegúrate que esta ruta sea correcta para tu proyecto
import { ChevronDownIcon } from "@/components/ui/icon";

interface Season {
  id: string;
  name: string;
}

interface SeasonSelectProps {
  availableSeasons: Season[];
  selectedSeasonId: string | undefined;
  onSeasonChange: (seasonId: string) => void;
  containerStyle?: object; // Para pasar el estilo de posicionamiento absoluto
  // Podrías añadir más props para personalizar el trigger, input, etc. si es necesario
  // placeholder?: string; 
}

export default function SeasonSelect({
  availableSeasons,
  selectedSeasonId,
  onSeasonChange,
  containerStyle,
  // placeholder = "Seleccionar Temporada", // Ejemplo de placeholder personalizable
}: SeasonSelectProps) {
  return (
    // El View exterior recibe el estilo para el posicionamiento absoluto
    <View style={containerStyle}> 
      <Select selectedValue={selectedSeasonId} onValueChange={onSeasonChange}>
        <SelectTrigger variant="outline" size="md" /* style={tuTriggerStyleSiLoNecesitas} */ >
          <SelectInput 
            placeholder={"Seleccionar Temporada"} // Placeholder directamente aquí
            // style={tuInputStyleSiLoNecesitas} 
          />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {availableSeasons.map((season) => (
              <SelectItem key={season.id} label={season.name} value={season.id} />
            ))}
            {availableSeasons.length === 0 && (
              <SelectItem label="No hay temporadas" value="" isDisabled={true} />
            )}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
}

// Podrías tener estilos internos mínimos aquí si fueran necesarios para el componente en sí,
// pero el posicionamiento principal vendrá del padre.
// const styles = StyleSheet.create({
//   // estilos internos del componente si los necesitas
// });