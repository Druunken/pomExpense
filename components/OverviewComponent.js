import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated ,{ useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const OverviewComponent = ({ visibleOverview, setVisibleOverview }) => {
    const dimensions = Dimensions.get("window")
    const insets = useSafeAreaInsets()

    const scaledHeightOn = dimensions.height - insets.bottom - insets.top - 80
    const scaledHeightOff = 180

    const opacityContainer = useSharedValue(0)
    const indexContainer = useSharedValue(-1)

    const opacityProductContainer = useSharedValue(0)

    const savingGoalX = useSharedValue(-250)
    const productSecondX = useSharedValue(250)
    const productThirdX = useSharedValue(-250)
    const lottieX = useSharedValue(250)
    const lottieOp = useSharedValue(0)

    const productOp = useSharedValue(0)
    const height = useSharedValue(scaledHeightOn)

    const animatedWithTiming = (val,duration) => {
        return withTiming(val, { duration: duration })
    }

    const animatedSavingGoal = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: savingGoalX.value}],
            opacity:productOp.value
        }
    })
    const animatedProductSecond = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: productSecondX.value}],
            opacity:productOp.value
        }
    })
    const animatedProductThird = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: productThirdX.value}],
            opacity:productOp.value
        }
    })
    const animatedLottie = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: lottieX.value}],
            opacity:lottieOp.value
        }
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity:opacityContainer.value,
            zIndex:indexContainer.value,
        }
    })

    const animatedProductContainer = useAnimatedStyle(() => {
        return{
            opacity:opacityProductContainer.value
        }
    })

    const animatedLayout = useAnimatedStyle(() => {
        return {
            height:height.value,
        }
    })

    const pressHandler = () => {
        setVisibleOverview(false)
        opacityContainer.value = animatedWithTiming(0,2000)
        opacityProductContainer.value = withTiming(0,{duration:150})
        height.value = withSpring(scaledHeightOff, { damping: 20})
        indexContainer.value = -1
        savingGoalX.value = withSpring(-150)
        productSecondX.value = withSpring(150)
        productThirdX.value = withSpring(-150)
        lottieX.value = withSpring(150)
        productOp.value = withTiming(0,{ duration: 250 })
        lottieOp.value = withTiming(0,{ duration: 250 })
    }

    const handleVisibleContainer = () => {
        /* container animation */
        opacityContainer.value = animatedWithTiming(1,150)
        opacityProductContainer.value = withTiming(1, { duration:500 })
        indexContainer.value =  1
        height.value = withSpring(scaledHeightOn, { damping:20})

        /* each product animation */
        productOp.value = withTiming(1,{ duration: 700 })
        savingGoalX.value = withSpring(0,{ damping: 16})
        setTimeout(() => {
            productSecondX.value = withSpring(0,{ damping: 16})
            setTimeout(() => {
                productThirdX.value = withSpring(0,{ damping: 16})
                setTimeout(() => {
                    lottieX.value = withSpring(0,{ damping: 16})
                    lottieOp.value = withTiming(1,{duration:150})
                }, 150);
            }, 150);
        }, 150);
    }

    useEffect(() => {
        if(visibleOverview){
            handleVisibleContainer()
        }else{
            pressHandler()
        }
    },[visibleOverview])

  return (
    <Animated.View style={[styles.overviewContainer,animatedStyle, {paddingTop:insets.top}]}>
        <Animated.View style={[styles.overViewLayout, animatedLayout]}>
            <Animated.View style={[styles.productContainer,animatedProductContainer]}>
            <Animated.View style={[styles.productDiv, animatedSavingGoal]}>

                <Text style={styles.productLabel}>Saving Goal</Text>
                <View style={[styles.layout,{flexDirection:"row",justifyContent:"center",alignItems:"center",gap:20}]}>
                    <View style={styles.layoutDiv}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black,fontSize:30}]}>2000$</Text>
                        <Text style={[styles.label,{fontSize:20}]}>Remaining</Text>
                    </View>
                    <Text style={styles.label}>of</Text>
                    <View style={styles.layoutDiv}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black,fontSize:30}]}>800$</Text>
                        <Text style={[styles.label,{fontSize:20}]}>Goal</Text>
                    </View>
                </View>
                <View style={styles.div}>
                    <View style={styles.layout}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.brown}]}>550$</Text>
                        <Text style={styles.label}>upcoming fixed costs</Text>
                    </View>
                    <View style={styles.layout}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.brown}]}>250$</Text>
                        <Text style={[styles.label,{}]}>Do not spend over</Text>
                    </View>
                </View>
            </Animated.View>

            <Animated.View style={[styles.productDiv,animatedProductSecond,{marginTop:15}]}>
                <Text style={styles.productLabel}>Personal Costs</Text>
                <View style={[styles.div,{justifyContent:"center",gap:50}]}>
                    <View style={styles.layout}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.persianRed}]}>500$</Text>
                        <Text style={styles.label}>Fixed Costs</Text>
                    </View>
                    <View style={styles.layout}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.brown}]}>1900$</Text>
                        <Text style={[styles.label,{}]}>Income</Text>
                    </View>
                    
                </View>
            </Animated.View>

            {/* <Animated.View style={[styles.productDiv,animatedProductThird,{marginTop:15,alignItems:"center"}]}>
                <Text style={styles.productLabel}>Balance Context</Text>
                <View style={[styles.div,{gap:50}]}>
                    <View style={styles.layout}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.brown}]}>1500$</Text>
                        <Text style={styles.label}>Highest Income</Text>
                    </View>
                    <View style={styles.layout}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.persianRed}]}>800$</Text>
                        <Text style={[styles.label,{}]}>Highest Expense</Text>
                    </View>
                </View>
            </Animated.View> */}

            <View style={{flex:1}}/>

            <Animated.View style={[animatedLottie,{width:"100%",justifyContent:"center",alignItems:"center",marginBottom:50}]}>
                <LottieView loop autoPlay style={{width:120,height:80}} resizeMode='cover' source={require("../assets/lottie/lottieCoffee.json")} />
                <Text style={[styles.label,{fontSize:15}]}>PomExpense</Text>
                <Text style={[styles.label,{fontSize:15}]}>developer: druunken</Text>
            </Animated.View>

            <View style={styles.touchContainer}>
                <TouchableOpacity onPress={pressHandler} style={styles.touchDiv}/>
            </View>
            </Animated.View>
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
        gap:20,
        borderBottomWidth:0.3,
        paddingBottom:20,
        width:"100%"
    },
    touchContainer:{
        width:"100%",
        justifyContent:"center",
        alignItems:"center", 
        paddingBottom:0,
    },
    touchDiv:{
        borderRadius:4,
        backgroundColor:Colors.primaryBgColor.darkPurple,
        width:120,
        height:10,
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
        padding:15,
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