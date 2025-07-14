import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import DonutChartComp from './SvgComponents/DonutChartComp.js'

const { width } = Dimensions.get("window")

const GraphComp = ({ outputData, typeDate, setGivenWidth, isVisible }) => {


    /* 



    */

    const [renderItems,setRenderItems] = useState([])
    const [dimensions,setDimensions] = useState({})

    const renderData = () =>{
      let elements = []
      let index = 0

      for(const [key,value] of Object.entries(outputData)){
        console.log(key,value)
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

    useEffect(() => {
      if(outputData){
        if(Object.values(outputData).length > 0) renderData()
      }
    },[outputData])

  return (
    <View style={styles.container}>
      <View style={styles.layout} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
        <DonutChartComp width={width} height={dimensions.height} isVisible={isVisible} outputData={outputData}/>
      </View>
    </View>
  )
}

export default GraphComp

const styles = StyleSheet.create({
    container:{
        width:width,
        alignItems:"center",
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
      gap:10,
      alignItems:"center",
      borderWidth:1,
      minHeight:200/4,
      width:80,
      borderRadius:5,
      backgroundColor:Colors.primaryBgColor.chillOrange,
      paddingVertical:3,
    },
    elementContainer:{
      flexWrap:"wrap",
      alignItems:"flex-start",
      padding:10,
      gap:5,
      justifyContent:"center",
      height:"100%"
    },
})