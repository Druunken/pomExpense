import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const SwipeLabelDataComp = ({ setState, dataLength, label, backLabel, forwLabel }) => {


    /* 
    


    */

    const arrForwOp = useSharedValue(0)
    const arrBackOp = useSharedValue(1)


    const animatedForwBtn = useAnimatedStyle(() => {
        return{
            opacity: arrForwOp.value,
        }
    })

    const animatedBackOp = useAnimatedStyle(() => {
        return {
            opacity: arrBackOp.value
        }
    })


    const pressBack = () => {
        setState((prev) =>{
            if(prev - 1 < 0){ 
                return prev
            }
            return prev - 1 
        })
    }

    const pressForw = () => {
        setState((prev) =>{
            if(prev + 1 >= dataLength){
                return prev
            }
            return prev + 1
        })
    }

    useEffect(() => {

        if(backLabel === ""){
            arrBackOp.value = withTiming(0,{ duration: 250 })
        }else if(backLabel !== ""){

            arrBackOp.value = withTiming(1,{ duration: 250})
        }

        if(forwLabel === ""){
            arrForwOp.value = withTiming(0,{ duration: 250 })
        }else if(forwLabel !== ""){
            arrForwOp.value = withTiming(1,{ duration: 250})
        }
    },[label,backLabel])

  return (
    <View style={styles.container}>
        <View style={styles.div}>
            <Animated.View style={animatedBackOp}>
                <TouchableOpacity activeOpacity={0.9} style={styles.btn} onPress={pressBack} disabled={backLabel === ""}>
                    <Ionicons name='arrow-back' size={40}/>
                    <Text style={styles.btnLabel}>{backLabel}</Text>
                </TouchableOpacity>
            </Animated.View>
            <View style={{minWidth:80,justifyContent:"center",alignItems:"center"}}>
                <Text style={styles.label}>{label}</Text>
            </View>
            <Animated.View style={animatedForwBtn}>
            <TouchableOpacity activeOpacity={0.9} style={styles.btn} onPress={pressForw}  disabled={forwLabel === ""}>
                <Ionicons name='arrow-forward' size={40}/>
                <Text style={styles.btnLabel}>{forwLabel}</Text>
            </TouchableOpacity>
            </Animated.View>
        </View>
    </View>
  )
}

export default SwipeLabelDataComp

const styles = StyleSheet.create({
    container:{
        width:"100%",
    },
    div:{
        flexDirection:"row",
        justifyContent:"center",
        gap:60,
        alignItems:"center"
    },
    label:{
        fontSize:25,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black
    },
    btnLabel:{
        fontSize:13,
        color:Colors.primaryBgColor.gray,
        fontFamily:"MainFont"
    },
    btn:{
        minWidth:80,
        justifyContent:"center",
        alignItems:"center"
    }
})