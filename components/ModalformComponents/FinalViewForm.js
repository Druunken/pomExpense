import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { usersBalanceContext } from "@/hooks/balanceContext"
import inputConverter from '@/services/numberInputValidation'
import FinalView from '@/components/ModalformComponents/FinalView'

const FinalViewForm = ({
    prevVal,
    prevIncome,
    prevGoal,
    prevUsername,
    prevCurrency,
    setPointer,
    setPointerSeen,
}) => {

    const { setValue, currency, fixedCostAmount } = useContext(usersBalanceContext)


    const [isGoalBig,setIsGoalBig] = useState(incomeNum <= goalNum)

    const incomeNum = inputConverter.convertToNumber(prevIncome)
    const goalNum = inputConverter.convertToNumber(prevGoal)
    const biasGoal = isGoalBig ? Colors.primaryBgColor.persianRed :Colors.primaryBgColor.prime

    useEffect(() => {
        setIsGoalBig(incomeNum <= goalNum)
    },[prevIncome,prevGoal])

    useEffect(() => {
        setPointerSeen(prev => {
          const copy = prev
          copy[7] = 1
          return copy
        })
      },[])



  return (
    <View style={styles.container}>
        <FinalView onPress={() => setPointer(1)} label={"Currency"} item={currency}  bgColor={Colors.primaryBgColor.brown} frColor={Colors.primaryBgColor.prime} />
        <FinalView onPress={() => setPointer(2)} label={"Balance"} item={prevVal} currency={currency} bgColor={Colors.primaryBgColor.primeLight} frColor={Colors.primaryBgColor.brown} />
        <FinalView onPress={() => setPointer(3)} label={"Income"} item={prevIncome} currency={currency} bgColor={Colors.primaryBgColor.persianRed} frColor={Colors.primaryBgColor.primeLight} />
        <FinalView onPress={() => setPointer(4)} label={"Fixed Costs"} item={fixedCostAmount} currency={currency} bgColor={Colors.primaryBgColor.lightPrime} frColor={Colors.primaryBgColor.persianRed} />
        <FinalView onPress={() => setPointer(5)} label={"Saving Goal"} item={prevGoal} currency={currency} bgColor={Colors.primaryBgColor.gray} frColor={Colors.primaryBgColor.lightPrime} />
        <FinalView onPress={() => setPointer(6)} label={"Username"} item={prevUsername} bgColor={"rgba(0, 0, 0, 0.9)"} frColor={Colors.primaryBgColor.gray} />
       
       <View style={styles.warnDiv}>
            <Text style={styles.warnLabel} >{isGoalBig ? "Saving Goal is to high" : ""}</Text>
       </View>
        <View style={{justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity disabled={isGoalBig} style={[styles.finishBtn,{opacity:isGoalBig ? 0.5 : 1}]} onPress={() => {
                setPointer(8)
                setValue(prevVal)
            }}>
                <Text style={styles.btnLabel}>Ready!</Text>
            </TouchableOpacity>
        </View>

        
    </View>
  )
}

export default FinalViewForm

const styles = StyleSheet.create({
    container:{
        width:"100%",
        alignItems:"center",
        height:"100%",
    },
    finishBtn:{
        backgroundColor:Colors.primaryBgColor.prime,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:25,
        height:70,
        width:300
    },
    warnDiv:{
        width:"100%",
        paddingHorizontal:20,
        paddingVertical:10
    },
    warnLabel:{
        fontSize:17,
        color:Colors.primaryBgColor.persianRed,
        fontFamily:"MainFont",
    },
    infoDiv:{
        justifyContent:"center",
        alignItems:"center"
    },
    btnLabel:{
        fontSize:18,
        color:Colors.primaryBgColor.white,
        fontFamily:"MainFont"
    },
    label:{
        fontSize:35,
        color:Colors.primaryBgColor.lightPrime,
        fontFamily:"MainFont",
        textAlign:"center"
    },
    val:{
        fontSize:17,
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont"
    },
    balanceDiv:{
        
    },
    valDiv:{
        width:300,
        borderWidth:3,
        borderColor:Colors.primaryBgColor.lightPrime,
        height:80,
        borderRadius:10,
        justifyContent:"space-between",
        alignItems:"center",
        padding:3,
        flexDirection:"row",
        paddingHorizontal:15
    },
    title:{
        fontSize:23,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.white
    },
})