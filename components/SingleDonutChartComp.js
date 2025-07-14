import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { interpolate } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors'
import numberInputValidation from '../services/numberInputValidation.js'
import LottieView from 'lottie-react-native';
import { incomeActiveContext, usersBalanceContext } from "../hooks/balanceContext";


const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DonutChart = ({
  amount = 75,
  max = 100,
  radius = 80,
  strokeWidth = 20,
  color = '#4CAF50',
  duration = 1200,
  index = 1,
  nonAbs = undefined,
  goal = undefined,
}) => {
  const percentage = (amount / max) * 100;
  console.log(percentage,"here")
  const size = (radius + strokeWidth) * 2;
  const circumference = 2 * Math.PI * radius;

  const {
    currency
  } = useContext(usersBalanceContext)

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(percentage < 0 ? 0 : percentage >= 100 ? 100 : percentage, { duration: duration * index});
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * (animatedProgress.value > 100 ? 100 : animatedProgress.value)) / 100;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.lottieDiv}> 
        <LottieView source={require("../assets/lottie/pomCoffeeAnim.json")} style={styles.lottie} resizeMode='contain' loop autoPlay />
      </View>
      <View style={[styles.lottieDiv,{ top:"44%"}]}>
        <Text style={[styles.label,{borderBottomWidth:0.2}]}>{percentage === 0 ? "0,00" : nonAbs ? numberInputValidation.converToString(Number(nonAbs ).toFixed(2)): numberInputValidation.converToString(Number(amount).toFixed(2))} {currency}</Text>
      </View>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.primaryBgColor.white}
            strokeWidth={15}
            fill="none"
          />
          {/* Animated Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            fill="none"
          />
        </G>

        {/* Text in the center */}
        { goal ? (
          <SvgText
            x="50%"
            y="70%"
            textAnchor="middle"
            fontSize="10"
            fill="gray"
          >
            {`${numberInputValidation.converToString(Number(goal).toFixed(2))} ${currency}`}
          </SvgText>
        ) : (
            <SvgText
            x="50%"
            y="70%"
            textAnchor="middle"
            fontSize="10"
            fill="gray"
          >
            {`${percentage.toFixed(0)}%`}
          </SvgText>
        ) }
      
        <SvgText
          x="85%"
          y="100%"
          textAnchor="middle"
          fontSize="10"
          fill="gray"
        >
          {`${percentage.toFixed(0)}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

export default DonutChart;

const styles = StyleSheet.create({
  lottie:{
    width:50,
    height:50,
  },
  lottieDiv:{
    position:"absolute",
    top:"10",
  },
  label:{
    fontSize:12,
    fontFamily:"BoldFont"
  },
  smallFont:{
    fontSize:10,
    fontFamily:"LightFont",
    color:Colors.primaryBgColor.gray
  },
})