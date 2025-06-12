import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { months } from '../constants/Dates.js'

const { width } = Dimensions.get("window")

const CompareGraphComp = ({ outputData, typeDate, setGivenWidth }) => {


    /* 



    */

    useEffect(() => {
      console.log(outputData)
    },[outputData])
  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <View style={styles.layout}>
        <View>
          <Text style={styles.label}>{typeDate === "month" ? months[outputData?.monthsIncomeDate] : outputData.year}</Text> 
        </View>
      </View>
    </View>
  )
}

export default CompareGraphComp

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
      alignItems:"center"
    },
})