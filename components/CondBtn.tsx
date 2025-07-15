import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'


const CondBtn = ({ label, type, onPress, cond, style, genreTypes }) => {


  const btnWidth = 120
  const containerWidth = useSharedValue(btnWidth)


  const animatedContainer = useAnimatedStyle(() => {
    return {
      width: containerWidth.value
    }
  })


  useEffect(() => {
    if(!cond && type !== "")
    {
      containerWidth.value = withTiming(80,{ duration: 250 })
      setTimeout(() => {
        containerWidth.value = withSpring(btnWidth)
      }, 250);
    }
  },[cond])
  
  return (
    <Animated.View style={[animatedContainer,styles.container,style, type === "confirm" ? styles.confirm : styles.decline, {
      opacity: cond ? 0.5 : 1,
    }]}>
    <TouchableOpacity disabled={cond}  onPress={onPress} style={{width:"100%",height:"100%",paddingHorizontal:10,justifyContent:"center",alignItems:"center"}}>
      <Text style={[styles.label, type === "confirm" ? styles.labelConfirm : styles.labelDecline]}>{label}</Text>
    </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    container:{
        width:120,
        height:50,
        borderWidth:3,
        borderColor:Colors.primaryBgColor.lightPrime,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
    },
    label:{

    },
    confirm:{
        backgroundColor: Colors.primaryBgColor.prime
    },
    decline:{
        backgroundColor: Colors.primaryBgColor.persianRed,
        borderColor:"red"
    },
    labelConfirm:{
        fontFamily:"MainFont",
        fontSize:20,
        color:"white"
    },
    labelDecline:{
        fontFamily:"MainFont",
        fontSize:20,
    },
})

export default CondBtn