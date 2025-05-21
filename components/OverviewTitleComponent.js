import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const OverviewTitleComponent = ({label,statusCount,setStatusCount}) => {


    const backArrowOp = useSharedValue(0)
    const forwardArrowOp = useSharedValue(0)

    const backBtnHandler = () => {
        setStatusCount(prev => {
            console.log(prev)
            if(prev - 1 < 0) return prev
            else return prev - 1
        })
    }
    const forwardBtnHandler = () => {
        setStatusCount(prev => {
            if(prev + 1 > 1) return prev
            else return prev + 1
        })
    }
    const animatedBackArrow = useAnimatedStyle(() => {
        return {
            opacity:backArrowOp.value,
        }
    })

    const animatedForwardArrow = useAnimatedStyle(() => {
        return {
            opacity:forwardArrowOp.value,
        }
    })

    useEffect(() => {
        if(statusCount === 0) {
            backArrowOp.value = withTiming(0,{duration: 150})
            forwardArrowOp.value = withTiming(1,{duration: 150})
        }
        else if(statusCount === 1){
            backArrowOp.value = withTiming(1,{duration: 150})
            forwardArrowOp.value = withTiming(0,{duration: 150})
        }
    },[statusCount])
  return (
    <View style={styles.container}>
        <Animated.View style={animatedBackArrow}>
            <TouchableOpacity style={[styles.btn]} onPress={backBtnHandler}>
                <Ionicons name='chevron-back' size={30}/>
            </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.labelDiv}>
            <Text style={[styles.label,{}]}>{label}</Text>
        </View>
        <Animated.View style={animatedForwardArrow}> 
            <TouchableOpacity style={[styles.btn]} onPress={forwardBtnHandler}>
                <Ionicons name='chevron-forward' size={30}/>
            </TouchableOpacity>  
        </Animated.View>
    </View>
  )
}

export default OverviewTitleComponent

const styles = StyleSheet.create({
    container:{
        width:"100%",
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        marginBottom:15,
        position:"absolute",
        top:10
    },
    labelDiv:{
        justifyContent:"center",
        alignItems:"center",
    },
    label:{
        fontFamily:"BoldFont",
        color:Colors.primaryBgColor.darkPurple,
        fontSize:30,
        textAlign:"center",
    },
    btn:{
        width:50,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:15,
    }
})