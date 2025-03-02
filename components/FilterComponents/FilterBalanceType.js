import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import SwitchComponent from './SwitchComponent'

const FilterBalanceType = ({ state, setState }) => {
  const titles = ["All","Expense","Income"]
  return (
    <View style={styles.container}>
      <SwitchComponent label={"BalanceType"} width={25} color={Colors.primaryBgColor.gray} steps={2} titles={titles} state={state} setState={setState}/>
    </View>
  )
}

export default FilterBalanceType

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
    }
})