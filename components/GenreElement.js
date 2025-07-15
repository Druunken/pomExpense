import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { generalTypes, foodTypes, drinkTypes, sweetTypes, fixedCostTypes } from '../constants/GenreTypes.js'
import { Colors } from '@/constants/Colors.ts'
import LottieView from 'lottie-react-native'



const GenreElement = ({ setVisible, setCate, setSubType, vertical = false, importType="general" }) => {


    /*  refs neeed to be created for every instance of lottie View */
    const foodRef = useRef(null)
    const drinkRef = useRef(null)
    const grocerieRef = useRef(null)
    const educationRef = useRef(null)
    const shoppingRef = useRef(null)
    const settingsRef = useRef(null)

    const [pressedList,setPressedList] = useState([

    ])

    const getLottie = (type) => {
        let validType = type.toLowerCase()
        if(validType === "food"){
            return require("../assets/lottie/food_lottie.json")
        }
        else if(validType === "drink"){
            return require("../assets/lottie/drink_lottie.json")
        }
        else if(validType === "grocerie"){
            return require("../assets/lottie/groceries_lottie.json")
        }
        else if(validType === "education"){
            return require("../assets/lottie/education_lottie.json")
        }
        else if(validType === "shopping"){
            return require("../assets/lottie/shopping_bag_lottie.json")
        }
        else{
            return require("../assets/lottie/settings_lottie.json")
        }
    }

    const getRef = (type) => {
        if(type === "food"){
            if(foodRef.current){
                console.log("")
                foodRef.current?.reset()
                setTimeout(() => {
                    foodRef.current?.play()
                }, 5);
            }
        }else if(type === "drink"){
            if(drinkRef.current){
                drinkRef.current?.reset()
                setTimeout(() => {
                    drinkRef.current?.play()
                }, 5);
            }
        }else if(type === "grocerie"){
            if(grocerieRef.current){
                grocerieRef.current?.reset()
                setTimeout(() => {
                    grocerieRef.current?.play()
                }, 5);
            }
        }else if(type === "education"){
            if(educationRef.current){
                educationRef.current?.reset()
                setTimeout(() => {
                    educationRef.current?.play()
                }, 5);
            }
        }else if(type === "shopping"){
            if(shoppingRef.current){
                shoppingRef.current?.reset()
                setTimeout(() => {
                    shoppingRef.current?.play()
                }, 5);
            }
        }else if(type === "settings"){
            if(settingsRef.current){
                settingsRef.current?.reset()
                setTimeout(() => {
                    settingsRef.current?.play()
                }, 5);
            }
        }
    }

    const selectedBg = Colors.primaryBgColor.chillOrange
    const Element = ({ title, type }) => (
        
        <TouchableOpacity style={[styles.singleView,{
            backgroundColor: 
            pressedList[0] === type ? selectedBg : 
            Colors.primaryBgColor.white,
            borderWidth: pressedList[0] === type ? 5 : 
            3,
            borderColor: pressedList[0] === type ? Colors.primaryBgColor.brown:
            Colors.primaryBgColor.dark,
            width: vertical ? "100%" : 80
        }]} 
        onPress={(ev) => {
            setPressedList([type])
            getRef(type)
            setCate(type)
            setSubType(title)
            /* setTimeout(() => {
                setVisible(false)
            }, 1500); */
        }}>
            <LottieView ref={
                type === "food" ? foodRef :
                type === "drink" ? drinkRef :
                type === "grocerie" ? grocerieRef :
                type == "education" ? educationRef : 
                type === "shopping" ? shoppingRef :
                settingsRef

            } loop={false} autoPlay={false} style={styles.lottieStyle} source={getLottie(type)}/>
            <Text style={styles.label}>{title}</Text>
        </TouchableOpacity>
    )

    /* useEffect(() => {
        if(setCate !== "" && foodRef.current){
            foodRef.current?.reset()
            setTimeout(() => {
                foodRef.current?.play()
            }, 0);
        }
    }, [setCate]) */


  return (
    <View style={{gap:20}}>
        {/* <View>
            <Text style={styles.mainLabel}>Recent Types</Text>
            <Text style={styles.noLabel}>Available soon</Text>
        </View> */}
        
        <View style={{}}>
            {/* <Text style={styles.mainLabel}>General Types</Text> */}
            <FlatList numColumns={vertical ? 1 : 3} contentContainerStyle={styles.container} key={item => item.id} data={importType === "fixed cost" ? fixedCostTypes : importType === "general" ? generalTypes : []} keyExtractor={item => item.id} renderItem={({item}) => <Element  title={item.name} type={item.type}/>}/>
        </View>

        {/* <View>
            <Text style={styles.mainLabel}>Food Types</Text>
            <FlatList horizontal contentContainerStyle={styles.container} key={item => item.id} data={foodTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>

        <View>
            <Text style={styles.mainLabel}>Drink Types</Text>
            <FlatList horizontal contentContainerStyle={styles.container} key={item => item.id} data={drinkTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>

        <View>
            <Text style={styles.mainLabel}>Sweet Types</Text>
            <FlatList horizontal contentContainerStyle={styles.container} key={item => item.id} data={sweetTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View> */}
    </View>
  )
}

export default GenreElement

const styles = StyleSheet.create({
    container:{
        width:"100%",
        gap:10,
        borderRadius:10,
        justifyContent:"center",
        paddingLeft:10,
    },
    label:{
        fontSize:13,
        fontFamily:"MainFont",
        color: Colors.primaryBgColor.prime
    },
    mainLabel:{
        fontSize:15,
        fontFamily:"MainFont",
        color: Colors.primaryBgColor.white,
    },
    singleView:{
        height:80,
        width:100,
        justifyContent:"center",
        borderRadius:5,
        alignItems:"center",
        backgroundColor:Colors.primaryBgColor.white,
        borderColor:Colors.primaryBgColor.dark,
        marginRight:20,
        borderWidth:2,

    },
    noLabel:{
        fontSize:14,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.persianRed,
    },
    lottieStyle:{
        width:45,
        height:45,
    }
})