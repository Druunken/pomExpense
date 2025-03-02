import { StyleSheet, Text, View, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BacktoFinal = ({ setPointer }) => {
    const inset = useSafeAreaInsets()
    const [isKeyboardVisible,setIsKeyboardVisible] = useState(false)

    useEffect(() => {
        const hideElement = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true))
        const showElement = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false))
    },[])
  return (
    <View style={[styles.container, {opacity: isKeyboardVisible ? 0 : 1}]}>
        <TouchableOpacity style={styles.btn} onPress={() => setPointer(7)}>
            <Text style={styles.label}>Back to Overview</Text>
        </TouchableOpacity>
    </View>
  )
}

export default BacktoFinal

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        zIndex:100
    },
    label:{
        fontSize:20,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.prime
    },
    btn:{
        width:200,
        height:50,
        backgroundColor: Colors.primaryBgColor.babyBlue,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",

    },
})