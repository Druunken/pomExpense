import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import SwitchComponent from '@/components/FilterComponents/SwitchComponent'

const FilterAmount = ({ state, setState}) => {
  const titles = ["Inc/Exp","Highest Expense","Highest Income"]
  return (
    <View style={styles.container}>
      <SwitchComponent state={state} setState={setState} label={"FilterAmount"} width={25} color={Colors.primaryBgColor.prime} steps={2} titles={titles} 
      bgColor1={Colors.primaryBgColor.gray} bgColor2={Colors.primaryBgColor.persianRed} bgColor3={Colors.primaryBgColor.prime}
      />
    </View>
  )
}

export default FilterAmount

const styles = StyleSheet.create({
    container:{
        width:100,
        height:50,
        borderRadius:20,
        justifyContent:"center",
    },
    title:{
        fontSize:12,
        color:Colors.primaryBgColor.white,
        fontFamily:"MainFont"
    },

})