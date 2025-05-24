import { Svg, Path, SvgProps } from 'react-native-svg';

export function ProfileIcon({ fill = "#d8ff00", ...props }: SvgProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 22 22"
      {...props}
    >
      <Path
        fill={fill}
        opacity={0.5}
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
      />
      <Path
        fill={fill}
        d="M16.807 19.011A8.46 8.46 0 0 1 12 20.5a8.46 8.46 0 0 1-4.807-1.489c-.604-.415-.862-1.205-.51-1.848C7.41 15.83 8.91 15 12 15s4.59.83 5.318 2.163c.35.643.093 1.433-.511 1.848M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
      />
    </Svg>
  );
}