import { View, Text, Modal, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from '@/constants/Colors'
import SwitchBtn from './SwitchBtn'
import NumberInput from './NumberInput'
import TitleInput from '@/components/TitleInput'
import CondBtn from './CondBtn'
import db from '@/services/serverSide'
import numberValidation from '@/services/numberInputValidation'
import { usersBalanceContext } from "@/hooks/balanceContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import GenreButton from './GenreButton.js'
import GenreComponent from './GenreComponent.js'

const ModalTransactions = ({ visible, setVisible, expenseMode, setExpenseMode, editMode, value, setValue, balanceFade, setEditMode, editId }) => {
    const [amount,setAmount] = useState("")
    const [prevAmount,setPrevAmount] = useState("")
    const [title,setTitle] = useState("")
    const [cate,setCate] = useState("")
    const [editDate,setEditDate] = useState("")
    const [pressed,setPressed] = useState(false)
    const [id,setId] = useState(0)
    const [readyRender,setReadyRender] = useState(false)

    const [genreModalVisible,setGenreModalVisible] = useState(false)

    const { setMarkedDates } = useContext(usersBalanceContext) 

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

    const getCate = (type) => {
        switch(type){
            case "Food":
            setId(1)
            break

            case "Drink":
            setId(2)
            break

            case "Education":
            setId(3)
            break

            case "Shopping":
            setId(4)
            break

            default:
            setId(0)
            break
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
            getCate(transaction.type)
            setEditDate(transaction.date)
            if(transaction.balanceType === "minus") setExpenseMode(true)
            else setExpenseMode(false)
            setPressed(true)
            setReadyRender(true)
        } catch (error) {
            console.error(error)
        }
    }


    /* animate values */

    const currOpacity = useSharedValue(1)
    const prevOpacity = useSharedValue(0)

    const currY = useSharedValue(20)
    const prevY = useSharedValue(50)

    const animatedCurr = useAnimatedStyle(() => {
        return{
            opacity: currOpacity.value,
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
        if(amount.length > 0){
            destinatedAnimation(1,0,300,prevOpacity,prevY)
            destinatedAnimation(1,60,300,currOpacity,currY)
        }
        else if(amount.length < 1 && visible){
            destinatedAnimation(0,50,300,prevOpacity,prevY)
            destinatedAnimation(1,0,300,currOpacity,currY)
        }
    },[amount])

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
        <GenreComponent visible={genreModalVisible} setVisible={setGenreModalVisible} setCate={setCate}/>
        <View style={styles.blurView} blurAmount={5} blurType='light' />
        <View style={[styles.container,{paddingTop:inset.top}]}>
            <View style={styles.formDiv}>
                {/* The placeholder for touch event */}
                <View style={{justifyContent:"center",alignItems:"center"}}>
                    <View style={styles.scrollView}></View>
                </View>
                <View style={styles.infoDiv}>
                    <Animated.View style={[animatedPrev,styles.prevView]}>
                        <Text style={{fontSize:22,fontFamily:"MainFont",color:Colors.primaryBgColor.gray}}>Previous Balance: </Text>  
                        <Text style={{fontSize:22,fontFamily:"MainFont",color:Colors.primaryBgColor.gray}}>{value}</Text> 
                     </Animated.View>
                     <Animated.View style={[animatedCurr, { justifyContent:"center",alignItems:"center" }]}>
                    <Text style={{fontSize:35,fontFamily:"MainFont",color:isValueChanged() && expenseMode ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.newPrime}}>Current Balance</Text>
                    <Text style={{fontSize:35,fontFamily:"MainFont",color:isValueChanged() && expenseMode ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.newPrime}}>{showChangedValue()}</Text>
                    </Animated.View>
                </View>

                <View style={styles.layout}>
                    <View style={{alignItems:"center"}}>
                        <Text style={styles.btnTitle}>{expenseMode ? "Expense" : "Income"}</Text>
                        <SwitchBtn active={expenseMode} setActive={editMode ? undefined : setExpenseMode}/>
                    </View>
                    <View style={{}}>
                        <View style={{}}>
                            <Text style={styles.title}>Set title</Text>
                        </View>
                        <TitleInput state={title} setState={setTitle}/>
                    </View>
                    <View style={{}}>
                        <Text style={styles.title} >Set amount</Text>
                        <NumberInput autoFocus={false} state={amount} setState={setAmount}/>
                    </View>

                    <View style={{gap:5, opacity: expenseMode ? 1 : 0,marginTop:80}}>
                        <GenreButton setVisible={setGenreModalVisible}/>
                        {/* <View style={[styles.cateContainer,{ }]}>
                            {expenseMode && (
                                <ScrollView horizontal contentContainerStyle={styles.cateDiv}>
                                    <TouchableOpacity onPress={(el) => {
                                        setCate("Food")
                                        setId(1)
                                        setPressed(true)
                                    }}  value style={[styles.cateLay, {backgroundColor: pressed && id === 1 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
                                        <Text style={styles.cateLabel}>Food</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={(el) => {
                                        setCate("Drink")
                                        setId(2)
                                        setPressed(true)
                                    }}  style={[styles.cateLay, {backgroundColor: pressed && id === 2 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
                                        <Text style={styles.cateLabel}>Drink</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={(el) => {
                                        setCate("Education")
                                        setId(3)
                                        setPressed(true)
                                    }}  style={[styles.cateLay, {backgroundColor: pressed && id === 3 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
                                        <Text style={styles.cateLabel}>Education</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={(el) => {
                                        setCate("Shopping")
                                        setId(4)
                                        setPressed(true)
                                    }}  style={[styles.cateLay, {backgroundColor: pressed && id === 4 ? Colors.primaryjBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
                                        <Text style={styles.cateLabel}>Shopping</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            )}
                        </View> */}
                    </View>
                </View>
                

                <View style={{justifyContent:"center",alignItems:"center", gap:10, paddingBottom:inset.bottom}}>
                    <CondBtn cond={expenseInputValid || incomeINputValid} type={"confirm"} label={expenseMode ? "Add Expense" : "Add Income"} style={styles.condBtn} onPress={() => {
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
                            db.saveData(title, -actualVal, cate, "minus","none");
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
                        
                        
                        console.log("Transaction mode: ",expenseMode ? "expense" : "income")


                        //reset
                        setId(0)
                        setPressed(false)
                        setVisible(false)
                        setEditMode(false)
                    }}/>
                    <CondBtn label={"Cancel"} type={"cancel"} style={styles.condBtn} onPress={() => {

                        //reset
                        setId(0)
                        setCate("")
                        setPressed(false)
                        setVisible(false)
                        setEditMode(false)
                    }}/>
                </View> 
            </View>
        </View>
        
    </Modal>
  )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        opacity:1,
        position:"absolute",
        top:"0%",
        backgroundColor:Colors.primaryBgColor.newPrime
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
        backgroundColor:'rgba(0, 0, 0, 0.9)'
    },
    condBtn:{
        width:"100%"
    },
    formDiv:{
        borderRadius:8,
        backgroundColor:"black",
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
        gap:15,
        borderColor:"white",
        flex:1,
        alignItems:"center"
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
        backgroundColor:Colors.primaryBgColor.white,
        height:7,
        width:80,
        borderRadius:3,
        marginBottom:10
    },

})

export default ModalTransactions