import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '@/constants/Colors'

const RoundCheckBtn = ({ onPress, setShowAdd, fn, cond }) => {


  return (
    <View style={[styles.container,{ opacity: cond ? 0.5 : 1}]} >
        <TouchableOpacity disabled={cond} onPress={() => {
            setShowAdd(false)
            fn()
        }} style={styles.btn} >
            <Icon size={30} color={Colors.primaryBgColor.black} name='check' />
        </TouchableOpacity>
    </View>
  )
}

export default RoundCheckBtn

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.primaryBgColor.prime,
        borderRadius:10,
        width:"100%",
        height:50,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:2,
        borderColor:Colors.primaryBgColor.prime
    },
    btn:{
        borderWidth:2,
        borderRadius:10,
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        borderColor:Colors.primaryBgColor.lightPrime
    },
})