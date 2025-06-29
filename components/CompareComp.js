import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { months } from '../constants/Dates.js'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'


import DonutChartComp from './SvgComponents/DonutChartComp.js'
import ChartView from './ChartView.js'

const { width } = Dimensions.get("window")

const CompareComp = ({ outputData, typeDate, setGivenWidth }) => {


    /* 



    */

    const [renderItems,setRenderItems] = useState([])
    const [dimensions,setDimensions] = useState({})
    const [isVisible,setIsVisible] = useState(false)

    /* const renderData = () => {
      if(Object.keys(outputData).length > 0){
        let elements = []
        let index = 0
        for(const [key,value] of Object.entries(outputData)){
          elements.push(
           <View style={styles.elementDiv} key={index} onLayout={(ev) => setDimensions({ height: ev.nativeEvent.layout.height,width: ev.nativeEvent.layout.width})}>
            <View style={{justifyContent:"center",alignItems:"center"}}>
              <Ionicons name='arrow-up' />
              <Text>{key}</Text>
            </View>
            <Text>{value.amount}</Text>
            </View>
          )
          index++
        }
        setRenderItems(elements)
      }
    } */

    useEffect(() => {
      /* renderData() */
    },[outputData])

  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <Text style={{fontFamily:"BoldFont",fontSize:22,color:Colors.primaryBgColor.black}}>Compare Stats</Text>
      <View style={styles.layout}>
        {/* <DonutChartComp width={width} height={dimensions.height} isVisible={isVisible} outputData={outputData}/> */}
        <ChartView width={width} height={dimensions.height} isVisible={isVisible} outputData={outputData}/>
      </View>
    </View>
  )
}

export default CompareComp

const styles = StyleSheet.create({
    container:{
        width:width,
        alignItems:"center",
        height:250,
    },
    label:{
      fontSize:15,
      fontFamily:"MainFont",
    },
    layout:{
      width:width - 50,
      height:500,
    },
    elementDiv:{
    },
    elementContainer:{
      flexDirection:"row",
      height:"100%",
      width:"100%",
      alignItems:"flex-end",
      gap:30,
      paddingHorizontal:20
    }
})