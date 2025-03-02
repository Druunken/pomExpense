import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const AddTransactionBtn = ({setVisibleModal}) => {
  return (
    <View style={styles.container}>
        <View style={{borderWidth:3,borderColor:Colors.primaryBgColor.white,borderRadius:12}}>
        <TouchableOpacity
            style={[styles.btn]}
            activeOpacity={0.7}
            onPress={() => {
            setVisibleModal(true) 
            }}
        >
            <Text
            style={{
                color: Colors.primaryBgColor.white,
                fontFamily: "MainFont",
                fontSize: 17,
            }}
            >
            Add Transaction
            </Text>
        </TouchableOpacity>
        </View>              
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        marginBottom:15
    },
    btn:{
        borderRadius:10,
        alignItems:"center",
        height:50,
        justifyContent:"center",
        backgroundColor: Colors.primaryBgColor.prime,
        width: 250,
        borderWidth:1,
        borderColor:Colors.primaryBgColor.black
    },
    label:{

    },
})

export default AddTransactionBtn