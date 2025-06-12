import { View, Text, Modal, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import NumberInput from '../NumberInput.js'
import TitleInput from '@/components/TitleInput'
import CondBtn from '../CondBtn'
import db from '@/services/serverSide'
import numberValidation from '@/services/numberInputValidation'
import { usersBalanceContext, incomeActiveContext } from "@/hooks/balanceContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import GenreButton from '../GenreButton.js'
import GenreComponent from '../GenreComponent.js'
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native'
import numberInputValidation from '@/services/numberInputValidation'

const { height } = Dimensions.get("window") 

const TransactionModal = ({ visible, setVisible, id, setId }) => {
    const [amount,setAmount] = useState("")
    const [title,setTitle] = useState("")
    const [expense,setExpense] = useState(false)
    const [cate,setCate] = useState("")
    const [date,setDate] = useState("")
    const [balanceType,setBalanceType] = useState("")

 
    const inset = useSafeAreaInsets()


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
                setDate("")
                setAmount("")
                setTitle("")
                setCate("")
                setId
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
    
    const fetchTransaction = async(id) => {
        try {
            const transaction = await db.getSingleEntry(id)
            if(!transaction) return console.log("Not found")
            console.log(transaction)

            const convertStr = numberValidation.converToString(transaction.moneyValue)
            setTitle(transaction.value)
            setAmount(convertStr)
            setExpense(transaction.balanceType === "minus")
            setCate(transaction.type)
            setDate(transaction.date)
            setBalanceType(transaction.balanceType === "minus" ? "Expense" : "Income")
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
                [Colors.primaryBgColor.babyBlue, Colors.primaryBgColor.lightGray]
            ),
            opacity:layoutOp.value
        }
    })

    useEffect(() => {
        if(visible){
            containerBg.value = withTiming(0,{ duration:1000 })
            layoutY.value = withSpring(0,{damping:13})
            layoutOp.value = 1
            passedOp.value = 0
            passedY.value = -150
            console.log(id,"The id given")
            fetchTransaction(id)
        }
    },[visible])


   return (
    <View style={{}}>
        <Modal animationType="none" transparent={true} visible={visible}>
            <Animated.View style={[styles.container,animatedContainer,{paddingTop:inset.top}]}>
                
                <Animated.View style={[styles.formDiv,animatedLayout]}>

                    <View onTouchStart={(ev) => pressedLayout(ev)} style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={styles.scrollView}/>
                    </View>
                    <View style={[styles.layout,{}]}>
                        <View style={styles.elementDiv}>
                            <Text style={styles.label}>Title</Text>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.elementDiv}>
                            <Text style={styles.label}>Amount</Text>
                            <Text style={[styles.title,{color: expense ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.prime}]}>{amount}</Text>
                        </View>
                        <View style={styles.elementDiv}>
                            <Text style={styles.label}>Title</Text>
                            <Text style={styles.title}>{cate}</Text>
                        </View>
                        <View style={styles.elementDiv}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.title}>{date}</Text>
                        </View>
                        <View style={styles.elementDiv}>
                            <Text style={styles.label}>Transaction Type</Text>
                            <Text style={styles.title}>{balanceType}</Text>
                        </View>
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
    elementDiv:{

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
        paddingHorizontal:20,
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
        gap:30
    },
    headerLabel:{
        fontSize:25,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.prime
    },
    title:{
        fontSize:45,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.prime
    },
    label:{
        fontSize:30,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black
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
export default TransactionModal