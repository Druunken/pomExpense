import { View, Text, Modal, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import SwitchBtn from './SwitchBtn'
import NumberInput from './NumberInput'
import TitleInput from '@/components/TitleInput'
import CondBtn from './CondBtn'
import db from '@/services/serverSide'
import numberValidation from '@/services/numberInputValidation'
import { usersBalanceContext, incomeActiveContext } from "@/hooks/balanceContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import GenreButton from './GenreButton.js'
import GenreComponent from './GenreComponent.js'
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native'
import numberInputValidation from '@/services/numberInputValidation'

const { height } = Dimensions.get("window") 

const ModalTransactions = ({ visible, setVisible, expenseMode, setExpenseMode, editMode, value, setValue, balanceFade, setEditMode, editId }) => {
    const [amount,setAmount] = useState("")
    const [prevAmount,setPrevAmount] = useState("")
    const [title,setTitle] = useState("")
    const [cate,setCate] = useState("")
    const [subType,setSubType] = useState("")
    const [editDate,setEditDate] = useState("")
    const [remainingAmount,setRemainingAmount] = useState("")
    const [amountBiggerThanRem,setAmountBiggerThanRem] = useState(false)
    const [alreadyMissed,setAlreadyMissed] = useState(false)

    const [submitted,setSubmitted] = useState(false)

    const [numberInputFocus,setNumberInputFocus] = useState(false)
    const [titleInputFocus,setTitleInputFocus] = useState(false)

    const passedLottieRef = useRef(null)

    const [genreModalVisible,setGenreModalVisible] = useState(false)

    const { setMarkedDates, currency, savingVal, fixedCostAmount  } = useContext(usersBalanceContext) 
    const { currentIncome } = useContext(incomeActiveContext)
 
    const inset = useSafeAreaInsets()

    const updateMarkedDates = async(val, expense, edit) => {
        try {
        const currentDate = await db.createCurrentDate()
        const dateString = currentDate[3]
        const actualAmount = numberValidation.convertToNumber(amount)
        const diff = actualAmount > prevAmount ? actualAmount - prevAmount : prevAmount - actualAmount

        if(!edit){
            setMarkedDates((prev) => {
                let copy = prev
                if(copy[dateString]){
                    const amount = copy[dateString].amount
                    copy[dateString].amount = expense ? amount - val : amount + val
                }else {
                    copy[dateString] = {marked:true,selected:false,amount:expense? -val : val}
                }
                return copy
            })
        }else if(edit){
            setMarkedDates((prev) => {
                let copy = prev
                if(copy[editDate]){
                    const datesAmount = copy[editDate].amount
                    if(expense){
                        copy[editDate].amount = datesAmount < 0 ? datesAmount - val : datesAmount + -val
                    }else if(!expense){
                        const validation = prevAmount < actualAmount ? datesAmount + diff : datesAmount - diff
                        copy[editDate].amount = validation
                    }
                }
                return copy
            })
        }
        } catch (error) {
            console.error(error)
        }
    }


    const isValueChanged = () => {
        if(amount.length > 0) return true
        else return false
    }

    const showChangedValue = () => {
        if(expenseMode && !editMode){
            const prevVal = numberValidation.convertToNumber(value)
            const actualAm = numberValidation.convertToNumber(amount)
            const totalAM = (prevVal - actualAm).toFixed(2)
            const fixedVal = numberValidation.converToString(totalAM)
            if(totalAM === "0.00") return "0,00"
            return fixedVal
        } 
        else if(!expenseMode && !editMode) {
            const prevVal = numberValidation.convertToNumber(value)
            const actualAm = numberValidation.convertToNumber(amount)
            const totalAM = (prevVal + actualAm).toFixed(2)
            const fixedVal = numberValidation.converToString(totalAM)
            if(totalAM === "0.00") return "0,00"
            return fixedVal
        }
        else if(!expenseMode && editMode){
            const prevVal = numberValidation.convertToNumber(value)
            const actualAm = numberValidation.convertToNumber(amount)
            const totalAM = (prevVal + (actualAm - prevAmount)).toFixed(2)
            const fixedVal = numberValidation.converToString(totalAM)
            if(totalAM === "0.00") return "0,00"
            return fixedVal
        }
        else if(expenseMode && editMode){
            const prevVal = numberValidation.convertToNumber(value)
            const actualAm = numberValidation.convertToNumber(amount)
            const totalAM = (prevVal - (actualAm + prevAmount)).toFixed(2)
            const fixedVal = numberValidation.converToString(totalAM)
            if(totalAM === "0.00") return "0,00"
            return fixedVal
        }
    }

    const fetchTransaction = async(editId) => {
        try {
            const transaction = await db.getSingleEntry(editId)
            if(!transaction) return console.log("Not found")
            // number ??
            const convertStr = numberValidation.converToString(transaction.moneyValue)
            setPrevAmount(convertStr)
            setTitle(transaction.value)
            setCate(transaction.type)
            setEditDate(transaction.date)
            if(transaction.balanceType === "minus") setExpenseMode(true)
            else setExpenseMode(false)
        } catch (error) {
            console.error(error)
        }
    }


    /* animate values */

    const layoutY = useSharedValue(height)
    const layoutBg = useSharedValue(0)
    const layoutOp = useSharedValue(1)

    const passedOp = useSharedValue(0)
    const passedY = useSharedValue(-150)
    const passedIndex = useSharedValue(-50)

    const containerBg = useSharedValue(0)

    const currOpacity = useSharedValue(1)
    const prevOpacity = useSharedValue(0)

    const currY = useSharedValue(20)
    const prevY = useSharedValue(50)

    const numberInputOp = useSharedValue(1)

    const animatedNumberInput = useAnimatedStyle(() => {
        return {
            opacity:numberInputOp.value,
        }
    })

    const animatedContainer = useAnimatedStyle(() => {
        return{
            backgroundColor: interpolateColor(
                containerBg.value,
                [0,1],
                ['rgba(0, 0, 0, 0.9)','rgba(0, 0, 0, 0)']
            )
        }
    })

    const animatedPassedDiv = useAnimatedStyle(() => {
        return{
            opacity:passedOp.value,
            transform:[{ translateY: passedY.value }],
            zIndex:passedIndex.value
        }
    })
    
    const animatedLayout = useAnimatedStyle(() => {
        return{
            transform: [
                { translateY: layoutY.value }
            ],
            backgroundColor: interpolateColor(
                layoutBg.value,
                [0,1],
                [expenseMode ? Colors.primaryBgColor.lightGray : Colors.primaryBgColor.babyBlue, Colors.primaryBgColor.newPrime]
            ),
            opacity:layoutOp.value
        }
    })

    const animatedCurr = useAnimatedStyle(() => {
        return{
            transform:[{ translateY: currY.value }]
        }
    })

    const animatedPrev = useAnimatedStyle(() => {
        return{
            opacity: prevOpacity.value,
            transform: [{ translateY: prevY.value }]
        }
    })


    const destinatedAnimation = (opacity,y,duration,objOpacity,objY) => {
        objOpacity.value = withTiming(opacity,{ duration: duration })
        objY.value = withTiming(y,{ duration: duration })
    }
    
    const expenseInputValid = expenseMode && !cate || Number(amount) === 0 || title.length === 0
    const incomeINputValid = !expenseMode &&  Number(amount) === 0 || title.length === 0


    /* Touch Functionality */

    const pressedLayout = (ev) => {

        /* change condition if the specific scenario is choosen */
        /* this will execute the closing of the modal */
        if(true){
            formExecution()
        }
    }

    const formExecution = (closeType) => {
        if(closeType !== "form"){
            layoutY.value = withSpring(height,{ damping:15 })
            containerBg.value = withTiming(1,{ duration:600 })

            setGenreModalVisible(false)
            setSubType("")
            setAmount("")
            setTitle("")
            setCate("")
            setEditMode(false)
            setTimeout(() => {
                setVisible(false)
            }, 600);

        }else{
            passedIndex.value = 1
            layoutOp.value = withTiming(1,{duration:250})
            layoutY.value = withSpring(height,{ damping:15 })
            passedOp.value = withTiming(1, { duration: 500 })
            passedY.value = withSpring(0)
            setGenreModalVisible(false)
            setSubType("")
            setAmount("")
            setTitle("")
            setCate("")
            setEditMode(false) 


            setTimeout(() => {
                passedLottieRef.current?.reset()
                passedLottieRef.current?.play()
            }, 500);
            
            setTimeout(() => {
                passedOp.value = withTiming(0, { duration:300})
            }, 1500);

            setTimeout(() => {
                containerBg.value = withTiming(1,{ duration:600 })
            }, 1800);

            setTimeout(() => {
                setVisible(false)
            }, 2100);
        }
    }

    const getCalculatedAmount = async() => {
        try {
            const data = await db.getMonthProps()
            const monthExpenses = Math.abs(data[0].monthsTotalExpenses)
            const incomeProcessed = data[0].monthsIncomeAutomateProcessed > 0
            const staticIncome = data[0].monthsStaticIncomeVal
            const currIncome = data[0].monthsIncomeVal
            const acutalIncome = incomeProcessed ? currIncome : currIncome + staticIncome
            const savingNum = numberValidation.convertToNumber(savingVal)
            const fixedNum = numberInputValidation.convertToNumber(fixedCostAmount)

            const res = numberInputValidation.converToString((acutalIncome - Math.abs(fixedNum) - savingNum - monthExpenses).toFixed(2))
            setRemainingAmount(res)
            if(numberInputValidation.convertToNumber(res) < 0){
                setAlreadyMissed(true)
            }else{
                setAlreadyMissed(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        showChangedValue()
        isValueChanged()
    },[amount])


    useEffect(() => {
        if(editMode){
            fetchTransaction(editId)
        }
    },[editMode,editId])


    useEffect(() => {

        if(numberInputValidation.convertToNumber(amount) > numberInputValidation.convertToNumber(remainingAmount)){
            console.log("yes bigger")
            if(amountBiggerThanRem){
            }
            setAmountBiggerThanRem(true)
        }else{
            console.log("not bigger")
            if(!amountBiggerThanRem){
            }
            setAmountBiggerThanRem(false)
        }

        if(amount.length > 0){
            destinatedAnimation(1,0,300,prevOpacity,prevY)
            destinatedAnimation(1,60,300,currOpacity,currY)
        }
        else if(amount.length < 1 && visible){
            destinatedAnimation(0,50,300,prevOpacity,prevY)
            destinatedAnimation(1,0,300,currOpacity,currY)
        }
    },[amount])

    useEffect(() => {
        if(visible){
            containerBg.value = withTiming(0,{ duration:1000 })
            layoutY.value = withSpring(0,{damping:13})
            layoutOp.value = 1
            passedOp.value = 0
            passedY.value = -150
        }
        getCalculatedAmount()
    },[visible])


    /* Checking for valid form and execute animation */
    /* SWAPPED LOGIC */
    useEffect(() => {
        if(!expenseInputValid && cate !== ""){
            setTimeout(() => {
                layoutBg.value = withTiming(1, { duration:1000 })
            }, 250);
        }else if(expenseInputValid){
            layoutBg.value = withTiming(0, { duration:1000 })
        }else if(!expenseMode){
            layoutBg.value = withTiming(1, { duration:1000 })
        }
    },[expenseInputValid])
 
    useEffect(() => {
            setSubType("")
            setCate("")
    },[expenseMode])

    useEffect(() => {
        if(titleInputFocus){
            numberInputOp.value = withTiming(0, { duration: 250 })
        }else {
            numberInputOp.value = withTiming(1, { duration: 250 })
        }
    },[titleInputFocus])

   return (
    <View style={{}}>
        <Modal animationType="none" transparent={true} visible={visible}>
            <GenreComponent visible={genreModalVisible} setVisible={setGenreModalVisible} setCate={setCate} setSubType={setSubType}/>
            <Animated.View style={[styles.container,animatedContainer,{paddingTop:inset.top}]}>
                <View style={[styles.passedDiv,{}]}>
                    <Animated.View style={[styles.passedLayout, animatedPassedDiv]}>
                        <LottieView ref={passedLottieRef} autoPlay loop={false} style={{ width: 80, height:80,borderRadius:20}} resizeMode='cover' source={require("../assets/lottie/check_mark_lottie.json")}/>
                        <Text style={{fontFamily:"MainFont",color:"white",fontSize:13}}>Complete 100%</Text>
                    </Animated.View>
                </View>
                <Animated.View style={[styles.formDiv,animatedLayout]}>
                    <View onTouchStart={(ev) => pressedLayout(ev)} style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={styles.scrollView}/>
                    </View>
                    <View style={[styles.infoDiv,{}]}>
                        <Animated.View style={[animatedPrev,styles.prevView,{flexDirection:"row",gap:20}]}>
                            <View style={styles.headerDivInfo}>
                                <Text style={{fontSize:15,fontFamily:"MainFont",color:Colors.primaryBgColor.gray}}>Previous Balance: </Text>  
                                <Text style={{fontSize:15,fontFamily:"MainFont",color:Colors.primaryBgColor.gray}}>{numberInputValidation.converToString(numberInputValidation.convertToNumber(value).toFixed(2))}</Text> 
                            </View>
                            <View style={styles.headerDivInfo}>
                                <Text style={{fontSize:15,fontFamily:"MainFont",color:Colors.primaryBgColor.gray}}>Remaing Amount: </Text>
                                <Text style={{fontSize:15,fontFamily:"MainFont",color:Colors.primaryBgColor.gray}}>{remainingAmount}$</Text>
                            </View>
                        </Animated.View>
                        <Animated.View style={[animatedCurr, { justifyContent:"center",alignItems:"center" }]}>
                        <Text style={{fontSize:35,fontFamily:"MainFont",color:isValueChanged() && expenseMode ? Colors.primaryBgColor.darkPurple : Colors.primaryBgColor.prime}}>Current Balance</Text>
                        <Text style={{fontSize:35,fontFamily:"MainFont",color:isValueChanged() && expenseMode ? Colors.primaryBgColor.darkPurple : Colors.primaryBgColor.prime}}>{showChangedValue()}</Text>
                        </Animated.View>
                    </View>
                    <View style={[styles.layout,{}]}>
                    <KeyboardAvoidingView style={{borderWidth:0,flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={500}>
                        <View style={{alignItems:"center"}}>
                            <SwitchBtn  amountBiggerThanRem={amountBiggerThanRem && !alreadyMissed} active={expenseMode} setActive={editMode ? undefined : setExpenseMode} lottie={true} expenseMode={expenseMode}/>
                        </View>
                        {!numberInputFocus && (
                            <View style={{}}>
                                <View style={{}}>
                                    <Text style={styles.title}>Title</Text>
                                </View>
                                <TitleInput setIsOnFocus={setTitleInputFocus} isOnFocus={titleInputFocus} state={title} setState={setTitle} submitted={submitted} setSubmitted={setSubmitted}/>
                            </View>
                        )}
                        <Animated.View style={animatedNumberInput}>
                            <Text style={styles.title} >Amount</Text>
                            <NumberInput isOnFocus={numberInputFocus} setIsOnFocus={setNumberInputFocus} autoFocus={false} state={amount} setState={setAmount} currency={currency}/>
                        </Animated.View>
                        </KeyboardAvoidingView>
                        {<View style={{gap:5, opacity: expenseMode ? 1 : 0.5,marginBottom:15}}>
                            <Text></Text>
                            <GenreButton onPress={() => {
                                setTitleInputFocus(false)
                                setNumberInputFocus(false)
                            }} setVisible={setGenreModalVisible} subType={subType} disabled={!expenseMode} setState={setSubType} setCate={setCate} title={title}/>
                        </View> }
                    </View>
                    

                    <View style={{justifyContent:"center",alignItems:"center", gap:10, paddingBottom:inset.bottom}}>
                        <CondBtn genreTypes={false} cond={expenseInputValid || incomeINputValid} type={"confirm"} label={expenseMode ? "Add Expense" : "Add Income"} style={styles.condBtn} onPress={() => {
                            const actualVal = numberValidation.convertToNumber(amount)
                            const convertNum = numberValidation.convertToNumber(value)
                            const prevValNum = convertNum
                            
                            const isBiggerVal = actualVal > prevAmount ? actualVal - prevAmount : prevAmount - actualVal
                            const isBiggerBool = actualVal > prevAmount ? true : false
                            const addNum = isBiggerBool ? prevValNum + isBiggerVal : prevValNum - isBiggerVal
                            const epxenseBigVal = actualVal > prevAmount ? actualVal + prevAmount : prevAmount - actualVal

                            
                            if(expenseMode && !editMode) {
                                const calcEx = (prevValNum - actualVal).toFixed(2)
                                const convertCalcEx = numberValidation.converToString(calcEx)
                                db.saveData(title, -actualVal, cate, subType, "minus","none");
                                db.negativeBalance(-actualVal);
                                if(convertCalcEx){
                                    setValue(convertCalcEx)
                                }
                                updateMarkedDates(actualVal,true,false)
                            }
                            else if(!expenseMode && !editMode) {
                                const calcIn = (prevValNum + actualVal).toFixed(2)
                                const convertCalcEx = numberValidation.converToString(calcIn)
                                
                                db.saveData(title, actualVal, "income", "plus","none");
                                db.positiveBalance(actualVal);
                                if(convertCalcEx){
                                    setValue(convertCalcEx)
                                }
                                updateMarkedDates(actualVal,false,false)

                            } else if(expenseMode && editMode) {
                                const calcEdEx = (prevValNum - epxenseBigVal).toFixed(2)
                                const convertCalcEdEx = numberValidation.converToString(calcEdEx)

                                db.updateTransaction(title, actualVal, cate, prevAmount, "minus",editId)
                                if(convertCalcEdEx){
                                    setValue(convertCalcEdEx)
                                }
                                updateMarkedDates(epxenseBigVal,true,true)
                            } else if(!expenseMode && editMode){
                                const calcEdIn = addNum.toFixed(2)
                                const convertCalcEdIn = numberValidation.converToString(calcEdIn)

                                db.updateTransaction(title, actualVal, cate, prevAmount, "plus",editId)
                                setValue(convertCalcEdIn) 
                                updateMarkedDates(addNum,false,true)
                            }


                            //reset
                            formExecution("form")
                        }}/>
                        
                    </View> 
                </Animated.View>
            </Animated.View>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        opacity:1,
        position:"absolute",
        top:"0%",
    },
    headerDivInfo:{
        justifyContent:"center",
        alignItems:"center",
        gap:0
    },
    passedDiv:{
        position:"absolute",
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        height:"100%",
    },
    passedLayout:{
        backgroundColor:Colors.primaryBgColor.prime,
        width:150,
        height:150,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:20,
    },
    infoDiv:{
        minHeight:150,
        width:"100%",
        paddingBottom:5,
        position:"relative",
    },
    prevView:{
        position:"absolute",
        justifyContent:"center",
        alignItems:"center",
        width:"100%"
    },
    blurView:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
    },
    condBtn:{
        width:"100%"
    },
    formDiv:{
        borderRadius:30,
        height:"100%",
        paddingTop:15,
        paddingHorizontal:20
    },
    prevLabel:{
        fontSize:13,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.white
    },
    cateContainer:{
        backgroundColor:Colors.primaryBgColor.lightPrime,
        height:70,
        width:300,
        borderRadius:10,
        alignItems:"center",
        justifyContent:"center",
        paddingHorizontal:5
    },
    cateLabel:{
        color:Colors.primaryBgColor.black,
        fontFamily:"MainFont",
    },
    cateDiv:{
        gap:10,
        justifyContent:"center",
        alignItems:"center"
    },
    cateLay:{
        borderWidth:1,
        borderColor:Colors.primaryBgColor.white,
        padding:10,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:5,
        backgroundColor:Colors.primaryBgColor.babyBlue
    },
    layout:{
        display:"flex",
        marginTop:0,
        gap:10,
        borderColor:"red",
        flex:1,
        alignItems:"center", 
        justifyContent:"flex-end"
    },
    headerLabel:{
        fontSize:25,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.prime
    },
    title:{
        fontSize:17,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.prime
    },
    btnTitle:{
        fontSize:17,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.prime
    },
    scrollView:{
        backgroundColor:Colors.primaryBgColor.black,
        height:7,
        width:80,
        borderRadius:3,
        marginBottom:10
    },

})

export default ModalTransactions