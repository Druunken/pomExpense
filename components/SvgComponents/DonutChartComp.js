import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Path } from 'react-native-svg'
import Animated, { useSharedValue, withSpring, useAnimatedProps, withTiming } from 'react-native-reanimated';
import DonutSegment from './DonutSegment';
import { Colors } from '@/constants/Colors'
import numberInputValidation from '@/services/numberInputValidation';
import BasicChartComp from './BasicChartComp';


  /* 
  
    we need width and height as props


  
  */

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const DonutChartComp = ({ width, height, isVisible, outputData }) => {


  const [renderItems,setRenderItems] = useState([])
  const [totalAmount,setTotalAmount] = useState(0)
  const [infoItems,setInfoItems] = useState([])
  const [pressed,setPressed] = useState(false)

  const radius = 80;
  const strokeWidth = 18;
  const cx = 100
  const cy = 100

  const clrArr = [Colors.primaryBgColor.brown,Colors.primaryBgColor.darkPurple,Colors.primaryBgColor.dark,Colors.primaryBgColor.primeLight,Colors.primaryBgColor.persianRed]

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
      const presshandler2 = () => { 
        console.log(key)
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
        opacity={0.9}
        index={index + 1}
        isVisible={isVisible}
        rotation={index !== 0 ? initialRotationVal * 360  : 0}
        onPress={pressHandler}
        onPress2={presshandler2}
        />
      )
      initialRotationVal += progress  // the percentage here
      index++
    }
    setRenderItems(elements)
    setInfoItems(txtElements)
    setTotalAmount(totalAmount) 
  }

  useEffect(() => {
    renderData()
  },[isVisible,outputData]) 


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollDiv}>
      {/* <Svg width={width} height={height}>
        <DonutSegment 
        cx={cx}
        cy={cy}
        radius={radius}
        progress={1}
        strokeWidth={40}
        stroke={Colors.primaryBgColor.gray}
        opacity={0.5}
        background={true}
        />
        { renderItems }

      </Svg> */}

      <View style={styles.infoDiv}>
        {infoItems}
      </View>
      </ScrollView>
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
    flexDirection:"row",
  },
  labelDiv:{
    position:"absolute",
    left:100 - 30
  },
  infoDiv:{
    height:"100%",
  },
  scrollDiv:{
    width:"100%",
    height:1000,
  },
  elemDiv:{
    borderRadius:3,
    paddingHorizontal:5,
    justifyContent:"center",
    height:100,
    alignItems:"center"
  },
  label:{

  },
  mainLabel:{
    fontSize:15,
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.brown,
  },
  graphContainer:{
    width:"100%",
  },
  elemContainer:{
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-between"
  },

})