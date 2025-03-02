import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';



const FormIndicator = ({ pointer, }) => {
  return (
    <View style={[styles.container]}>
        <View style={[styles.viewIndicator,pointer === 1 ? styles.currView : pointer > 1 ? styles.finishedView : styles.notViewed]}/>
        <View style={[styles.viewIndicator,pointer === 2 ? styles.currView : pointer > 2 ? styles.finishedView : styles.notViewed]}/>
        <View style={[styles.viewIndicator,pointer === 3 ? styles.currView : pointer > 3 ? styles.finishedView : styles.notViewed]}/>
        <View style={[styles.viewIndicator,pointer === 4 ? styles.currView : pointer > 4 ? styles.finishedView : styles.notViewed]}/>
        <View style={[styles.viewIndicator,pointer === 5 ? styles.currView : pointer > 5 ? styles.finishedView : styles.notViewed]}/>
        <View style={[styles.viewIndicator,pointer === 6 ? styles.currView : pointer > 6 ? styles.finishedView : styles.notViewed]}/>
        <View style={[styles.viewIndicator,pointer === 7 ? styles.currView : pointer > 7 ? styles.finishedView : styles.notViewed]}/>
    </View>
  )
}

export default FormIndicator

const styles = StyleSheet.create({
    container:{
        height:45,
        borderRadius:13,
        alignItems:"center",
        flexDirection:"row",
        gap:10,
        
    },
    viewIndicator:{
        width:22,
        height:22,
        backgroundColor:Colors.primaryBgColor.gray,
        borderRadius:10
    },
    finishedView:{
        backgroundColor:Colors.primaryBgColor.prime,
    },
    currView:{
        backgroundColor:Colors.primaryBgColor.white,
    },
})