import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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

    const [ready,setReady] = useState(false)


    useEffect(() => {
        setTimeout(() => {
            opacity.value = withTiming(1,{duration:1000})
            setReady(true)
        }, 500);
    },[])

    return (
    <Animated.View style={[styles.container,animatedView,{position:"relative"}]}>
        <View style={{ borderWidth:0,width:400,justifyContent:"center",alignItems:"center"}}>
            {/* <View style={styles.hideView} /> */}
            <LottieView style={{height:180,width:180,borderWidth:0}} resizeMode='cover' loop autoPlay={true} source={require("../assets/lottie/lottieCoffee.json")} />
        </View>
        <View style={{justifyContent:"center",alignItems:"center",width:500}}>
            <LottieView resizeMode='contain' style={{height:150,width:150}} loop autoPlay={true} source={require("../assets/lottie/animated_progress_bar.json")} />
        </View>
        <View style={styles.lottieBottomView}>
            <LottieView resizeMode="cover" style={{height:150,width:"100%"}} autoPlay={ready} loop={false} source={require("../assets/lottie/bgAnimated.json")} />
        </View>
        <View style={styles.lottieTopView}>
            <LottieView resizeMode="cover" style={{height:200,width:"100%"}} autoPlay={ready} loop={false} source={require("../assets/lottie/heaven_top.json")} />
            
        </View>
    </Animated.View>
  )
}

export default AnimatedSplashScreen

const styles = StyleSheet.create({
    container:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        position:"relative",
        height:"100%",
        width:"100%"
    },
    hideView:{
        position:"absolute",
        bottom:0,
        right:0,
        height:30,
        width:300,
        backgroundColor:Colors.primaryBgColor.newPrime,
        zIndex:1,
    },
    lottieBottomView:{
        position:"absolute",
        bottom:0,
        left:0,
        zIndex:1,
        width:"100%",
        height:"100%",
        justifyContent:"flex-end"
    },
    lottieTopView:{
        position:"absolute",
        bottom:0,
        left:0,
        zIndex:1,
        width:"100%",
        height:"100%",
        justifyContent:"flex-start",
    }
})