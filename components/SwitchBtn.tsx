import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import db from '../services/serverSide.js'
import Animated,{ interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'
import { incomeActiveContext } from '@/hooks/balanceContext.tsx'

const SwitchBtn = ({ label,active,setActive }) => {

    const leftCircle = useSharedValue(5)
    const textOpacity = useSharedValue(1)
    const animatedCircleDiv = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            leftCircle.value,
            [5,42],
            [Colors.primaryBgColor.white,Colors.primaryBgColor.babyBlue]
        )
        return{
            backgroundColor,
        }   
    })
    const animatedText = useAnimatedStyle(() => {
        return{
            opacity: textOpacity.value
        }
    })
    const animatedCircle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            leftCircle.value,
            [5,42],
            [Colors.primaryBgColor.black,Colors.primaryBgColor.prime]
        )
        return{
            left: leftCircle.value,
            backgroundColor,
        }   
    })

    useEffect(() => {
        if(active){
            leftCircle.value = withSpring(42,{damping:12})
        }else if(!active) leftCircle.value = withSpring(5,{damping:12})
        
        textOpacity.value = withTiming(0,{duration:30}, () => {
            textOpacity.value = withTiming(1,{duration:250})
        })
    },[active])

  return (
    <View style={styles.container}>
        {label && (
            <Text style={styles.label}>{label} {active}</Text>
        )}
            <TouchableOpacity activeOpacity={0.9} onPress={() => {
                if(setActive === undefined) return
                setActive(prev => !prev)
            }}>
                <Animated.View style={[styles.switchLayout,animatedCircleDiv,{alignItems: active ? "flex-start" : "flex-end"}]}>
                    <Animated.View style={[styles.switchBtn,animatedCircle]}>
                    </Animated.View>
                    <Animated.Text style={animatedText}>{active && label ? "ON" : !active && label ? "OFF" : ""}</Animated.Text>
                </Animated.View>
            </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
    switchLayout:{
        width:70,
        height:30,
        borderRadius:15,
        justifyContent:"center",
        paddingHorizontal:10,
        position:"relative",
        backgroundColor:"white",
    },
    switchBtn:{
        position:"absolute",
        backgroundColor:Colors.primaryBgColor.prime,
        width:20,
        height:20,
        borderRadius:10,
        left:5
    },
    container:{
        flexDirection:"column",
        alignItems:"center",
        marginVertical:3,
        gap:10
    },
    label:{
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont",
        fontSize:17,
    }
})

export default SwitchBtn