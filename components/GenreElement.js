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
    <View>
        <View>
            <Text style={styles.label}>General Types</Text>
            <FlatList numColumns={4} contentContainerStyle={styles.container} key={item => item.id} data={generalTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>

        <View>
            <Text style={styles.label}>Food Types</Text>
            <FlatList numColumns={4} contentContainerStyle={styles.container} key={item => item.id} data={foodTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>

        <View>
            <Text style={styles.label}>Drink Types</Text>
            <FlatList numColumns={4} contentContainerStyle={styles.container} key={item => item.id} data={drinkTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>

        <View>
            <Text style={styles.label}>Sweet Types</Text>
            <FlatList numColumns={4} contentContainerStyle={styles.container} key={item => item.id} data={sweetTypes} keyExtractor={item => item.id} renderItem={({item}) => <Element title={item.name} type={item.type}/>}/>
        </View>
    </View>
  )
}

export default GenreElement

const styles = StyleSheet.create({
    container:{
        width:"100%",
        gap:13,
    },
    label:{
        fontSize:15,
        fontFamily:"MainFont",
        color:"black"
    },
    singleView:{
        height:80,
        width:80,
        borderWidth:1,
        justifyContent:"center",
        borderRadius:10,
        alignItems:"center",
        backgroundColor:Colors.primaryBgColor.newPrime,
        borderColor:Colors.primaryBgColor.prime,
        marginRight:13
    }
})