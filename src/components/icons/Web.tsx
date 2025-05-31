import { Svg, Path, G, SvgProps } from 'react-native-svg';
import { colors } from '@colors';

/**
 * Web/Globe icon component using SVG
 * Displays a stylized globe icon representing web or internet functionality
 * Features circular globe outline with meridian lines for geographical representation
 * 
 * @param props - SVG properties including optional fill color and standard SVG attributes
 * @returns JSX element containing SVG web/globe icon
 */
export function WebIcon({ fill = colors.interactive.primary, ...props }: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <G fill="none" stroke={fill} strokeWidth={1.5}>
        <Path
          strokeLinecap="round"
          opacity={0.5}
          d="M2 12h20m-6 0c0 1.313-.104 2.614-.305 3.827c-.2 1.213-.495 2.315-.867 3.244c-.371.929-.812 1.665-1.297 2.168c-.486.502-1.006.761-1.531.761s-1.045-.259-1.53-.761c-.486-.503-.927-1.24-1.298-2.168c-.372-.929-.667-2.03-.868-3.244A23.6 23.6 0 0 1 8 12c0-1.313.103-2.614.304-3.827s.496-2.315.868-3.244c.371-.929.812-1.665 1.297-2.168C10.955 2.26 11.475 2 12 2s1.045.259 1.53.761c.486.503.927 1.24 1.298 2.168c.372.929.667 2.03.867 3.244C15.897 9.386 16 10.687 16 12Z"
        />
        <Path
          d="M22 12a10 10 0 1 1-20.001 0A10 10 0 0 1 22 12Z"
        />
      </G>
    </Svg>
  );
}