import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleProp, TextStyle } from 'react-native';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const MAPPING: Record<string, IoniconsName> = {
  'house.fill': 'home',
  'paperplane.fill': 'paper-plane',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-forward',
};

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return <Ionicons color={color} size={size} name={MAPPING[name]} style={style} />;
}
