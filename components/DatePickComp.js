import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

const DatePickComp = ({ month, year, day, data, setState }) => {


    const [scrollEnabled,setScrollEnabled] = useState(false)
    const [openPressed,setOpenPressed] = useState(false)
    
    const dateContainerHeight = useSharedValue(30)

    const placeHolderTxt = month ? "Select Month" : year ? "Select Year" : day ? "Select Day" : ""

    const btnOp = useSharedValue(1)
    const btnINd = useSharedValue(1)

    const closeOp = useSharedValue(0)
    const closeInd = useSharedValue(-3)

    const [datePick,setDatePick] = useState(placeHolderTxt)

    const containerBg = useSharedValue(0)

    const animatedCloseCirc = useAnimatedStyle(() => {
        return {
            opacity:closeOp.value,
            zIndex: closeInd.value
        }
    })

    const animatedDateContainer = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            containerBg.value,
            [0,0.5,1],
            [Colors.primaryBgColor.lightGray,Colors.primaryBgColor.black,Colors.primaryBgColor.prime]
        )
        return{
            height: dateContainerHeight.value,
            backgroundColor:backgroundColor
        }
    })

    const animatedBtn = useAnimatedStyle(() => {
        return{
            opacity: btnOp.value,
            zIndex: btnINd.value,
        }
    })

    const pressHandler = (datePick,datePickString) => {
        if(!openPressed){
            setScrollEnabled(true)
            dateContainerHeight.value = withSpring(150)
            btnOp.value = withTiming(0,{ duration: 500 })
            containerBg.value = withTiming(0.5,{duration: 500})
            setTimeout(() => {
                closeInd.value = -3
            }, 250);
            closeInd.value = 3
            closeOp.value = withTiming(1,{ duration:350})
            setOpenPressed(true)
        }else if(openPressed){
            setState(datePick)
            
            if(datePickString){
                setDatePick(datePickString)
            }else{
                setDatePick(datePick)
            }
            setScrollEnabled(false)
            btnINd.value = 1
            containerBg.value = withTiming(1,{ duration: 250 })
            btnOp.value = withTiming(1,{ duration: 250 })
            dateContainerHeight.value = withSpring(30, { damping:16})
            setTimeout(() => {
                closeInd.value = -3
            }, 250);
            closeOp.value = withTiming(0,{ duration:250 })
            setOpenPressed(false)
        }
    }

    const onClose = () => {
        setScrollEnabled(false)
        setDatePick(placeHolderTxt)
        setState("")
        btnINd.value = 1
        containerBg.value = withTiming(0,{ duration: 250 })
        btnOp.value = withTiming(1,{ duration: 250 })
        dateContainerHeight.value = withSpring(30, { damping:16})
        closeOp.value = withTiming(0,{ duration:250 })
        setTimeout(() => {
            closeInd.value = -3
        }, 250);
        setOpenPressed(false)
    }

    const renderItems = () => {
        let elements = []
        if(month) {
            for(const [key,value] of Object.entries(data)){
                elements.push(
                    <TouchableOpacity onPress={() => pressHandler(key,value)} style={styles.dateDiv} key={key}>
                        <Text style={[styles.dateLabel,{fontSize:9}]}>{value}</Text>
                    </TouchableOpacity>
                )
            }
            return elements
        }
        for(let i = 0; i < data.length; i++){
            elements.push(
                <TouchableOpacity onPress={() => pressHandler(data[i])} style={styles.dateDiv} key={i}>
                    <Text style={styles.dateLabel}>{data[i]}</Text>
                </TouchableOpacity>
            )
        }

        return elements
    }

    useEffect(() => { renderItems() },[data])

  return (
    <View style={[styles.cotainer]}>
        <View style={{justifyContent:"center",alignItems:"center",width:"100%"}}>
            <Text style={styles.label}>{placeHolderTxt}</Text>
        </View>

      <Animated.View style={[animatedDateContainer,styles.dateContainer]} scrollEnabled={false}>

        <Animated.View style={animatedBtn}>
            <TouchableOpacity style={styles.openBtn} onPress={pressHandler} activeOpacity={1}>
                <Text style={styles.placeholderLabel}>{datePick}</Text>
            </TouchableOpacity>
        </Animated.View>

        <ScrollView contentContainerStyle={[styles.scrollDiv,{opacity:!openPressed ? 0 : 1}]} showsHorizontalScrollIndicator={false} >
            {renderItems()}
        </ScrollView>

      </Animated.View>
        <Animated.View style={animatedCloseCirc}>
            <TouchableOpacity onPress={onClose} >
                <Ionicons name='close-circle-outline' size={45}/>
            </TouchableOpacity>
        </Animated.View>
    </View>
  )
}

export default DatePickComp

const styles = StyleSheet.create({
    cotainer:{
        marginTop:5,
        alignItems:"center",
        minHeight:200,
    },
    scrollDiv:{
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal:15
    },
    dateDiv:{
        width:"100%",
        height:30,
        justifyContent:"center",
        alignItems:"center"
    },
    openBtn:{
        width:"100%",
        position:"absolute",
        top:"0"
    },
    label:{
        fontSize:15,
        color:Colors.primaryBgColor.gray,
        fontFamily:"MainFont",
    },
    dateLabel:{
        fontSize:15,
        color:Colors.primaryBgColor.lightGray,
        fontFamily:"MainFont"
    },
    dateContainer:{
        borderWidth:3,
        width:90,
        borderRadius:10,
        paddingTop:6,
        borderColor:Colors.primaryBgColor.lightGray
    },
    placeholderLabel:{
        fontFamily:"MainFont",
        fontSize:10,
        color:Colors.primaryBgColor.black,
        textAlign:"center"
    }
})