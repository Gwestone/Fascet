import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";

interface SlideAnimationProps {
  pressedLeft: boolean;
  pressedRight: boolean;
  children: React.ReactNode;
}

const SlideAnimation = ({
  pressedLeft,
  pressedRight,
  children,
}: SlideAnimationProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const containerStyle: StyleProp<ViewStyle> = {};

  if (pressedLeft && !pressedRight) {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    containerStyle.opacity = 1;
  } else if (!pressedLeft && pressedRight) {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    containerStyle.opacity = 0;
  }

  const slideStyle = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 200], // Adjust the value as per your desired slide distance
        }),
      },
    ],
  };

  return (
    <View style={[{ flex: 1 }, containerStyle]}>
      <Animated.View style={[{ flex: 1 }, slideStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

export default SlideAnimation;
