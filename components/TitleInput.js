import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '@/constants/Colors'

const TitleInput = ({ state, setState, setIsOnFocus}) => {
  const inputRef = useRef(null)

  const handlePress = () => {
    if(inputRef.current){
      setIsOnFocus(true)
    }
  }
  
  return (
    <View>
      <TextInput onSubmitEditing={() => {
        if(setIsOnFocus){
          setIsOnFocus(false)
        }
      }} ref={inputRef} onPress={() => {
        if(setIsOnFocus){
          handlePress()
        }
      }} autoFocus={false} clearTextOnFocus style={styles.titleInput} placeholder='...' value={state} onChangeText={(txt) =>{
        setState(txt)
      }}></TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
    titleInput:{
        borderWidth:1,
        width:250,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        fontFamily:"MainFont",
        borderRadius:10,
        fontSize:20,
        backgroundColor:"white",
        color:"black"

    },
})

export default TitleInput