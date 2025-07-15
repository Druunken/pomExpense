import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated ,{ useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import SavingGoalViewComponent from '../components/SavingGoalViewComponent.js'
import OverviewTitleComponent from '../components/OverviewTitleComponent.js'
import FixedcostsOverviewComponent from '../components/FixedcostsOverviewComponent'

const OverviewComponent = ({ visibleOverview, setVisibleOverview}) => {
    const dimensions = Dimensions.get("window")
    const insets = useSafeAreaInsets()

    const scaledHeightOn = dimensions.height - insets.bottom - insets.top - 80
    const scaledHeightOff = 180

    const opacityContainer = useSharedValue(0)
    const indexContainer = useSharedValue(-1)

    const [savingVisible,setSavingVisible] = useState(false)
    const [overViewLabel,setOverViewLabel] = useState("Saving Goal")
    const [fixedCostsVisible,setFixedCostsVisible] = useState(false)
    const [fixedCostsActive,setFixedCostsActive] = useState(true)

    const [statusCount,setStatusCount] = useState(0)

    const height = useSharedValue(scaledHeightOn)

    const lottieX = useSharedValue(250)
    const lottieOp = useSharedValue(0)

    const footerWidth = useSharedValue(150)
    const footerOp = useSharedValue(0)

    const animatedWithTiming = (val,duration) => {
        return withTiming(val, { duration: duration })
    }
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity:opacityContainer.value,
            zIndex:indexContainer.value,
        }
    })

    const animatedFooter = useAnimatedStyle(() => {
        return{
            opacity:footerOp.value,
            width:footerWidth.value
        }
    })

    const animatedLayout = useAnimatedStyle(() => {
        return {
            height:height.value,
        }
    })

    const animatedLottie = useAnimatedStyle(() => {
            return {
                transform: [{ translateX: lottieX.value}],
                opacity:lottieOp.value
            }
    })

    const pressHandler = () => {
        setVisibleOverview(false)
        setSavingVisible(false)
        setFixedCostsVisible(false)
        setStatusCount(0)
        opacityContainer.value = animatedWithTiming(0,2000)
        height.value = withSpring(scaledHeightOff, { damping: 20})
        indexContainer.value = -1
        lottieX.value = withSpring(150)
        footerOp.value = withTiming(0, { duration: 250 })
        lottieOp.value = withTiming(0,{ duration: 250 })
        footerWidth.value = withTiming(500)
    }

    const handleVisibleContainer = () => {
        /* container animation */
        opacityContainer.value = animatedWithTiming(1,150)
        indexContainer.value =  1
        height.value = withSpring(scaledHeightOn, { damping:20})
        /* lottie */
        setTimeout(() => {
            lottieX.value = withSpring(0,{ damping: 16})
            lottieOp.value = withTiming(1,{duration:150})
            footerWidth.value = withSpring(150)
            footerOp.value = withTiming(1, { duration:150 })
        }, 450);

        /* logic */
        setSavingVisible(true)
    }


    useEffect(() => {
        if(visibleOverview){
            console.log("handleVisible container")
            handleVisibleContainer()

        }else{
            console.log("press handler")
            pressHandler()
        }
    },[visibleOverview])

    useEffect(() => {
        switch(statusCount){
            case 0:
                console.log("Case 0")
                if(!visibleOverview){
                    return setFixedCostsVisible(false)
                }
                setOverViewLabel("Saving goal")
                setSavingVisible(true)
                setFixedCostsVisible(false)
                lottieOp.value = withTiming(1, {duration:250})
                lottieX.value = withSpring(0)
                break
            case 1:
                setOverViewLabel("Fixed Costs")
                setSavingVisible(false)
                setFixedCostsVisible(true)
                lottieOp.value = withTiming(0, {duration: 250})
                lottieX.value = withSpring(-150)
                break
        }
    },[statusCount])

    useEffect(() => {
       pressHandler() 
    },[])

  return (
    <Animated.View style={[styles.overviewContainer,animatedStyle, {paddingTop:insets.top}]}>
        <Animated.View style={[styles.overViewLayout, animatedLayout]}>
            <OverviewTitleComponent label={overViewLabel} statusCount={statusCount} setStatusCount={setStatusCount}/>
            <SavingGoalViewComponent visibleOverview={visibleOverview} savingVisible={savingVisible} statusCount={statusCount}/>
            <FixedcostsOverviewComponent fixedCostsVisible={fixedCostsVisible} fixedCostsActive={fixedCostsActive}  />
            
            {/* <View style={{flex:1}}/> */}
            <View style={styles.footer} >
                    <Animated.View style={[animatedLottie,{width:"100%",justifyContent:"center",alignItems:"center",marginBottom:0}]}>
                        {/* <LottieView loop autoPlay style={{width:50,height:30}} resizeMode='cover' source={require("../assets/lottie/lottieCoffee.json")} />
                        <Text style={[styles.label,{fontSize:10}]}>PomExpense</Text> */}
                        <Text style={[styles.label,{fontSize:10}]}>developer: druunken</Text>
                    </Animated.View>
                

                <View style={[styles.touchContainer]}>
                    <Animated.View style={[styles.touchDiv,animatedFooter]}>
                        <TouchableOpacity onPress={pressHandler} style={[styles.touchDiv]}/>
                    </Animated.View>
                </View>
            </View>
        </Animated.View>
    </Animated.View>
  )
}

export default OverviewComponent

const styles = StyleSheet.create({
    overviewContainer:{
        width:"100%",
        position:"absolute",
        top:0,
        paddingHorizontal:15,
        marginTop:15,
    },
    footer:{
        position:"absolute",
        width:"100%",
        bottom:10,
        justifyContent:"center",
        alignItems:"center",
        gap:4
    },
    layoutDiv:{
        justifyContent:"center",
        alignItems:"center",

    },
    productContainer:{
        height:"100%",
        width:"100%",
        opacity:1
    },
    productLabel:{
        fontFamily:"BoldFont",
        color:Colors.primaryBgColor.darkPurple,
        fontSize:30,
        textAlign:"center"
    },
    productDiv:{
        gap:10,
        borderBottomWidth:0.3,
        paddingBottom:20,
        width:"100%"
    },
    touchContainer:{
        width:"100%",
        justifyContent:"center",
        alignItems:"center", 
    },
    touchDiv:{
        borderRadius:10,
        backgroundColor:Colors.primaryBgColor.darkPurple,
        height:15,
        borderWidth:1,
        borderColor:Colors.primaryBgColor.white,
    },
    overViewLayout:{
        backgroundColor: Colors.primaryBgColor.chillOrange,
        borderRadius: 15,
        borderColor: Colors.primaryBgColor.white,
        borderWidth: 2,
        zIndex:1,
        width:"100%",
        height:"100%",
    },
    label:{
        fontFamily:"MainLight",
        fontSize:13,
        color:Colors.primaryBgColor.gray,
    },
    lightLabel:{
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.gray,
        fontSize:20
    },
    div:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    layout:{
        alignItems:"center",
        gap:5
    },
})