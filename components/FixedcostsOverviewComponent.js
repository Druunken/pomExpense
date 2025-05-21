import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Colors } from '@/constants/Colors'
import React, { useState, useEffect, useContext } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import FixedCostsElement from "../components/FixedCostsElement.js"
import { usersBalanceContext } from "@/hooks/balanceContext"
import db from '@/services/serverSide'
import numberInputValidation from '@/services/numberInputValidation.js'

const FixedcostsOverviewComponent = ({ fixedCostsVisible, fixedCostsActive }) => {

    const opacityProductContainer = useSharedValue(1)
    const notActiveOp = useSharedValue()
    const notActiveDisplay = useSharedValue("flex")
    const notActiveX = useSharedValue(150)

    const [debited,setDebited] = useState(false)


    const { fixedCostAmount, } = useContext(usersBalanceContext)

    const activeOp = useSharedValue(0)
    const activeX = useSharedValue(150)
    const activateSavingHandler = () => {
        console.log("\nwe need to route it to settings/saving goal\nNot added yet")
    }

    const  animatedNotActive = useAnimatedStyle(() =>  {
        return {
            opacity: notActiveOp.value,
            transform: [{ translateX:notActiveX.value }]
        }
    })

    const animatedActive = useAnimatedStyle(() => {
        return {
            opacity:activeOp.value,
            transform:[{ translateX:activeX.value }]
        }
    })

    const animatedProductContainer = useAnimatedStyle(() => {
            return{
                opacity:opacityProductContainer.value,
                display:notActiveDisplay.value
            }
        })

    const getData = async() => {
        try {
            const data = await db.getMonthProps()
            console.log(data[0].monthsIncomeAutomateProcessed)
            if(data[0].monthsIncomeAutomateProcessed > 0){
                setDebited(true)
            }else{
                setDebited(false)
            }
        } catch (error) {
            console.error(error,"error while getting monthsProps in fixed Costs overview")
        }
    }

    useEffect(() => {
        if(fixedCostsVisible){
            if(!fixedCostsActive){
                console.log("!")
                notActiveDisplay.value = "flex"
                notActiveOp.value = withTiming(1, {duration:500})
                notActiveX.value = withSpring(0,{ damping: 16})
            }else {
                activeOp.value = withTiming(1, {duration:1000})
                activeX.value = withSpring(0,{ damping: 16})
            }
        }else{
            if(!fixedCostsActive){
                notActiveOp.value = withTiming(0, {duration:150})
                notActiveX.value = withSpring(300)
            }else{
                activeOp.value = withTiming(0, {duration:100})
                activeX.value = withSpring(300)
            }
        }
    },[fixedCostsVisible])

    useEffect(() => {
        getData()
    },[])

  return (
    <Animated.View style={[styles.productContainer,animatedProductContainer]}>
        {fixedCostsActive ? (
            <Animated.View style={[animatedActive,{borderWidth:0,gap:0}]}>
                {/* <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <View style={[styles.labelDiv,{borderWidth:1}]}>
                        <Text style={styles.lightLabel}>5</Text>
                        <Text style={styles.label}>Selected day</Text>
                    </View>
                    <View style={[styles.labelDiv,{borderWidth:1}]}>
                        <Text style={styles.lightLabel}>3</Text>
                        <Text style={styles.label}>Length of Bills</Text>
                    </View>
                    
                    <View style={[styles.labelDiv,{borderWidth:1}]}>
                        <Text style={styles.lightLabel}>Not debited</Text>
                        <Text style={styles.label}>Status</Text>
                    </View>
                    
                </View> */}
                    <FixedCostsElement/>
                    <View style={{flex:1}}/>
                    <View style={{backgroundColor:"white",marginTop:10,paddingHorizontal:20,borderRadius:10,paddingVertical:0}}>
                        <View style={[styles.labelDiv,{flexDirection:"row",gap:10, width:"100%",justifyContent:"space-between",marginTop:0,borderBottomWidth:1}]}>
                            <Text style={[styles.label,{}]}>debited</Text>
                            <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black,fontSize:25,textAlign:"center"}]}>{debited ? "Yup" : "Nope"}</Text>
                        </View>
                        <View style={[styles.labelDiv,{flexDirection:"row",gap:10, width:"100%",justifyContent:"space-between",borderBottomWidth:1}]}>
                            <Text style={[styles.label,{}]}>Status</Text>
                            <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.darkPurple,fontSize:25,textAlign:"center"}]}>Active</Text>
                        </View>
                        <View style={[styles.labelDiv,{flexDirection:"row",gap:10, width:"100%",justifyContent:"space-between",borderBottomWidth:0}]}>
                            <Text style={[styles.label,{}]}>Total amount</Text>
                            <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.persianRed,fontSize:25,textAlign:"center"}]}>{Math.abs(numberInputValidation.convertToNumber(fixedCostAmount))}$</Text>
                        </View>
                    </View>
            </Animated.View>
        ):(
            <>  
                <Animated.View style={[animatedNotActive,{width:"100%",justifyContent:"center",alignItems:"center"}]}>
                    <Text style={styles.lightLabel}>Fixed Costs no setup</Text>
                    <TouchableOpacity style={styles.btn} onPress={activateSavingHandler}> 
                        <Text style={styles.lightLabel}>Activate here</Text>
                    </TouchableOpacity>
                </Animated.View>
            </>
        )}
    </Animated.View>
  )
}

export default FixedcostsOverviewComponent

const styles = StyleSheet.create({
    layoutDiv:{
        justifyContent:"center",
        alignItems:"center",
    },
    labelDiv:{
        justifyContent:"center",
        alignItems:"center"   
    },
    btn:{
        width:300,
        height:50,
        backgroundColor:Colors.primaryBgColor.newPrime,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:3,
        borderColor:Colors.primaryBgColor.darkPurple
    },
    productContainer:{
        width:"100%",
        opacity:1,
        gap:15,
        zIndex:0,
        top:40,
        position:"absolute",
        paddingHorizontal:15,
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
        width:"100%",
        paddingBottom:10
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
        fontSize:20,
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