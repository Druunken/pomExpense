import { KeyboardAvoidingView, Modal, StyleSheet, Text, View, Platform, StatusBar } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CurrencyForm from '@/components/ModalformComponents/CurrencyForm'
import BalanceForm from '@/components/ModalformComponents/BalanceForm'
import IncomeForm from '@/components/ModalformComponents/IncomeForm'
import SavingForm from '@/components/ModalformComponents/SavingForm'
import FixedCostsForm from '@/components/ModalformComponents/FixedCostsForm'
import UsernameForm from '@/components/ModalformComponents/UsernameForm'
import FormIndicator from '@/components/FormIndicator'
import BackButtonModal from '@/components/BackButtonModal'
import ForwardBtnModal from '@/components/ForwardBtnModal'
import FinalViewForm from '@/components/ModalformComponents/FinalViewForm'
import BacktoFinal from '@/components/ModalformComponents/BacktoFinal'
import { Colors } from '@/constants/Colors';
import HeaderInfo from '@/components/ModalformComponents/HeaderInfo'
import { incomeActiveContext } from "@/hooks/balanceContext";
import { usersBalanceContext } from "@/hooks/balanceContext"

const ModalEntryForm = ({ visible, pointer, setPointer }) => {
    const [pointerSeen,setPointerSeen] = useState({})
    const [prevVal,setPrevVal] = useState("")
    const [prevIncome,setPrevIncome] = useState("")
    const [prevGoal,setPrevGoal] = useState("")
    const [prevCurrency, setPrevCurrency] = useState("")
    const [prevUsername, setPrevUsername] = useState("")

    const { fixedCostAmount, currency } = useContext(usersBalanceContext)

    const { automateIncomeDay } = useContext(incomeActiveContext)

    const inset = useSafeAreaInsets()

    const modalY = useSharedValue(0)
    const modalX = useSharedValue(0)
    const modalOpacity = useSharedValue(1)

    const modalAnimation = useAnimatedStyle(() => ({
        opacity: modalOpacity.value,
        transform: [ { translateY: modalY.value}, {translateX: modalX.value} ],
    }))

    useEffect(() => {
        setPointerSeen({1 : 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0})
    },[])

    const backToOverview = pointer != 7 && pointerSeen[6] === 1
    const backBtnVis = pointer - 1 !== 0
    const forBtnVis = pointer + 1 < 8 && pointerSeen[pointer] === 1 

    const headerTitleValidation = () => {
        switch(pointer){
            case 1:
                return <HeaderInfo label={"Currency"} item={prevCurrency} pointer={pointer} />
            case 2:
                return <HeaderInfo label={"Balance"} item={prevVal} currency={currency} prevForm={"Currency"} pointer={pointer} />
            case 3:
                return <HeaderInfo label={"Income"} item={prevIncome} currency={prevCurrency} secondItem={automateIncomeDay} prevForm={"Balance"} pointer={pointer}  />
            case 4:
                return <HeaderInfo label={"Fixed Costs"} item={fixedCostAmount} currency={prevCurrency} minusValue={true} prevForm={"Income"} pointer={pointer} />
            case 5:
                return <HeaderInfo label={"Saving Goal"} item={prevGoal} currency={prevCurrency} prevForm={"Fixed Costs"} pointer={pointer} />
            case 6:
                return <HeaderInfo label={"Username"} item={prevUsername} prevForm={"SavingGoal"} pointer={pointer} />

        }
    }

  return (
    <View style={{}}>
        <Modal animationType='slide' transparent={true} visible={visible}>
            <View style={[styles.container]}>
                <View style={[styles.header,{height:Platform.OS === "ios" ? inset.top * 2 : 60}]}>
                    <View style={[styles.headerLayout]}>
                            {backToOverview && (
                                <BacktoFinal setPointer={setPointer} />
                            )}
                        {pointer !== 7 && (
                            <>
                                {backBtnVis && !backToOverview && (
                                    <BackButtonModal onPress={() => { setPointer(prev => prev - 1) }} />
                                )}
                                {!backBtnVis && (
                                    <View style={{width:65}}/>
                                )}
                                {!backToOverview && (
                                    <FormIndicator pointer={pointer}/>
                                )}
                                {forBtnVis && !backToOverview && (
                                    <ForwardBtnModal onPress={() => { setPointer(prev => prev + 1)}} />
                                )}
                                {!forBtnVis && (
                                    <View style={{width:65}} />
                                )}
                                
                            </>
                            )}
                            {pointer === 7 && (
                                <Text style={[styles.label,{marginTop:0}]}>Overview</Text>
                            )}
                    </View>
                </View>
                {headerTitleValidation()}
                {pointer === 1 && (
                    <CurrencyForm setPointer={setPointer} setPointerSeen={setPointerSeen} setPrevCurrency={setPrevCurrency}  pointerSeen={pointerSeen} />
                    
                )}
                {pointer === 2 && (
                    
                    <BalanceForm pointer={pointer} setPointer={setPointer} pointerSeen={pointerSeen}  setPointerSeen={setPointerSeen} prevVal={prevVal} setPrevVal={setPrevVal} />                   
                    
                    
                )}
                {pointer === 3 && (
                    
                    <IncomeForm setPointer={setPointer} setPointerSeen={setPointerSeen} pointerSeen={pointerSeen} prevIncome={prevIncome} setPrevIncome={setPrevIncome}/>                    
                    
                )}
                {pointer == 4 && (
                    
                    <FixedCostsForm inset={inset} setPointer={setPointer} setPointerSeen={setPointerSeen}/>                   
                    
                )}
                {pointer === 5 && (
                    
                        <SavingForm prevGoal={prevGoal} setPointer={setPointer} pointerSeen={pointerSeen} setPointerSeen={setPointerSeen} prevIncome={prevIncome} setPrevGoal={setPrevGoal} />
                    
                   
                )}
                {pointer === 6 && (
                    
                        <UsernameForm setPointer={setPointer} pointerSeen={pointerSeen} setPointerSeen={setPointerSeen} prevUsername={prevUsername} setPrevUsername={setPrevUsername} />
                    
                   
                )}
                {pointer === 7 && (
                        <FinalViewForm pointer={pointer} setPointer={setPointer} pointerSeen={pointerSeen} setPointerSeen={setPointerSeen}  prevIncome={prevIncome} prevCurrency={prevCurrency} prevVal={prevVal} prevGoal={prevGoal} prevUsername={prevUsername}/>
                )}
            </View>
            </Modal>
        </View>
  )
}

export default ModalEntryForm

const styles = StyleSheet.create({
    container:{
        position:"absolute",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        height:"100%",
        width: "100%",
        top:0
    },
    inputContainer:{
        alignItems:"center",
        gap:30,
        justifyContent:"center",
        height:"100%"
    },
    fixCostsDiv:{
    },
    header:{
        backgroundColor:Colors.primaryBgColor.prime,
        alignItems:"center",
    },
    headerLayout:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:10,
        backgroundColor:Colors.primaryBgColor.lightPrime,
        borderBottomRightRadius:20,
        borderBottomLeftRadius:20,
        height:"100%",
        alignItems:"flex-end",
        paddingBottom:6,
    },
    label:{
        fontSize:40,
        color:Colors.primaryBgColor.white,
        fontFamily:"MainFont",
        textAlign:"center",
        width:"100%"
    },
    
})