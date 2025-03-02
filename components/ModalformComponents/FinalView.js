import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native'

const MAIN_FONT_SIZE = 30
const SECOND_FONT_SIZE = 15


const FinalView = ({ label, item, currency, secondItem, minusValue, prevForm, pointer, bgColor, frColor, onPress }) => {

    const prevTextY = useSharedValue(0)
    const currTextX = useSharedValue(1)
    const currTextY = useSharedValue(1)

    const prevTextOpactiy = useSharedValue(1)
    const currTextOpacity = useSharedValue(0)

    const animatedPrevStyles = useAnimatedStyle(() => {
        const left = interpolate(
            currTextX.value,
            [0,currTextOpacity.value],
            [100,0],
        )
       return{
        opacity: currTextOpacity.value,
        left
       }
    })

    const animatedTopStyles = useAnimatedStyle(() => {
        const top = interpolate(
            currTextY.value,
            [0,1],
            [0,currTextY.value],
        )
        return{
            transform: [{ translateY: top}]
        }
    })

    useEffect(() => {
        currTextOpacity.value = withTiming(1, {duration:150})  
    },[])
  return (
    <TouchableOpacity style={[styles.container,{backgroundColor:bgColor}]} onPress={onPress} >
        <View style={[styles.header,{backgroundColor:frColor}]}>
            <View style={{position:"absolute",top:0,left:20}}>
                <Animated.Text style={[animatedTopStyles,{fontSize:17,color:Colors.primaryBgColor.babyBlue,fontFamily:"MainFont"}]}>{prevForm}</Animated.Text>
            </View>
            <View style={{flexDirection:"row"}}>
                <Animated.Text style={[animatedPrevStyles,animatedTopStyles,{fontSize:24,color:"white",fontFamily:"MainFont"}]}>{label}</Animated.Text>
                <Text style={styles.secondItem}>{secondItem ? secondItem : null}</Text>
            </View>
            <View style={{flexDirection:"row",gap:10,justifyContent:"center",alignItems:"center"}}>
                <Text style={[styles.item,{color:minusValue ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.lightGray}]}>{item}</Text>
                <Text style={[styles.item,{color:Colors.primaryBgColor.white,fontSize:24}]}>{currency ? currency : null}</Text>
            </View>
            {/* <View style={{width:80,height:10,backgroundColor:"gray",borderRadius:10,position:"absolute",bottom:5,left:150}}/> */}
        </View>
    </TouchableOpacity>
  )
}

export default FinalView

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.primaryBgColor.prime,
        
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%",
        backgroundColor:Colors.primaryBgColor.prime,
        paddingHorizontal:20,
        height:75,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    item:{
        fontSize:MAIN_FONT_SIZE,
        color:Colors.primaryBgColor.black,
        fontFamily:"MainFont",
        textAlign:"center"
    },
    secondItem:{
        fontSize:SECOND_FONT_SIZE,
        color:Colors.primaryBgColor.babyBlue,
        fontFamily:"MainFont",
        padding:5,
        
    }
})