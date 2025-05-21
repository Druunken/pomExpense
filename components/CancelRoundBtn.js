import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '@/constants/Colors'

const CancelRoundBtn = ({ onPress, setShowAdd }) => {
  return (
    <View style={styles.container} >
        <TouchableOpacity onPress={() => {
            setShowAdd(false)
        }} style={styles.btn} >
            <Icon size={30} color={Colors.primaryBgColor.black} name='close' />
        </TouchableOpacity>
    </View>
  )
}

export default CancelRoundBtn

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.primaryBgColor.persianRed,
        borderRadius:10,
        width:"100%",
        height:50,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:2,
        borderColor:Colors.primaryBgColor.persianRed
    },
    btn:{
        borderWidth:2,
        borderRadius:10,
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        borderColor:Colors.primaryBgColor.brown
    },
})