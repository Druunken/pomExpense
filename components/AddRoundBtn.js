import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '@/constants/Colors'

const AddRoundBtn = ({ onPress, setShowAdd }) => {
  return (
    <View style={styles.container} >
        <TouchableOpacity onPress={() => {
            setShowAdd(true)
        }} style={styles.btn} >
            <Icon size={30} color={Colors.primaryBgColor.black} name='add' />
        </TouchableOpacity>
    </View>
  )
}

export default AddRoundBtn

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.primaryBgColor.prime,
        borderRadius:40,
        width:70,
        height:70,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:2,
        borderColor:Colors.primaryBgColor.prime
    },
    btn:{
        borderWidth:2,
        borderRadius:40,
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        borderColor:Colors.primaryBgColor.lightPrime
    },
})