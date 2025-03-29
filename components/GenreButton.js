import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import LottieView from 'lottie-react-native'

const GenreButton = ({ setVisible, subType, disabled }) => {

  const passedRef = useRef(null)

  const isSelected = subType.length > 0
  
  useEffect(() => {
    if(subType.length > 0){

    }else {

    }
  },[subType])

  return (
    <TouchableOpacity disabled={disabled} style={[styles.container, isSelected ? styles.selected : styles.unSelected]} onPress={() => setVisible(true)}>
      {isSelected ? (
        <>
          <View style={{justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
            <Text style={styles.label}>Selected: </Text>
            <Text style={[styles.label, {color:Colors.primaryBgColor.black}]}>{subType}</Text>
          </View>
          <View style={styles.markDiv}>
            <LottieView ref={passedRef} loop={false} autoPlay resizeMode='cover' style={{ width: 20, height:20}} source={require("../assets/lottie/passed_mark.json")}/>
          </View>
        </>
      ): (
        <Text style={[styles.label,{color:Colors.primaryBgColor.prime,fontSize:18}]}>Select a Categorie</Text>
      )}
    </TouchableOpacity>
  )
}

export default GenreButton

const styles = StyleSheet.create({
    container:{
        borderWidth:5,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        width:300,
        height:55,
    },
    markDiv:{
      position:"absolute",
      right:0,
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderRadius:10,
      width:50,
  
    },
    label:{
        fontFamily:"MainFont",
        fontSize:15,
        color:Colors.primaryBgColor.newPrimeLight,
    },
    selected:{
      borderColor:Colors.primaryBgColor.black,
      backgroundColor:Colors.primaryBgColor.prime
    },
    unSelected:{
      backgroundColor:Colors.primaryBgColor.chillOrange,
      borderColor:Colors.primaryBgColor.prime,
    }
})