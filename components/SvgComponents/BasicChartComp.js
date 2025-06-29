import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import DonutSegment from './DonutSegment'
import { Circle, G, Path, Svg } from 'react-native-svg';


const WIDTH = 200

const BasicChartComp = ({ label, percentage, bgColor, val, cateLabel, index, width, pressed, setPressed  }) => {


    const elemWidth = useSharedValue(0)
    const elemOp = useSharedValue(1)

    const containerOp = useSharedValue(0)

    const backElOp = useSharedValue(0)
    const backIndex = useSharedValue(1)
    const backWidth = useSharedValue(0)

    const closeOp = useSharedValue(0)
    const closeIndex = useSharedValue(0)

    const animateStart = () => {
      containerOp.value = withTiming(1,{ duration:500 + (index * 50)})
      backIndex.value = 1
      backElOp.value = withTiming(1,{ duration:500 })
      backWidth.value = withSpring(width - 50)
      closeIndex.value = 1
      closeOp.value = withTiming(1,{ duration: 250 })
    }

    const closeAnimate = () => {
      backElOp.value = withTiming(0,{ duration:250 })
      backWidth.value = withSpring(-1)
      closeOp.value = withTiming(0,{ duration: 250 })

      setTimeout(() => {
        closeIndex.value = -3
        backIndex.value = -3
      }, 500);

      setPressed(false)
    }

    const animatedChart = useAnimatedStyle(() => {
        return{
            width: elemWidth.value,
            opacity: elemOp.value,
        }
    })

    const animatedContainer = useAnimatedStyle(() => {
      return{
        opacity: containerOp.value,

      }
    })

    const animatedBackElem = useAnimatedStyle(() => {
      return {
        opacity: backElOp.value,
        width: backWidth.value,
        zIndex: backIndex.value
      }
    })

    const animatedCloseDiv = useAnimatedStyle(() => {
      return {
        zIndex: closeIndex.value,
        opacity: closeOp.value
      }
    })

    const onPressHandler = () => {
        console.log(percentage,"Percentage")
    }

    const onClose = (  ) => {
      closeAnimate()
      
    }

    useEffect(() =>{ 
      console.log( percentage < 0.1)
      setTimeout(() => {
        containerOp.value = withTiming(1,{ duration:250 })
        elemWidth.value = withSpring(percentage * 200 + ( percentage < 0.1 ? 50 : percentage < 0.2 ? 40 : percentage < 0.3 ? 35 : -4),{damping: 14})
      }, 300 * index);
    },[percentage])
  return (
    <Animated.View style={[animatedContainer,styles.container,]}>

      {/* CHART */}
      <View style={{gap:5}}>
        <Animated.View style={{width: WIDTH, backgroundColor:Colors.primaryBgColor.gray,borderRadius:10,borderWidth:2,borderColor:Colors.primaryBgColor.black}}>
          <Animated.View style={[animatedChart,styles.chart,{ backgroundColor: bgColor}]}>
            <TouchableOpacity onPress={animateStart} style={[styles.btn,{width:percentage < 0.93 ? (percentage * 200): (percentage * 200)}]} />
            <Text style={styles.label}>{label}%</Text>
          </Animated.View>
        </Animated.View>

        {/* <Svg width={200} height={200}>
          <DonutSegment  cx={100} cy={120} radius={50} strokeWidth={20} background={true}/>
          <DonutSegment progress={percentage} cx={100} cy={120} radius={50} strokeWidth={20} stroke={bgColor} index={index}/>
        </Svg> */}
      </View>
      
      {/* RIGHT CONTAINER  */}
      <View style={[styles.elemDiv,{backgroundColor:bgColor}]}>
        <Text style={[styles.mainLabel,{ color: Colors.primaryBgColor.black }]}>{cateLabel}</Text>
        <View style={{flexDirection:"row",gap:5,marginBottom:10,minWidth:100,justifyContent:"center"}}>
            <Text style={styles.label}>{val}$</Text>
        </View>
      </View>
      

      {/* Absolute Container */}
      <Animated.View style={[styles.backElemDiv,animatedBackElem,{backgroundColor:bgColor,borderWidth:3}]}>
        <View style={[styles.cateDiv,{marginLeft:40}]}>
          <View style={styles.div}>
            <Text style={styles.infoLabel}>Total:</Text>
            <Text style={styles.valLabel}>Placeholder</Text>
          </View>
        </View>
        <View style={styles.cateDiv}>
          <Text style={styles.mainLabel}>{cateLabel}</Text>
          <Text style={styles.label}>{val}</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[animatedCloseDiv,{position:"absolute",left:20,height:"100%",justifyContent:"center"}]}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back-circle" size={30}/>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

export default BasicChartComp

const styles = StyleSheet.create({
    container:{
        width:"100%",
        justifyContent:"center",
        height:100,
        position:"relative",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:10
    },
    infoLabel:{
      fontSize:15,
      fontFamily:"BoldFont",
      color:Colors.primaryBgColor.balck
    },
    valLabel:{
      fontSize:15,
      fontFamily:"LightFont",
      color:Colors.primaryBgColor.gray,
    },
    div:{
      flexDirection:"row",
      gap:5
    },
    backElemDiv:{
        position:"absolute",
        height:"100%",
        flexDirection:"row",
        paddingHorizontal:10,
        borderRadius:3,
        justifyContent:"space-between"
    },

    btn:{
        width:"100%",
        top:0,
        position:"absolute",
        height:"100%",
        zIndex:100,
    },
    chart:{
        borderRadius:10,
        minWidth:50,
        paddingHorizontal:4,
        height:25,
        justifyContent:"center",
        overflow:"visible"
    },
    label:{
        fontFamily:"MainFont",
        fontSize:11
    },
    elemDiv:{
      borderRadius:3,
      justifyContent:"center",
      height:"100%",
      alignItems:"center",
  },
  mainLabel:{
    fontFamily:"BoldFont",
    fontSize:16,
  },
  cateDiv:{
    height:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
})