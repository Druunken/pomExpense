import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, width } from 'react-native-reanimated'

import Svg, { Circle, Path, G } from 'react-native-svg'

import { Colors } from '@/constants/Colors'
import DonutSegment from './SvgComponents/DonutSegment'
import BasicChartComp from './SvgComponents/BasicChartComp'
import numberInputValidation from '@/services/numberInputValidation';

const radius = 50;
const strokeWidth = 15;
const cx = 80
const cy = 80
const clrArr = [Colors.primaryBgColor.brown,Colors.primaryBgColor.darkPurple,Colors.primaryBgColor.dark,Colors.primaryBgColor.primeLight,Colors.primaryBgColor.persianRed]


const ChartView = ({ percentage, outputData, isVisible, width, height }) => {

    const [infoItems,setInfoItems] = useState([])
    const [renderItems,setRenderItems] = useState([])
    const [pressed,setPressed] = useState(false)

    const animatedChart = useAnimatedStyle(() => {
        return{
        }
    })
    
    const renderData = () =>{
    let elements = []
    let txtElements = []
    let index = 0
    let initialRotationVal = 0
    let totalAmount = 0
    let len = 0

    for(const [key,value] of Object.entries(outputData)){
      totalAmount += Math.abs(value.amount)
      len++
    }

    for(const [key,value] of Object.entries(outputData)){
      const progress = Math.abs(value.amount) / totalAmount
      const uniqueKey = `${key}-${index}`

      const pressHandler =  () => {
         console.log("Pressed segment with key:", uniqueKey);
      }

      txtElements.push(
        <View style={styles.elemContainer} key={index}>

        <View style={styles.graphContainer}>
            <BasicChartComp pressed={pressed} setPressed={setPressed} width={width} percentage={progress} bgColor={clrArr[index]} index={index} cateLabel={key} label={(progress * 100).toFixed(2)} val={numberInputValidation.converToString((value.amount).toFixed(2))} />
        </View>

        </View>
      )

      elements.push(
        <DonutSegment
        key={uniqueKey} 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={progress} // the percentage here
        strokeWidth={strokeWidth}
        stroke={clrArr[index]}
        opacity={0.8}
        index={index + 1}
        isVisible={isVisible}
        rotation={index !== 0 ? initialRotationVal * 360  : 0}
        onPress={pressHandler}
        />
      )
      initialRotationVal += progress  // the percentage here
      index++
    }
    setInfoItems(txtElements) 
    setRenderItems(elements)
  }

    useEffect(()  => {
        renderData()
    },[])

  return (
    <View style={[styles.container,{width:"100%"}]}>
        <View style={styles.chartDiv}>
            <Animated.View style={[animatedChart,styles.chart,{borderWidth:1}]}>
                <Svg width={200} height={200}>
                    <G>
                        {/* <DonutSegment 
                        cx={cx}
                        cy={cy}
                        radius={radius}
                        progress={1}
                        strokeWidth={40}
                        stroke={Colors.primaryBgColor.gray}
                        opacity={0.5}
                        background={true}
                        /> */}
                        { renderItems }
                    </G>
                </Svg>
            </Animated.View>
        </View>
    </View>
  )
}

export default ChartView

const styles = StyleSheet.create({
    container:{
        width:"100%",
        borderWidth:1,
        height:300,
        borderRadius:20,
        paddingHorizontal:20,
        paddingTop:10
    },
    chart:{
        borderRadius:10,
    },
    chartDiv:{
        backgroundColor:Colors.primaryBgColor.gray
    },
    elemContainer:{
        borderWidth:1,

    }
})