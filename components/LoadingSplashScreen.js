import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { Colors } from '@/constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const LoadingSplashScreen = ({ title, visible }) => {

    const opacityVal = useSharedValue(0)
    const layoutX = useSharedValue(150)


    const animatedStyle = useAnimatedStyle(() => {
        return{
            opacity:opacityVal.value
        }
    })
    const animatedLayout = useAnimatedStyle(() => {
        return{
            transform: [{
                translateX:layoutX.value
            }]
        }
    })

    useEffect(() => {
        if(visible){
            opacityVal.value = withTiming(1,{ duration: 250 })
            layoutX.value = withSpring(0)
        }
    },[visible])
  return (
    <Animated.View style={[styles.container,animatedStyle]}>
        <Animated.View style={[styles.layout,animatedLayout]}>
            <LottieView autoPlay loop style={styles.loadingBar} resizeMode='cover' source={require("../assets/lottie/lottieCoffee.json")} />
            <Text style={{fontFamily:"MainFont",fontSize:11}}>{title}</Text>
        </Animated.View>
    </Animated.View>
  )
}

export default LoadingSplashScreen

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        justifyContent:"center",
        alignItems:"center",
        zIndex:1,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    layout:{
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:Colors.primaryBgColor.chillOrange,
        width:200,
        height:150,
        borderRadius:20
    },
    loadingBar:{
        width:100,
        height:100
    }
})