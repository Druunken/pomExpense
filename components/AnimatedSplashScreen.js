import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const AnimatedSplashScreen = () => {

    const opacity = useSharedValue(0)

    const animatedView = useAnimatedStyle(() => {
        return {
            opacity:opacity.value
        }
    })


    useEffect(() => {
        opacity.value = withTiming(1,{duration:1000})
    },[])
    
    return (
    <Animated.View style={[styles.container,animatedView]}>
        <LottieView style={{height:300,width:300}} loop autoPlay={true} source={require("../assets/lottie/pomCoffeeAnim.json")} />
    </Animated.View>
  )
}

export default AnimatedSplashScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})