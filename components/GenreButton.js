import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const GenreButton = ({ setVisible, subType, disabled }) => {

  const isSelected = subType.length > 0
  
  return (
    <TouchableOpacity disabled={disabled} style={[styles.container, isSelected ? styles.selected : styles.unSelected]} onPress={() => setVisible(true)}>
      {isSelected ? (
        <View style={{justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
          <Text style={styles.label}>Selected: </Text>
          <Text style={[styles.label, {color:Colors.primaryBgColor.black}]}>{subType}</Text>
        </View>
      ): (
        <Text style={[styles.label,{color:Colors.primaryBgColor.prime,fontSize:18}]}>Select a Categorie</Text>
      )}
    </TouchableOpacity>
  )
}

export default GenreButton

const styles = StyleSheet.create({
    container:{
        borderWidth:5,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        width:300,
        height:50,
    },
    label:{
        fontFamily:"MainFont",
        fontSize:15,
        color:Colors.primaryBgColor.prime,
    },
    selected:{
      borderColor:Colors.primaryBgColor.prime,
      backgroundColor:Colors.primaryBgColor.newPrime
    },
    unSelected:{
      backgroundColor:Colors.primaryBgColor.chillOrange,
      borderColor:Colors.primaryBgColor.prime,
    }
})