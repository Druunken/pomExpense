import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';


const ForwardBtnModal = ({ onPress }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text style={{fontFamily:"MainFont",fontSize:20,color:Colors.primaryBgColor.white}}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ForwardBtnModal

const styles = StyleSheet.create({
    container:{
    },
    btn:{
        padding:9,
        backgroundColor:Colors.primaryBgColor.prime,
        borderRadius:15,
        width:65
    }
})