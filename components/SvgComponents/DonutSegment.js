import React, { useEffect } from 'react';
import { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
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
  isVisible
}) => {
  const circumference = 2 * Math.PI * radius;

  const progressValue = useSharedValue(0)

  const animatedProps = useAnimatedProps(() => {
    const dashLength = circumference * progressValue.value;
    return {
      strokeDasharray: [dashLength, circumference - dashLength],
    };
  });

  useEffect(() => {
      if(isVisible){
        progressValue.value = withTiming(progress,{ duration: 800 * (index + 1)})
      }
    },[isVisible])

  return (
    <AnimatedCircle
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
      onPress={() => { console.log(index)}}
    />
  );
};

export default DonutSegment;