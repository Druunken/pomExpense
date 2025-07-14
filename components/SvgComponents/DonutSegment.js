import React, { forwardRef, useEffect } from 'react';
import { Path as SkiaPath } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';

// Forward ref to SkiaPath
const ForwardedPath = forwardRef((props, ref) => {
  return <SkiaPath ref={ref} {...props} />;
});

const AnimatedPath = Animated.createAnimatedComponent(ForwardedPath);

// DonutSegment forwards ref as well (optional)
const DonutSegment = forwardRef(({ path, stroke, opacity = 0.8, isVisible }, ref) => {
  const strokeWidth = useSharedValue(15);

  const animatedProps = useAnimatedProps(() => ({
    strokeWidth: strokeWidth.value,
  }));

  useEffect(() => {
    if (isVisible) {
      strokeWidth.value = withSpring(selected ? 30 : 15);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatedPath
      ref={ref}
      path={path}
      stroke={stroke}
      strokeCap="round"
      opacity={opacity}
      animatedProps={animatedProps}
    />
  );
});

export default DonutSegment;