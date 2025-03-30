import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import LottieView from 'lottie-react-native'
import Animated , { useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { food, drink, education, shopping, grocerie } from '../constants/GenreTypes.js'
import { interpolateColor, useSharedValue } from 'react-native-reanimated'

const GenreButton = ({ setVisible, subType, disabled, setState, title, setCate }) => {

  const passedRef = useRef(null)
  const foodRef = useRef(null)
  const drinkRef = useRef(null)
  const shoppingRef = useRef(null)
  const educationRef = useRef(null)
  const grocerieRef = useRef(null)

  const [validState,setValidState] = useState(false)

  const isSelected = subType.length > 0


  /* ANIMATED */

  const bgVal = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return{
      backgroundColor: interpolateColor(
        bgVal.value,
        [0,1],
        [Colors.primaryBgColor.babyBlue, Colors.primaryBgColor.lightPrime]
      )
    }
  })

  const triggerMatch = (title) => {
    let validString = title.toLowerCase()
    if(food.includes(validString)){
      foodRef.current?.reset()
      foodRef.current?.play()
      setState("food")
      setCate("food")
      setValidState(true)
    }
    else if(drink.includes(validString)){
      drinkRef.current?.reset()
      drinkRef.current?.play()
      setState("drink")
      setCate("drink")
      setValidState(true)
    }
    else if(shopping.includes(validString)){
      setState("shopping")
      setCate("shopping")
      setValidState(true)
    }
    else if(grocerie.includes(validString)){
      setCate("grocerie")
      setState("grocerie")
      setValidState(true)
    }
    else if(education.includes(validString)){
      setCate("education")
      setState("education")
      setValidState(true)
    }
    else  {
      console.log("here")
      setState("")
      setCate("")
      return setValidState(false)
    }
  }
  
  
  useEffect(() => {
    if(title !== undefined && title.length !== 0) triggerMatch(title)
  },[title])

  useEffect(() => {
    if(validState){
      bgVal.value = withTiming(1, { duration: 500 })
    }else if(!validState){
      bgVal.value = withTiming(0, { duration: 500 })
    }
  },[validState])

  return (
    <TouchableOpacity disabled={disabled}  onPress={() => setVisible(true)}>
      <Animated.View style={[styles.container, isSelected ? styles.selected : styles.unSelected, animatedStyle]}>
      {isSelected ? (
        <>
          <View style={{justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
            <Text style={styles.label}>Selected: </Text>
            <Text style={[styles.label, {color:Colors.primaryBgColor.black}]}>{subType}</Text>
          </View>
          <View style={styles.markDiv}>
            <LottieView colorFilters={[
              {
                keypath: "*",
                color: Colors.primaryBgColor.prime
              }
            ]} ref={passedRef} loop={false} autoPlay resizeMode='cover' style={{ width: 20, height:20}} source={require("../assets/lottie/passed_mark.json")}/>
          </View>
        </>
      ): (
        <Text style={[styles.label,{color:Colors.primaryBgColor.dark,fontSize:18}]}>Select a Categorie</Text>
      )}
      {validState && isSelected && (
        <View style={styles.leftView}>
        {subType === "food" ? (
          <LottieView ref={foodRef} style={styles.lottieStyle} loop={false} resizeMode='contain' source={require(`../assets/lottie/food_lottie.json`)}/>
        ): subType === "drink" ?(
          <LottieView ref={drinkRef} style={styles.lottieStyle} loop={false} resizeMode='contain' source={require(`../assets/lottie/drink_lottie.json`)}/>
        ): subType === "education" ? (
          <LottieView ref={educationRef} style={styles.lottieStyle} loop={false} resizeMode='contain' source={require(`../assets/lottie/education_lottie.json`)}/>
        ): subType === "shopping" ?  (
          <LottieView ref={shoppingRef} style={styles.lottieStyle} loop={false} resizeMode='contain' source={require(`../assets/lottie/shopping_bag_lottie.json`)}/>
        ): subType === "grocerie" ? (
          <LottieView ref={grocerieRef} style={[styles.lottieStyle, { width:45,height:45 }]} loop={false} resizeMode='contain' source={require(`../assets/lottie/groceries_lottie.json`)}/>
        ): <></>}
        </View>
      )}
      </Animated.View>
    </TouchableOpacity>
  )
}

export default GenreButton

const styles = StyleSheet.create({
    container:{
        borderWidth:3,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        width:300,
        height:55,
        borderColor:Colors.primaryBgColor.darkPurple
    },
    leftView:{
      position:"absolute",
      left:0,
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderRadius:10,
      width:40,
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
        color:Colors.primaryBgColor.dark,
    },
    selected:{
      borderColor:Colors.primaryBgColor.dark,
      backgroundColor:Colors.primaryBgColor.lightPrime
    },
    unSelected:{
      backgroundColor:Colors.primaryBgColor.babyBlue,
      borderColor:Colors.primaryBgColor.darkPurple,
    },
    lottieStyle:{
      width:35,
      height:35,
    }
})