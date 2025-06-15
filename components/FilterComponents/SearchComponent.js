import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons';
import db from '@/services/serverSide'

const SearchComponent = ({ setPressed, pressed, state, setState, selectedMonth, selectedYear,selectedDay, amountType, balType, setFilteredData, categoryList }) => {
    const inputRef = useRef(null)

    const fetchData = async(txt,month,year) => {
        try {
            if(typeof selectedDay === "string"){
                if(selectedDay.length < 2){
                    selectedDay = undefined
                }
            }
            
            const getData = await db.dynamicQuery(month,year,txt,amountType,balType,categoryList,selectedDay)
            if(getData.length > 0){
                setFilteredData(getData)
            }
            else{
                setFilteredData({})
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handlePress = () => {
        if(inputRef.current && !pressed){
            inputRef.current.focus()
        }else if(inputRef.current && pressed) {
            inputRef.current.blur()
            inputRef.current.clearText
        }
    }

    useEffect(() => {
        if(selectedMonth === "" && selectedYear  === ""){
            fetchData(undefined,undefined,undefined)
        }
        
        else fetchData(undefined,selectedMonth,selectedYear)
        
    },[balType,amountType,categoryList,selectedMonth,selectedYear, selectedDay])
  return (
    <TouchableOpacity onPress={() => {
        setPressed((prev) => !prev)
        setState("")
        handlePress()
    }} style={[styles.container,{
        flex: pressed > 0 ? 1 : 0,
        borderWidth: 0,
        borderColor: pressed > 0 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray,
    }]}>

        <Icon name="search" size={25} color={Colors.primaryBgColor.white}/>
            <TextInput style={styles.input} focus ref={inputRef} value={state} onChangeText={(txt) =>{
                setState(txt)
                fetchData(txt)
            }} onPress={() => {
                setPressed((prev) => !prev)
            }} placeholderTextColor={Colors.primaryBgColor.white} placeholder='' onSubmitEditing={() => setPressed(false)} onBlur={() => {
                setPressed(false)
            }}/>
    </TouchableOpacity>
  )
}

export default SearchComponent

const styles = StyleSheet.create({
    container:{
        width:30,
        height:45,
        flexDirection:"row",
        borderRadius:20,
        borderWidth:2,
        alignItems:"center",
        borderWidth:3,
    },
    title:{
        fontSize:12,
        color:Colors.primaryBgColor.black,
        fontFamily:"MainFont",
    },
    input:{
        fontFamily:"MainFont",
        flex:1,
        borderRadius:20,
        paddingLeft:10,
        height:40,
        color:Colors.primaryBgColor.white,
    }
})