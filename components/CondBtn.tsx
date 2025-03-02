import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'


const CondBtn = ({ label, type, onPress, cond, style }) => {
  
  return (
    <TouchableOpacity disabled={cond} style={[styles.container,style, type === "confirm" ? styles.confirm : styles.decline, {
      opacity: cond ? 0.5 : 1
    }]} onPress={onPress}>
      <Text style={[styles.label, type === "confirm" ? styles.labelConfirm : styles.labelDecline]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container:{
        width:120,
        height:50,
        borderWidth:3,
        borderColor:Colors.primaryBgColor.lightPrime,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10
    },
    label:{

    },
    confirm:{
        backgroundColor: Colors.primaryBgColor.prime
    },
    decline:{
        backgroundColor: Colors.primaryBgColor.persianRed,
        borderColor:Colors.primaryBgColor.brown,
    },
    labelConfirm:{
        fontFamily:"MainFont",
        fontSize:20,
        color:"white"
    },
    labelDecline:{
        fontFamily:"MainFont",
        fontSize:20,
    },
})

export default CondBtn