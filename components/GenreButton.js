import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import LottieView from 'lottie-react-native'

import { food, drink, education, shopping, grocerie } from '../constants/GenreTypes.js'

const GenreButton = ({ setVisible, subType, disabled, setState, title, submitted, setSubmitted }) => {

  const passedRef = useRef(null)

  const isSelected = subType.length > 0

  const triggerMatch = (title) => {
    let validString = title.toLowerCase()
    setSubmitted(false)
    if(food.includes(validString)) setState("food")
    else if(drink.includes(validString)) setState("drink")
    else if(shopping.includes(validString)) setState("shopping")
    else if(grocerie.includes(validString)) setState("grocerie")
    else if(education.includes(validString)) setState("education")
    else return setState("")
  }
  
  
  useEffect(() => {
    console.log(drink.includes(title))
    if(title !== undefined && title.length !== 0) triggerMatch(title)
  },[title])

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