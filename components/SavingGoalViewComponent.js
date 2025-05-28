import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import LottieView from 'lottie-react-native';
import Animated ,{ useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { usersBalanceContext } from "@/hooks/balanceContext"
import { Colors } from '@/constants/Colors'
import db from '@/services/serverSide'
import numberInputValidation from '@/services/numberInputValidation';
import ProgressBar from '../components/ProgressBar.js'
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import SunSvg from '../components/SvgComponents/SunSvg.js'
import ProgressBarSvg from '../components/SvgComponents/ProgressBarSvg.js'

const SavingGoalViewComponent = ({ savingVisible, statusCount, visibleOverview }) => {
    /* we need this from memory */
    const [fixedCostsDebited,setFixedCostsDebited] = useState(false)
    const [savingGoalActive,setSavingGoalActive] = useState(false)
    const [monthsTotalExpense,setMonthsTotalExpense] = useState(0)
    const [amountWarning,setAmountWarning] = useState("")
    const [outcomeLabelClr,setOutcomLabelClr] = useState(Colors.primaryBgColor.prime)

    const [spendedWidth,setSpendedWidth] = useState(0)
    const [savingStatus,setSavingStatus] = useState("good")
    const [savingWidth,setSavingWidth] = useState(0)
    const [fixedWidth,setFixedWidth] = useState(0)

    const { currency, fixedCostAmount, value, savingVal, setSavingVal } = useContext(usersBalanceContext)

    const savingGoalX = useSharedValue(-250)
    const productSecondX = useSharedValue(250)
    const productThirdX = useSharedValue(-250)
    const lottieX = useSharedValue(250)
    const lottieOp = useSharedValue(0)
    const productOp = useSharedValue(0)
    const productThirdOp = useSharedValue(0)
    const opacityProductContainer = useSharedValue(0)
    const productContainerDisplay = useSharedValue("flex")


    const animatedProductContainer = useAnimatedStyle(() => {
        return{
            opacity:opacityProductContainer.value,
            display:productContainerDisplay.value
        }
    })

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
            opacity:productThirdOp.value
        }
    })
    const animatedLottie = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: lottieX.value}],
            opacity:lottieOp.value
        }
    })

    const pressHandler = () => {
        if(statusCount === 0){
            opacityProductContainer.value = withTiming(0,{duration:150})
            savingGoalX.value = withSpring(-150)
            productSecondX.value = withSpring(150)
            productThirdX.value = withSpring(-150)
            productOp.value = withTiming(0,{ duration: 250 })
            productThirdOp.value = withTiming(0,{ duration: 250 })
        }else if(statusCount === 1){
            opacityProductContainer.value = withTiming(0,{duration:250})
            savingGoalX.value = withSpring(-150)
            productSecondX.value = withSpring(-150)
            productThirdX.value = withSpring(-150)
            productOp.value = withTiming(0,{ duration: 250 })
            productThirdOp.value = withTiming(0,{ duration: 250 })
            setTimeout(() => {
                productContainerDisplay.value = "none"
            }, 250);
        }
    }
    const handleVisibleContainer = () => {
        /* container animation */
        opacityProductContainer.value = withTiming(1, { duration:500 })

        /* each product animation */
        productOp.value = withTiming(1,{ duration: 700 })
        savingGoalX.value = withSpring(0,{ damping: 16})
        setTimeout(() => {
            productSecondX.value = withSpring(0,{ damping: 16})
            setTimeout(() => {
                productThirdX.value = withSpring(0,{ damping: 16})
                productThirdOp.value = withTiming(1,{ duration: 700 })
                setTimeout(() => {
                    lottieX.value = withSpring(0,{ damping: 16})
                    lottieOp.value = withTiming(1,{duration:150})
                }, 150);
            }, 150);
        }, 150);
        productContainerDisplay.value = "flex"
    }

    const isSavingGoalActive = async() => {
        try {
            const isActive = await db.checkSavingGoal()
            if(isActive){
                setSavingGoalActive(true)
            }else if(!isActive){
                setSavingGoalActive(false)
            }
        } catch (error) {
            console.error(error,"saving goal modal")
        }
    }

    const futureBalance = (multiplier,showFutureAccounting) => {
        if(showFutureAccounting === undefined) return (
            <Text>{numberInputValidation.converToString((numberInputValidation.convertToNumber(value) + numberInputValidation.convertToNumber(savingVal) * multiplier).toFixed(2))}</Text>
        )
        else
        return (
            <Text>{numberInputValidation.converToString((numberInputValidation.convertToNumber(value) + numberInputValidation.convertToNumber(savingVal) * multiplier + (fixedCostsDebited ? monthsTotalExpense : numberInputValidation.convertToNumber(amountWarning) * multiplier)).toFixed(2))}</Text>
        )
    }

    const activateSavingHandler = () => {
        console.log("\nwe need to route it to settings/saving goal\nNot added yet")
    }

    useEffect(() => {
        isSavingGoalActive()
        if(savingVisible) handleVisibleContainer()
        else pressHandler()

        getData()

    },[savingVisible])

    const getData = async() => {
        try {
            const monthExpense = await db.getMonthProps()
            if(monthExpense === undefined){
                return
            }
            if(monthExpense.length > 0){
                /* if saving goal is active */
                /* 250 of 1800 */
                if(monthExpense[0].monthsSavingGoalWasActive > 0){
                    const processedIncome = monthExpense[0].monthsIncomeAutomateProcessed > 0
                    const expense = monthExpense[0].monthsTotalExpenses 
                    const income = monthExpense[0].monthsIncomeVal + (!processedIncome ? monthExpense[0].monthsStaticIncomeVal : 0)
                    const convertString = numberInputValidation.converToString((income - monthExpense[0].monthsSavingGoalVal - Math.abs(expense)))
                    const convertNum = numberInputValidation.convertToNumber(convertString)
                    const finalResNum = numberInputValidation.converToString(convertNum.toFixed(2))
                    const spendedWidthMod = (250 / income) * Math.abs(expense) 
                    let savingWidthMod = (income / 250 ) * (numberInputValidation.convertToNumber(savingVal) / 25)
                    setSavingVal(numberInputValidation.converToString(monthExpense[0].monthsSavingGoalVal))
                    setMonthsTotalExpense(finalResNum)
                    setSpendedWidth(spendedWidthMod)
                    setSavingWidth(savingWidthMod)

                    /* if fixed cost and the income was not processed */
                    /* if thats true we have to calculate the fixed cost in the amount aswell */
                    if(monthExpense[0].monthsFixedCostsActive > 0 && monthExpense[0].monthsIncomeAutomateProcessed < 1){
                        const actualNum = numberInputValidation.convertToNumber(fixedCostAmount)
                        const resFixedCost = Math.abs(actualNum)
                        const res = numberInputValidation.converToString((convertNum - resFixedCost).toFixed(2))
                        savingWidthMod = (250 / income) * (income - numberInputValidation.convertToNumber(savingVal))
                        setAmountWarning(res)
                        setFixedCostsDebited(false)
                        setSavingWidth(savingWidthMod)
                        setFixedWidth((250 / income) * resFixedCost)

                        if(numberInputValidation.convertToNumber(res) < 0 && convertNum > 0){
                            setOutcomLabelClr(Colors.primaryBgColor.brown)
                            setSavingStatus("ok")
                        }else if(numberInputValidation.convertToNumber(res) < 0 && convertNum < 0){
                            setOutcomLabelClr(Colors.primaryBgColor.persianRed)
                            setSavingStatus("cooked")
                        }
                        else {
                            setOutcomLabelClr(Colors.primaryBgColor.prime)
                            setSavingStatus("good")
                        } 
                    }else{
                        setFixedCostsDebited(true)
                    }
                }
            }
        } catch (error) {
            console.error(error,"Error while getting saving goal data")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            console.log("getData")
            console.log(spendedWidth)
            getData()
        }, 500);
    },[value])

    useEffect(() => {
        getData()
    },[])

  return (
    <Animated.View style={[styles.productContainer,animatedProductContainer,{display:savingVisible ? "flex" : "none"}]}>
        {savingGoalActive ? (
            <>
                <Animated.View style={[styles.productDiv, animatedSavingGoal, {borderBottomWidth:0}]}>
                    <View style={[styles.layout,{flexDirection:"row",justifyContent:"center",alignItems:"center",gap:20}]}>
                    <View style={styles.layoutDiv}>
                        <Text style={[styles.lightLabel,{color:outcomeLabelClr,fontSize:25}]}>{fixedCostsDebited ? monthsTotalExpense : amountWarning}$</Text>
                        <Text style={[styles.label,{fontSize:17}]}>{savingStatus === "good" ? "Remaining" : "Diff"}</Text>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black,fontSize:25}]}>{monthsTotalExpense}$</Text>
                        <Text style={[styles.label,{fontSize:17}]}>Total Amount</Text>
                    </View>
                    <Text style={styles.label}>to achieve</Text>
                    <View style={styles.layoutDiv}>
                        <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.gray,fontSize:28}]}>{savingVal}$</Text>
                        <Text style={[styles.label,{fontSize:17}]}>Goal</Text>
                    </View>
                    
                    </View>
                    {/* <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={[styles.progressDiv]}>
                            <View style={[styles.progressBar,{flexDirection:"row"}]}/>
                            <View style={[styles.savingPercDiv,{height:"100%",alignItems:"center"}]}>
                                <View style={[,{borderRadius:10,width:spendedWidth,borderWidth:0,height:"100%",backgroundColor:Colors.primaryBgColor.prime,position:"absolute",left:0}]}/>
                                
                                <View style={[styles.savingPercDiv,{left:savingWidth,height:"100%",borderWidth:2,backgroundColor:Colors.primaryBgColor.newPrimeLight,borderColor:"white",zIndex:3}]}/>
                            </View>
                        </View>
                    </View> */}
                    <ProgressBar savingVisible={savingVisible} spendedClr={outcomeLabelClr} savingWidth={savingWidth} fixedWidth={fixedWidth} spendedWidth={spendedWidth} width={250} />
                    {/* {!fixedCostsDebited && (
                    <View style={{justifyContent:"center",alignItems:"center",backgroundColor:"white",padding:5,borderRadius:5}}>
                        <LottieView loop autoPlay style={{width:30,height:30}} resizeMode='cover' source={require("../assets/lottie/info_lottie.json")} />
                        <View style={[styles.div,{gap:30}]}>
                            <View style={[styles.layout,{gap:0}]}>
                                <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.persianRed,fontSize:30}]}>{amountWarning}$</Text>
                                <Text style={[styles.label,{}]}>Do not spend over</Text>
                            </View>
                        </View>
                    </View>
                    )} */}
                    </Animated.View>

                        {/* CREATE A HALF DONUT SHAPED CHART INSTEAD OF A STRAIGH LINE */}
                        <Text style={{marginTop:50}}>Create a half donut shaped chart instead of a straight line</Text>
                        <View style={{width:"100%",borderWidth:1}}>
                             <ProgressBarSvg width={250}/>
                             <Text>Saving Goal: 250</Text>
                        </View>
                    {/* <Animated.View style={[styles.productDiv,animatedProductSecond,{marginTop:5,justifyContent:"center",alignItems:"center",gap:0,borderBottomWidth:0}]}>

                    <Text style={[styles.productLabel,{fontSize:28}]}>Stats:</Text>
                    <View style={{flexDirection:"row",gap:30}}>
                    <View style={styles.layout}>
                        <Text style={styles.lightLabel}>{futureBalance(1)}$</Text>
                        <Text style={[styles.actualLabel,{color:outcomeLabelClr}]}>{futureBalance(1,true)}$</Text>
                        <Text style={styles.label}>In 1 Month</Text>
                    </View>
                    <View style={styles.layout}>
                        <Text style={styles.lightLabel}>{futureBalance(2)}$</Text>
                        <Text style={[styles.actualLabel,{color:outcomeLabelClr}]}>{futureBalance(2,true)}$</Text>
                        <Text style={styles.label}>In 2 Months</Text>
                    </View>
                    <View style={styles.layout}>
                        <Text style={styles.lightLabel}>{futureBalance(3)}$</Text>
                        <Text style={[styles.actualLabel,{color:outcomeLabelClr}]}>{futureBalance(3,true)}$</Text>
                        <Text style={styles.label}>In 3 Months</Text>
                    </View>
                    </View>

                    </Animated.View>

                    <Animated.View style={[styles.productDiv,animatedProductThird,{marginTop:5,alignItems:"center",justifyContent:"center",gap:0}]}>
                        <View style={[styles.layout,{marginBottom:10,borderBottomWidth:0.3,width:"100%",paddingBottom:10}]}>
                            <Text style={styles.lightLabel}>{futureBalance(12)}$</Text>
                            <Text style={[styles.actualLabel,{color:outcomeLabelClr}]}>{futureBalance(12,true)}$</Text>
                            <Text style={styles.label}>in 1 Year</Text>
                        </View>
                        <View style={{gap:10,width:"100%"}}>
                            <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center", gap:10}}>
                                <View style={{height:15,width:15,backgroundColor:Colors.primaryBgColor.gray,borderRadius:15,borderWidth:0.5}}/>
                                <Text style={[styles.label]}>With Saving Goal</Text>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center", gap:10}}>
                                <View style={{height:15,width:15,backgroundColor:Colors.primaryBgColor.prime,borderRadius:15,borderWidth:0.5}}/>
                                <Text style={[styles.label]}>Current Expenses more than Goal</Text>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center", gap:10}}>
                                <View style={{height:15,width:15,backgroundColor:Colors.primaryBgColor.brown,borderRadius:15,borderWidth:0.5}}/>
                                <Text style={[styles.label]}>Goal is not Achieved but still in Plus </Text>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center", gap:10}}>
                                <View style={{height:15,width:15,backgroundColor:Colors.primaryBgColor.persianRed,borderRadius:15,borderWidth:0.5}}/>
                                <Text style={[styles.label]}>You got cooked. No plus this month</Text>
                            </View>
                        </View>
                    </Animated.View> */}
            </>
        ): (
            <>
                <View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
                    <Text style={styles.lightLabel}>Saving Goal is not active</Text>
                    <TouchableOpacity style={styles.btn} onPress={activateSavingHandler}> 
                        <Text style={styles.lightLabel}>Activate here</Text>
                    </TouchableOpacity>
                </View>
            </>
        )}
        </Animated.View>
  )
}

export default SavingGoalViewComponent

const styles = StyleSheet.create({
    layoutDiv:{
        justifyContent:"center",
        alignItems:"center",
    },
    infoProgress:{
        backgroundColor:Colors.primaryBgColor.newPrime,
        width:80,
        height:20,
        justifyContent:"center",
        alignItems:"center",
        marginTop:2,
        borderRadius:10
    },
    progressBar:{
        width:"100%",
        height:25,
        borderWidth:1,
        borderRadius:10,
        backgroundColor:Colors.primaryBgColor.black,
    },
    savingPercDiv:{
        position:"absolute",
        left:0,
        backgroundColor:Colors.primaryBgColor.prime,
        zIndex:1,
        height:"100%",
        borderRadius:10
    },
    progressDiv:{
        width:250,
        alignItems:"center",
        justifyContent:"center"
    },
    actualLabel:{
        fontSize:14,
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont"
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
        position:"absolute",
        top:80,
        paddingHorizontal:20,

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
        paddingBottom:10,
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