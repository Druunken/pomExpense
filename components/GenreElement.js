import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'

import { generalTypes, foodTypes, drinkTypes, sweetTypes } from '../constants/GenreTypes.js'
import { Colors } from '@/constants/Colors.ts'



const GenreElement = ({ setVisible, setCate, setSubType }) => {

    const Element = ({ title, type }) => (
        <TouchableOpacity style={styles.singleView} onPress={() => {
            setVisible(false)
            setCate(type)
            setSubType(title)
        }}>
            <Text style={styles.label}>{title}</Text>
        </TouchableOpacity>
    )


  return (
    <View style={{gap:20}}>
        <View>
            <Text style={styles.mainLabel}>Recent Types</Text>
            <Text>Null</Text>
        </View>
        <View>
            <Text style={styles.mainLabel}>General Types</Text>
            <FlatList horizontal contentContainerStyle={styles.container} key={item => item.id} data={generalTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>

        <View>
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
        </View>
    </View>
  )
}

export default GenreElement

const styles = StyleSheet.create({
    container:{
        width:"100%",
        gap:5,
        borderRadius:10
    },
    label:{
        fontSize:12,
        fontFamily:"MainFont",
        color: Colors.primaryBgColor.prime
    },
    mainLabel:{
        fontSize:15,
        fontFamily:"MainFont",
        color: Colors.primaryBgColor.black
    },
    singleView:{
        height:80,
        width:80,
        borderWidth:3,
        justifyContent:"center",
        borderRadius:10,
        alignItems:"center",
        backgroundColor:Colors.primaryBgColor.newPrime,
        borderColor:Colors.primaryBgColor.prime,
    }
})