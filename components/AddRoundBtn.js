import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '@/constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

const AddRoundBtn = ({ onPress, setShowAdd }) => {

    const btnWidth = 70
    const btnHeight = 70
    const containerWidth = useSharedValue(btnWidth)
    const containerHeight = useSharedValue(btnHeight)

    const animatedContainer = useAnimatedStyle(() => {
        return{
            width: containerWidth.value,
            height: containerHeight.value
        }
    })

    useEffect(() => {
        containerWidth.value = withRepeat(
            withTiming(60,{ duration: 1200}),
            -1,
            true
        )
        containerHeight.value = withRepeat(
            withTiming(60,{ duration: 1200}),
            -1,
            true
        )
    },[])

  return (
    <Animated.View style={[styles.container,animatedContainer]} >
        <TouchableOpacity onPress={() => {
            setShowAdd(true)
        }} style={styles.btn} >
            <Icon size={30} color={Colors.primaryBgColor.newPrimeLight} name='add' />
        </TouchableOpacity>
    </Animated.View>
  )
}

export default AddRoundBtn

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.primaryBgColor.prime,
        borderRadius:40,
        width:70,
        height:70,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:2,
        borderColor:Colors.primaryBgColor.white
    },
    btn:{
        borderWidth:2,
        borderRadius:40,
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        borderColor:Colors.primaryBgColor.babyBlue
    },
})