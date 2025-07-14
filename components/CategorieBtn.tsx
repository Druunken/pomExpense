import { View, Text, StyleSheet } from 'react-native'
import React, { useState} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '@/constants/Colors'
import LottieView from 'lottie-react-native';

interface CategorieProps{
    label:string;
    onPress: () => void;
    focused: boolean
}

const CategorieBtn: React.FC<CategorieProps> = ({label, onPress, focused}) => {

  return (
      <TouchableOpacity style={[styles.btn,{backgroundColor: focused ? Colors.primaryBgColor.black : "transparent" }]} onPress={onPress}>
        <Text style={[styles.label,{color: focused ? Colors.primaryBgColor.chillOrange : "white",fontFamily:focused ? "BoldFont" : "MainFont"}]}>{label}</Text>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    label:{
        color: Colors.primaryBgColor.black,
        fontSize:17,
        fontFamily:"BoldFont",
    },
    
    btn:{
        backgroundColor:Colors.primaryBgColor.white,
        width:90,
        alignItems:"center",
        borderRadius:6,
        height:45,
        justifyContent:"center",
        zIndex:5,
    },
})

export default CategorieBtn