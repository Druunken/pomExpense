import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { months } from '../constants/Dates.js'

const { width } = Dimensions.get("window")

const CompareComp = ({ outputData, typeDate, setGivenWidth }) => {


    /* 



    */

    const [renderItems,setRenderItems] = useState([])

    const renderData = () => {
      if(Object.keys(outputData).length > 0){
        let elements = []
        let index = 0
        for(const [key,value] of Object.entries(outputData)){
          elements.push(
            <View style={styles.elementDiv} key={index}>
              <Text>{key}</Text>
              <Text>{value.amount}</Text>
            </View>
          )
          index++
        }
        setRenderItems(elements)
      }
    }

    useEffect(() => {
      console.log(outputData,"ALLOO")
      renderData()
    },[outputData])
  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <View style={styles.layout}>
        <ScrollView contentContainerStyle={styles.elementContainer} horizontal>
          {renderItems}
        </ScrollView>
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
      borderWidth:2,
      borderRadius:6,
      width:width - 50,
      height:200,
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