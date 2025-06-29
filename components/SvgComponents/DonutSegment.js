import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import Svg, { Circle, G, Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DonutSegment = ({
  cx,
  cy,
  radius,
  strokeWidth,
  stroke,
  progress, 
  rotation = 0,
  opacity = 0.5,
  background = false,
  index,
  isVisible,
  onPress,
  onPress2
}) => {
  const circumference = 2 * Math.PI * radius;
  const strokeWidthVal = useSharedValue(strokeWidth)

  const progressValue = useSharedValue(0)

  const animatedProps = useAnimatedProps(() => {
    const dashLength = circumference * progressValue.value;
    return {
      strokeDasharray: [dashLength, circumference - dashLength],
      strokeWidth: strokeWidthVal.value
    };
  });

  const onPressHandler = () => {
    strokeWidthVal.value = withSpring(32)
    onPress()
    onPress2?.()
  }

  useEffect(() => {
      if(isVisible){
        progressValue.value = withSpring(progress,{ duration: 800 * (index + 1 )})
        console.log(progress)
      }

    },[isVisible])
    

  return (
    <Svg>
      <TouchableOpacity onPress={() => console.log("YES")}>
        <Text>Press</Text>
      </TouchableOpacity>
      <Path
      d='M 80 20 A 20 20 0 0 1 80 100'
      fill={"transparent"}
      strokeWidth={10}
      stroke={"white"}
      onPress={() => {console.log(index)}}
      />

      {/* <AnimatedCircle
      cx={cx}
      cy={cy}
      r={radius}
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      fill="none"
      stroke={stroke}
      opacity={opacity}
      animatedProps={!background && animatedProps}
      strokeDasharray={background && [circumference, 0]}
      rotation={-90 + rotation}
      originX={cx}
      originY={cy}
      onPress={onPressHandler}
    /> */}
    </Svg>
  );
};

export default DonutSegment;