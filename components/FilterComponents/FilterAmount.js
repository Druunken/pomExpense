import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import SwitchComponent from '@/components/FilterComponents/SwitchComponent'

const FilterAmount = ({ state, setState}) => {
  const titles = ["All","MAX","MIN"]
  return (
    <View style={styles.container}>
      <SwitchComponent state={state} setState={setState} label={"FilterAmount"} width={25} color={Colors.primaryBgColor.gray} steps={2} titles={titles} />
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