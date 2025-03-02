import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const minFont = 15;
const maxFont = 30

const HeaderComp = () => {

    const viewX = useSharedValue(0)
    const midX = useSharedValue(0)

    const animatedHeader = useAnimatedStyle(() => {
        return {
            transform: [{translateX:viewX.value}],
        } 
    })

    const animatedText = useAnimatedStyle(() => {
        const fontSize = interpolate(
            viewX.value,
            [0,150],
            [minFont,maxFont],
            
        )
        return {
            fontSize
        }
    })
    const animatedMid = useAnimatedStyle(() => {
        const fontSize = interpolate(
            midX.value,
            [0,150],
            [minFont,maxFont],
            
        )
        return {
            fontSize
        }
    })



    useEffect(() => {
        viewX.value = withTiming(150, {duration:500})
        if(viewX.value > 0){

        }
    },[])


  return (
    <View style={[styles.container,{}]}>
        <Animated.View style={[styles.headerDiv,animatedHeader]}>
            <Animated.Text style={[styles.headerLabel,animatedText,{fontSize:15,color:Colors.primaryBgColor.white}]}>Year</Animated.Text>
            <Animated.Text style={[styles.headerLabel,animatedMid,{color:Colors.primaryBgColor.white,textAlign:"center"}]}>{"Month View"}</Animated.Text>                  
            <Animated.Text style={[animatedText,{fontSize:15,color:Colors.primaryBgColor.white}]}>Day</Animated.Text>
        </Animated.View>
    </View>
  )
}

export default HeaderComp

const styles = StyleSheet.create({
    container:{
        borderWidth:2,
        borderColor:"red",
        borderRadius:10,
        width:"100%"
    },
    headerDiv:{
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:"row",
        paddingHorizontal:20,
    },
        headerLabel:{
        fontFamily:"MainFont",
        fontSize:30
    },

})