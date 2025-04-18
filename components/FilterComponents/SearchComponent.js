import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '@/constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons';

const SearchComponent = ({ setPressed, pressed, state, setState }) => {
    const inputRef = useRef(null)

    const handlePress = () => {
        if(inputRef.current && !pressed){
            inputRef.current.focus()
        }else if(inputRef.current && pressed) {
            inputRef.current.blur()
            inputRef.current.clearText
        }
    }
  return (
    <TouchableOpacity onPress={() => {
        setPressed((prev) => !prev)
        setState("")
        handlePress()
    }} style={[styles.container,{
        flex: pressed > 0 ? 1 : 0,
        borderWidth: 3,
        borderColor: pressed > 0 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray
    }]}>

        <Icon name="search" size={30} color={"white"}/>
            <TextInput style={styles.input} focus ref={inputRef} value={state} onChangeText={(txt) =>{
                setState(txt)
            }} onPress={() => {
                setPressed((prev) => !prev)
            }} placeholderTextColor={Colors.primaryBgColor.white} placeholder='Search' onSubmitEditing={() => setPressed(false)} onBlur={() => {
                setPressed(false)
            }}/>
        
    </TouchableOpacity>
  )
}

export default SearchComponent

const styles = StyleSheet.create({
    container:{
        width:125,
        height:50,
        flexDirection:"row",
        borderRadius:20,
        borderWidth:2,
        borderColor:Colors.primaryBgColor.prime,
        backgroundColor:Colors.primaryBgColor.gray,
        alignItems:"center",
        paddingHorizontal:5,
        marginTop:20
        
    },
    title:{
        fontSize:12,
        color:Colors.primaryBgColor.white,
        fontFamily:"MainFont",
    },
    input:{
        fontFamily:"MainFont",
        flex:1,
        borderRadius:20,
        paddingLeft:10,
        height:40,
        color:Colors.primaryBgColor.white
    }
})