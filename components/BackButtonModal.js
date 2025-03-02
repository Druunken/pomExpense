import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';


const BackButtonModal = ({ onPress }) => {
  return (
    <View style={[styles.container,]}>
      <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text style={{fontFamily:"MainFont",fontSize:20,color:Colors.primaryBgColor.prime}}>Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BackButtonModal

const styles = StyleSheet.create({
    container:{
    },
    btn:{
        padding:9,
        backgroundColor:Colors.primaryBgColor.black,
        borderRadius:15,
        width:65
    }
})