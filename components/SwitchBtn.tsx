import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import React, {useEffect, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import Animated,{ interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'

const SwitchBtn = ({ label,active,setActive,lottie,expenseMode,amountBiggerThanRem }) => {

    const leftCircle = useSharedValue(5)
    const lottieRef = useRef(null)
    const textOpacity = useSharedValue(1)
    const notifX = useSharedValue(150)
    const notifOp = useSharedValue(0)
    const expenseLottieX = useSharedValue(0)
    const expenseLottieOp = useSharedValue(0)

    const animatedNotif = useAnimatedStyle(() => {
        return{
            transform:[{ translateX: notifX.value}],
            opacity: notifOp.value
        }
    })

    const animatedLottie = useAnimatedStyle(() => {
        return{
            transform:[{ translateX: expenseLottieX.value}],
            opacity: expenseLottieOp.value
        }
    })

    const animatedCircleDiv = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            leftCircle.value,
            [5,42],
            [Colors.primaryBgColor.white,Colors.primaryBgColor.babyBlue]
        )
        return{
            backgroundColor,
        }   
    })
    const animatedText = useAnimatedStyle(() => {
        return{
            opacity: textOpacity.value
        }
    })
    const animatedCircle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            leftCircle.value,
            [5,42],
            [Colors.primaryBgColor.black,Colors.primaryBgColor.prime]
        )
        return{
            left: leftCircle.value,
            backgroundColor,
        }   
    })

    useEffect(() => {
        if(active){
            leftCircle.value = withSpring(42,{damping:12})
        }else if(!active) leftCircle.value = withSpring(5,{damping:12})
        
        textOpacity.value = withTiming(0,{duration:30}, () => {
            textOpacity.value = withTiming(1,{duration:250})
        })
        if(lottieRef.current){
           console.log("reffed")
           lottieRef.current?.reset()
           setTimeout(() => {
                lottieRef.current?.play()
           }, 0);
        }
    },[active])


    useEffect(() => {   
        if(amountBiggerThanRem){
            console.log("bigger than rem")
            notifOp.value = withTiming(1,{ duration:250})
            notifX.value = withSpring(0,{ damping:16})

            expenseLottieOp.value = withTiming(0, { duration: 250 })
            expenseLottieX.value = withSpring(-150, {damping: 16})
        }else{
            notifOp.value = withTiming(0,{ duration:250})
            notifX.value = withSpring(150,{ damping:16})

            expenseLottieOp.value = withTiming(1, { duration: 250 })
            expenseLottieX.value = withSpring(0, {damping: 16})
        }
    },[amountBiggerThanRem])
    /*  Create a notification if amountBiggerthanRem is true */
    // create a smooth animation between the lottie and the text notification
  return (
    <View style={[styles.container,{width:"100%"}]}>
        {label && !lottie ? (
            <Text style={styles.label}>{label} {active}</Text>
        ) : lottie && expenseMode ? (
            <View style={[{borderWidth:0,width:"100%"}]}>
                <Animated.View style={[animatedLottie,{opacity:amountBiggerThanRem ? 0 : 1,position:"absolute",justifyContent:"center",alignItems:"center",width:"100%"}]}>
                    <LottieView autoPlay={false} loop={false} ref={lottieRef}  resizeMode='contain' style={styles.lottieDiv} source={require("../assets/lottie/expense_mode_lottie.json")}/>
                </Animated.View>
                <View style={[{opacity:amountBiggerThanRem ? 1 : 0,width:"100%",height:120,justifyContent:"center",alignItems:"center"}]}>
                    <Animated.View style={[animatedNotif,{position:"absolute",justifyContent:"center",alignItems:"center",height:120}]}>
                        <Text style={styles.label}>Notice:</Text>
                        <Text style={[styles.label,{textAlign:"center",color:Colors.primaryBgColor.black}]}>This amount is exceeding the limit of saving goal!</Text>
                    </Animated.View>
                </View>
            </View>
            
        ) : (
            <>
                <LottieView autoPlay={false} loop={false}  ref={lottieRef} resizeMode='contain' style={styles.lottieDiv} source={require("../assets/lottie/income_lottie.json")}/>
            </>
        )
            
        }
            <TouchableOpacity activeOpacity={0.9} onPress={() => {
                if(setActive === undefined) return
                setActive(prev => !prev)
            }}>
                <Animated.View style={[styles.switchLayout,animatedCircleDiv,{alignItems: active ? "flex-start" : "flex-end"}]}>
                    <Animated.View style={[styles.switchBtn,animatedCircle]}>
                    </Animated.View>
                    <Animated.Text style={animatedText}>{active && label ? "ON" : !active && label ? "OFF" : ""}</Animated.Text>
                </Animated.View>
            </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
    switchLayout:{
        width:70,
        height:30,
        borderRadius:15,
        justifyContent:"center",
        paddingHorizontal:10,
        position:"relative",
        backgroundColor:"white",
    },
    lottieDiv:{
        width:120,
        height:120
    },
    switchBtn:{
        position:"absolute",
        backgroundColor:Colors.primaryBgColor.prime,
        width:20,
        height:20,
        borderRadius:10,
        left:5
    },
    container:{
        flexDirection:"column",
        alignItems:"center",
        marginVertical:3,
        gap:10
    },
    label:{
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont",
        fontSize:17,
    }
})

export default SwitchBtn