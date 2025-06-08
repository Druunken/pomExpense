import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const SwitchComponent = ({ label, width, color, steps, titles, state, setState, bgColor1, bgColor2, bgColor3 }) => {
  const [pressed,setPressed] = useState(false)
  const [pressedCounts,setPressedCounts] = useState(0)
  const [align,setAlign] = useState("flex-start")
  const [title,setTitle] = useState("")

  const [divWidth,setDivWidth] = useState(0)
  
  const indicatorX = useSharedValue(0)
  const indicatorBG = useSharedValue(0)

  const fn = () => {
    console.log("function here")
  }

  const animatedContainer = useAnimatedStyle(() => {
    return {
      
    }
  })

  const animatedIndicator = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      indicatorBG.value,
      [0,0.5,1],
      [bgColor1,bgColor2,bgColor3]
    )
    return {
      transform: [{ translateX: indicatorX.value }],
      backgroundColor: backgroundColor

    }
  })

  const handlePress = () => {
    const validLabel = label === "BalanceType"
    
    if(steps === 2 && pressedCounts === 0){
      setTitle(titles[1])
      indicatorX.value = withTiming((divWidth / 2) - 20, { duration: 250})
      indicatorBG.value = withTiming(0.5,{ duration: 250 })
      /* setAlign("center") */
      if(validLabel){
        setState("minus")
      }else setState(true)
    }else if(steps === 2 && pressedCounts === 1){
      setTitle(titles[2])
      indicatorX.value = withTiming((divWidth) - 40, { duration: 250})
      indicatorBG.value = withTiming(1,{ duration: 250 })
      if(validLabel) setState("plus")
      else setState(false)
    }else if(steps === 2 && pressedCounts === 2){
      setTitle(titles[0])
      indicatorX.value = withSpring(0,{ damping:12})
      indicatorBG.value = withTiming(0,{ duration: 250 })
      if(validLabel) setState("")
      else setState(null)
    }
    return setPressedCounts((prev) => {
      if(prev !== 2){
        return prev + 1
      }else return 0

    })
  }

  useEffect(() => {
    if(titles[0] === undefined) return
    else setTitle(titles[0])
  },[])

  
  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity activeOpacity={0.8} style={[{}]} onPress={() => {
            setPressed((prev) => !prev)
            handlePress()
          }}>
      <View onLayout={((event) => {
        const { width } = event.nativeEvent.layout
        setDivWidth(width)
      })} style={[styles.layout, {alignItems:align}]}>
        <Animated.View style={[animatedIndicator,styles.indicator]}>
        </Animated.View>
      </View>
      </TouchableOpacity>
    </View>
  )
}

export default SwitchComponent

const styles = StyleSheet.create({
    container:{
        
    },
    indicator:{
        width:25,
        height:25,
        borderRadius:13,
        backgroundColor:Colors.primaryBgColor.prime,
      },
      layout:{
        borderRadius:20,
        borderWidth:2,
        borderColor:Colors.primaryBgColor.white,
        width:"100%",
        padding:5,
        alignItems:"flex-start",
        backgroundColor:Colors.primaryBgColor.newPrimeLight
      },
      label:{
        fontSize:12,
        color:Colors.primaryBgColor.black,
        fontFamily:"MainFont",
        textAlign:"center"
      }
})