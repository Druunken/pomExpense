import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Svg, { Path } from 'react-native-svg'
import Animated,{ useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing } from 'react-native-reanimated'

const AnimatedPath = Animated.createAnimatedComponent(Path)

const ProgressBarSvg = ({firstValue,secondValue,thirdValue,width}) => {

    const mainBarWidth = useSharedValue(0)

    const animatedProps = useAnimatedProps(() => {
        return {
            /* d: `M 50,50 Q ${mainBarWidth.value / 2 + 30}, -50 ${mainBarWidth.value},50` */
            d: `M 50, 50 L ${mainBarWidth.value}, 50`
          }
    })
    

    useEffect(() =>{
        mainBarWidth.value = withTiming(width , {
            duration: 500,
            easing: Easing.bounce,
          })
    },[])
    
  return (
    <Svg viewBox='10 -30 280 100' height={100}>
      <AnimatedPath stroke={"black"} fill={"transparent"} strokeLinecap='round' strokeWidth={25} animatedProps={animatedProps}/>
    </Svg>
  )
}

export default ProgressBarSvg

const styles = StyleSheet.create({
    container:{

    }
})