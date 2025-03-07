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
        setTimeout(() => {
            opacity.value = withTiming(1,{duration:1000})
        }, 500);
    },[])

    return (
    <Animated.View style={[styles.container,animatedView]}>
        <View style={{position:"relative", borderWidth:0,width:400}}>
            <View style={styles.hideView} />
            <LottieView style={{height:390,width:390}} loop autoPlay={true} source={require("../assets/lottie/lottieCoffee.json")} />
        </View>
        {/* <View style={{justifyContent:"center",alignItems:"center",width:500}}>
            <LottieView resizeMode='contain' style={{height:150,width:150}} loop autoPlay={true} source={require("../assets/lottie/animated_progress_bar.json")} />
        </View> */}
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
        zIndex:1,
    }
})