import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const FilterTransactionComp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>FilterTransactionComp</Text>
    </View>
  )
}

export default FilterTransactionComp

const styles = StyleSheet.create({
    container:{
        marginTop:80,
        justifyContent:"center",
        alignItems:"center",
        padding:20
    },
    label:{
        color:Colors.primaryBgColor.prime,
        fontSize:25,
        fontFamily:"MainFont"
    }
})