import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Path } from 'react-native-svg'
import Animated, { useSharedValue, withSpring, useAnimatedProps, withTiming } from 'react-native-reanimated';
import DonutSegment from './DonutSegment';
import { Colors } from '@/constants/Colors'


  /* 
  
    we need width and height as props


  
  */

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const DonutChartComp = ({ width, height, isVisible, outputData }) => {


  const [renderItems,setRenderItems] = useState([])

  const radius = 80;
  const strokeWidth = 18;
  const cx = 100
  const cy = 100

  const clrArr = [Colors.primaryBgColor.black,Colors.primaryBgColor.darkPurple,Colors.primaryBgColor.dark,Colors.primaryBgColor.primeLight,Colors.primaryBgColor.babyBlue]


  const renderData = () =>{
    let elements = []
    let index = 0
    let initialRotationVal = 0;

    const percentageArr = [0.2,0.5,0.2]

    /* 
      
        check if its last element so we can make a gap and reduce the percentage to make it better visually

    */

    for(const [key,value] of Object.entries(outputData)){
      elements.push(
        <DonutSegment
        key={index} 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={percentageArr[index]} // the percentage here
        strokeWidth={strokeWidth}
        stroke={clrArr[index]}
        opacity={0.9}
        index={index + 1}
        isVisible={isVisible}
        rotation={index !== 0 ? initialRotationVal * 360 + 15 : null}
        />
      )
      initialRotationVal += percentageArr[index]+ (0.04 * index) // the percentage here
      index++
    }
    setRenderItems(elements)
  }

  useEffect(() => {
    renderData()
  },[isVisible]) 

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* The Cirlce itself */}
        <DonutSegment 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={1}
        strokeWidth={strokeWidth}
        stroke={Colors.primaryBgColor.gray}
        opacity={0.5}
        background={true}
        />
        { renderItems }
        {/* <DonutSegment 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={0.2}
        strokeWidth={strokeWidth}
        stroke={"green"}
        opacity={0.5}
        index={1}
        isVisible={isVisible}
        />

        <DonutSegment 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={0.5}
        strokeWidth={strokeWidth}
        stroke={"blue"}
        opacity={0.3}
        rotation={0.2 * 360 + 15}
        index={2}
        isVisible={isVisible}
        />
        <DonutSegment 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={0.15}
        strokeWidth={strokeWidth}
        stroke={"purple"}
        opacity={0.5}
        rotation={0.7 * 360 + 30}
        index={3}
        isVisible={isVisible}
        /> */}
      </Svg>
    </View>
  )
}

export default DonutChartComp

const styles = StyleSheet.create({
  container:{
    width:"100%",
    height:"100%",
    justifyContent:"center",
    alignItems:"center",
  }
})