import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming }  from 'react-native-reanimated'

const TitleInput = ({ state, setState, setIsOnFocus}) => {
  const inputRef = useRef(null)

  const [validInput,setValidInput] = useState(false)
  
  const backgroundVal = useSharedValue(0)

  const handlePress = () => {
    if(inputRef.current){
      setIsOnFocus(true)
    }
  }

  const onPressDone = () => {
    if(state.length > 0){
      setValidInput(true)
      backgroundVal.value = withTiming(1, {duration:250})
    }else{
      setValidInput(false)
      backgroundVal.value = withTiming(0, {duration:250})
    }
  }


  /* animated */

  const animatedView = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundVal.value,
        [0,1],
        [Colors.primaryBgColor.white,Colors.primaryBgColor.prime]
      )
    }
  })

  useEffect(() => {
    onPressDone()
  }, [])
  
  return (
    <Animated.View style={[styles.container, animatedView, {
      borderColor:Colors.primaryBgColor.darkPurple,
      borderWidth:3
    }]}>
      <TextInput onBlur={() => {
        onPressDone()
      }} onSubmitEditing={() => {
        onPressDone()
        if(setIsOnFocus){
          setIsOnFocus(false)
        }
      }} ref={inputRef} onPress={() => {
        setValidInput(false)
        backgroundVal.value = withTiming(0, {duration:500})
        if(setIsOnFocus){
          handlePress()
        }
      }} autoFocus={false} clearTextOnFocus style={[styles.titleInput, {
        color: validInput ? Colors.primaryBgColor.white : Colors.primaryBgColor.black
      }]} placeholder='...' value={state} onChangeText={(txt) =>{
        setState(txt)
      }}></TextInput>
      {validInput && (
        <View style={styles.markDiv}>
          <Text style={styles.label}>check</Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    container:{
      backgroundColor:"white",
      borderRadius:10
    },
    titleInput:{
        width:300,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        fontFamily:"MainFont",
        borderRadius:10,
        fontSize:20,
        color:"black"
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
      color:"white",
      fontSize:12,
      fontFamily:"MainFont"
    }
})

export default TitleInput