import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { months } from '../constants/Dates.js'

const { width } = Dimensions.get("window")

const GraphComp = ({ outputData, typeDate, setGivenWidth }) => {


    /* 



    */

    useEffect(() => {
      
    },[outputData])
  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <View style={styles.layout}>
        <View>
          {/* <Text style={styles.label}>{typeDate === "month" ? months[outputData?.monthsIncomeDate] : outputData.year}</Text>  */}
        <Text style={styles.label}>Compare Component</Text>
        </View>

        <Text>we need the dates with these properties</Text>
        <Text>balance, expense, income</Text>
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
      alignItems:"center"
    },
})