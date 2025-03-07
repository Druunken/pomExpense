import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'

const AnimatedSplashScreen = () => {


    const loadingArr = ["Grinding coffee","Heating up Water","Not enough Coffee","Grinding again","Brewing the Coffee now","Done!"]
    const [loadingIndex,setLoadingIndex] = useState(0)

    const opacity = useSharedValue(0)

    const animatedView = useAnimatedStyle(() => {
        return {
            opacity:opacity.value
        }
    })

    const [ready,setReady] = useState(false)


    useEffect(() => {
        setInterval(() => {
            setLoadingIndex((prev)  => prev + 1)
        }, 1500);
        setTimeout(() => {
            opacity.value = withTiming(1,{duration:1000})
            setReady(true)
        }, 500);
    },[])

    return (
    <Animated.View style={[styles.container,animatedView,{position:"relative"}]}>
        <View style={[styles.greetLayout,{opacity:0}]}>
            <Text style={styles.greetP}>POMPOM SAVINGS</Text>
        </View>
        <View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
            {/* <View style={styles.hideView} /> */}
            <LottieView style={{height:180,width:180,borderWidth:0}} resizeMode='cover' loop autoPlay={true} source={require("../assets/lottie/lottieCoffee.json")} />
        </View>
        <View style={{justifyContent:"center",alignItems:"center",width:"100%"}}>
            <LottieView resizeMode='cover' style={{height:50,width:50}} loop autoPlay={true} source={require("../assets/lottie/animated_progress_bar.json")} />
            <Text style={styles.label}>{loadingArr[loadingIndex]}</Text>
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
        justifyContent:"space-around",
        alignItems:"center",
        position:"relative",
        height:"100%",
        width:"100%",
    },
    label:{
        fontSize:13,
        color:Colors.primaryBgColor.black,
        fontFamily:"MainFont"
    },
    hideView:{
        position:"absolute",
        bottom:0,
        right:0,
        height:30,
        width:300,
        backgroundColor:Colors.primaryBgColor.prime,
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
    },
    greetLayout:{
        width:"100%",
        alignItems:"center",
        justifyContent:"center",
        textAlign:"center",
        borderWidth:3,
        backgroundColor:Colors.primaryBgColor.babyBlue,
        padding:3,
        borderRadius:13,
        borderColor:"white"
      },
      greetP:{
        fontSize:35,
        fontWeight:900,
        color:"white",
        borderWidth:3,
        padding:10,
        borderRadius:10,
        backgroundColor:Colors.primaryBgColor.prime,
        width:"100%",
        borderColor:"white",
        overflow:"hidden",
        textAlign:"center"
      },
})