import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const AnimatedSplashScreen = () => {
  return (
    <View style={styles.container}>
        <LottieView style={{height:150,width:150}} autoPlay loop source={require("../assets/lottie/loading_bar.json")} />
    </View>
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