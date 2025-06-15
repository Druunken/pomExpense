import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { months } from '../constants/Dates.js'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

const { width } = Dimensions.get("window")

const GraphComp = ({ outputData, typeDate, setGivenWidth }) => {


    /* 



    */

    const [renderItems,setRenderItems] = useState([])

    const renderData = () =>{
      let elements = []
      let index = 0
      for(const [key,value] of Object.entries(outputData)){
        elements.push(
          <View style={styles.elementDiv} key={index}>
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
      console.log(outputData)
      if(outputData){
        if(Object.values(outputData).length > 0) renderData()
      }
    },[outputData])
  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <View style={styles.layout}>
        <View style={styles.elementContainer}>
        {renderItems}
        </View>

        
        {/* Stats of the Month comp here */}
      </View>
    </View>
  )
}

export default GraphComp

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
      borderWidth:2,
      borderRadius:6,
      width:width - 50,
      height:200,
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