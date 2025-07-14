import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import numberInputValidation from '../services/numberInputValidation.js';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors } from '@/constants/Colors'



const CompareGraphSegment = ({ index, clr, values, mainLabel, isVisible, percentage }) => {

    const elemHeight = useSharedValue(300)

    const animatedElemContainer = useAnimatedStyle(() => {
        return{
            height: elemHeight.value
        }
    })

    const pressHandler = () => {

    }

    useEffect(() => {
        if(isVisible){
            setTimeout(() => {
                elemHeight.value = withSpring(percentage * (300 - 17 * 2) + ( percentage < 0.1 ? 30 : percentage < 0.2 ? 50 : percentage < 0.3 ? 35 : -4),{damping: 14})
            }, 350 * index);
        }
    },[isVisible])

  return (
    <View style={[styles.itemDiv,{height:300}]} >
        <View style={{height:17}}>
            <Text style={styles.label}>{mainLabel}</Text>
        </View>
        <View style={{height:17}}>
            <Text style={styles.label} >{(percentage * 100).toFixed(2)}%</Text>
        </View>

        <TouchableOpacity onPress={pressHandler} >
        <Animated.View key={index} style={[styles.itemDiv,animatedElemContainer,{ backgroundColor: clr,borderWidth:2}]}>
            <Text>{numberInputValidation.converToString(Number(values.amount.toFixed(2)))}</Text>
        </Animated.View>
        </TouchableOpacity>
    </View>
  )
}

export default CompareGraphSegment

const styles = StyleSheet.create({
    itemDiv:{
        justifyContent:"space-between",
        alignItems:"center",
        borderWidth:2,
        borderRadius:12,
        padding:5,
        minWidth:80,
        overflow:"hidden",
        backgroundColor:"white"
    },
    label:{
        fontSize:15,
        fontFamily:"MainFont",
    }
})