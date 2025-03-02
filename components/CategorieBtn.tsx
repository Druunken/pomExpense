import { View, Text, StyleSheet } from 'react-native'
import React, { useState} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '@/constants/Colors'

interface CategorieProps{
    label:string;
    onPress: () => void;
    focused: boolean
}

const CategorieBtn: React.FC<CategorieProps> = ({label, onPress, focused}) => {

  return (
      <TouchableOpacity style={[styles.btn,{backgroundColor: focused ? Colors.primaryBgColor.prime : Colors.primaryBgColor.white }]} onPress={onPress}>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    label:{
        color: Colors.primaryBgColor.black,
        fontSize:17,
        fontFamily:"MainFont"
    },
    btn:{
        backgroundColor:Colors.primaryBgColor.white,
        width:110,
        alignItems:"center",
        borderRadius:10,
        height:40,
        justifyContent:"center",
        paddingHorizontal:5
    }
})

export default CategorieBtn