import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const GenreButton = ({ setVisible }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => setVisible(true)}>
      <Text style={styles.label}>Select a Categorie</Text>
    </TouchableOpacity>
  )
}

export default GenreButton

const styles = StyleSheet.create({
    container:{
        borderWidth:5,
        borderRadius:10,
        borderColor:Colors.primaryBgColor.prime,
        justifyContent:"center",
        alignItems:"center",
        width:300,
        height:50,
        backgroundColor:Colors.primaryBgColor.newPrime
    },
    label:{
        fontFamily:"MainFont",
        fontSize:15,
        color:Colors.primaryBgColor.prime
    },
})