import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'

import { generalTypes, foodTypes, drinkTypes, sweetTypes } from '../constants/GenreTypes.js'
import { Colors } from '@/constants/Colors.ts'
import LottieView from 'lottie-react-native'



const GenreElement = ({ setVisible, setCate, setSubType }) => {


    /*  refs neeed to be created for every instance of lottie View */
    const lottieRef = useRef(null)

    const getLottie = (type) => {
        let validType = type.toLowerCase()
        if(validType === "food") return require("../assets/lottie/food_lottie.json")
        else if(validType === "drink") return require("../assets/lottie/drink_lottie.json")
        else if(validType === "grocerie") return require("../assets/lottie/groceries_lottie.json")
        else if(validType === "education") return require("../assets/lottie/education_lottie.json")
        else if(validType === "shopping") return require("../assets/lottie/shopping_bag_lottie.json")
        else return require("../assets/lottie/settings_lottie.json")
    }

    const Element = ({ title, type }) => (
        <TouchableOpacity style={styles.singleView} onPress={() => {
            lottieRef.current?.reset()
            lottieRef.current?.play()
            setCate(type)
            setSubType(title)
            setTimeout(() => {
                setVisible(false)
            }, 1500);
        }}>
            <LottieView ref={lottieRef} loop={false} autoPlay={false} style={styles.lottieStyle} source={getLottie(type)}/>
            <Text style={styles.label}>{title}</Text>
        </TouchableOpacity>
    )


  return (
    <View style={{gap:20}}>
        <View>
            <Text style={styles.mainLabel}>Recent Types</Text>
            <Text style={styles.noLabel}>Available soon</Text>
        </View>
        <View style={{}}>
            <Text style={styles.mainLabel}>General Types</Text>
            <FlatList contentContainerStyle={styles.container} key={item => item.id} data={generalTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
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
        gap:5,
        borderRadius:10,
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"center",
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
        height:120,
        width:150,
        borderWidth:3,
        justifyContent:"center",
        borderRadius:8,
        alignItems:"center",
        backgroundColor:Colors.primaryBgColor.newPrime,
        borderColor:Colors.primaryBgColor.dark,
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