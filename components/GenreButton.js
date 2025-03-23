import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const GenreButton = ({ setVisible, cate }) => {

  const isSelected = cate.length > 0
  
  return (
    <TouchableOpacity style={[styles.container, isSelected ? styles.selected : styles.unSelected]} onPress={() => setVisible(true)}>
      <Text style={styles.label}>{isSelected ? `Selected: ${cate}` : "Select Categorie"}</Text>
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
        color:Colors.primaryBgColor.prime
    },
    selected:{
      borderColor:Colors.primaryBgColor.prime,
      backgroundColor:Colors.primaryBgColor.newPrime
    },
    unSelected:{
      backgroundColor:Colors.primaryBgColor.chillOrange,
      borderColor:Colors.primaryBgColor.newPrimeLight,
    }
})