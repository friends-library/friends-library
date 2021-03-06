import React from 'react';
import { Text, Platform, TextStyle } from 'react-native';

interface TextProps {
  size?: number;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Serif: React.FC<TextProps> = ({
  size = 12,
  style = {},
  numberOfLines,
  children,
}) => (
  <Text
    numberOfLines={numberOfLines}
    style={{
      ...style,
      fontSize: size,
      ...Platform.select({
        ios: { fontFamily: `Baskerville` },
        android: { fontFamily: `serif`, fontSize: size - 3 },
      }),
    }}
  >
    {children}
  </Text>
);

export const Sans: React.FC<TextProps> = ({
  size = 12,
  style = {},
  numberOfLines,
  children,
}) => (
  <Text
    numberOfLines={numberOfLines}
    style={{
      ...style,
      fontSize: size,
      ...Platform.select({
        ios: { fontFamily: `HelveticaNeue-Light` },
        android: { fontFamily: `sans-serif` },
      }),
    }}
  >
    {children}
  </Text>
);
