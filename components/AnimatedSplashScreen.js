import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'

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
        <View>
            <View style={styles.hideView} />
            <LottieView style={{height:300,width:300}} loop autoPlay={true} source={require("../assets/lottie/lottieCoffee.json")} />
        </View>
        <View style={{justifyContent:"center",alignItems:"center",width:300}}>
            <LottieView style={{height:60,width:60}} loop autoPlay={true} source={require("../assets/lottie/loading_bar.json")} />
        </View>
    </Animated.View>
  )
}

export default AnimatedSplashScreen

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"space-between",
        position:"relative",
        flex:1,
        zIndex:-1
    },
    hideView:{
        position:"absolute",
        bottom:0,
        right:0,
        height:30,
        width:300,
        backgroundColor:Colors.primaryBgColor.newPrime,
        zIndex:-1,
    }
})