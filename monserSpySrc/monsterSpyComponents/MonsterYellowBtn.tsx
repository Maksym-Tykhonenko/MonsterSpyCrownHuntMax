import React from 'react';
import { ViewStyle, Text, StyleProp, ImageBackground, Dimensions, TouchableOpacity, GestureResponderEvent, TextStyle } from 'react-native';

const { width } = Dimensions.get('window');

interface MonsterYellowBtnProps {
  textStyle?: StyleProp<TextStyle>;
  monsterPropsText: string;
  buttonStyle?: StyleProp<ViewStyle>;
  fontSize?: number;
  onPress: (event: GestureResponderEvent) => void;
  buttonWidth?: number;
  buttonHeight?: number;
}

const MonsterYellowBtn: React.FC<MonsterYellowBtnProps> = ({
  textStyle,
  buttonStyle,
  fontSize = width * 0.05290234,
  onPress,
  monsterPropsText,
  buttonWidth = width * 0.800435,
  buttonHeight = width * 0.2750345,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[{ margin: 8, }, buttonStyle]}
    >
      <ImageBackground
        source={require('../monsterSpyAssets/monsterSpyImages/monsterSpyButtonBack.png')}
        style={{
          justifyContent: 'center', width: buttonWidth,
          height: buttonHeight,
          alignItems: 'center',
        }}
        resizeMode="stretch"
      >
        <Text style={[{
          fontWeight: '700',
          color: 'white',
          textAlign: 'center',
        }, { fontSize }, textStyle]}>
          {monsterPropsText}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default MonsterYellowBtn;