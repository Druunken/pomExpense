import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'

const AnimatedViewComp = () => {
    const [ready,setReady] = useState(false)


    useEffect(() => {
        setTimeout(() => {
            setReady(true)
        }, 500);
    })
  return (
    <View style={styles.container}>
      <LottieView resizeMode="cover" style={styles.mainView} autoPlay={ready} loop={false} source={require("../assets/lottie/bgAnimated.json")} />
    </View>
  )
}

export default AnimatedViewComp

const styles = StyleSheet.create({
    mainView:{
        height:300,
        width:"100%"
    },
    container:{
        position:"absolute",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        display:"flex",
        justifyContent:"flex-end",
        zIndex:1
    }
})