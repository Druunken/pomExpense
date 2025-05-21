import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import numberValidation from '@/services/numberInputValidation'
import { usersBalanceContext } from "@/hooks/balanceContext"
import db from '@/services/serverSide'
import { Colors } from '@/constants/Colors'
import NumberInput from '../NumberInput'
import CondBtn from '../CondBtn'

const SavingForm = ({ setPointer, pointerSeen, setPointerSeen, prevIncome, setPrevGoal, prevGoal }) => {
  const { fixedCostAmount, savingVal, setSavingVal } = useContext(usersBalanceContext)
  const incomeNum = numberValidation.convertToNumber(prevIncome)
  const isNull = numberValidation.convertToNumber(savingVal) === 0
  const isBigger = numberValidation.convertToNumber(savingVal) > incomeNum - Math.abs(numberValidation.convertToNumber(fixedCostAmount))
  const [isOnFocus,setIsOnFocus] = useState(false)
  const validationInput = isNull || isBigger
  const isSeen = pointerSeen[7] !== 1
  


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardDiv} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
      <View>
        <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:20}}>Enter a Saving Goal</Text>
      </View>
      <View style={styles.validationDiv}>
        {isOnFocus && (
          <View style={{justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:Colors.primaryBgColor.white,fontFamily:"MainFont",fontSize:15}}>This Goal must be under</Text>
            <Text style={{color:Colors.primaryBgColor.newPrime,fontFamily:"MainFont",fontSize:25}}>{numberValidation.converToString(incomeNum - Math.abs(numberValidation.convertToNumber(fixedCostAmount)))}</Text>
          </View>
        )}
      </View>
      {!isOnFocus && (
        <View style={{justifyContent:"center",alignItems:"center",borderWidth:0}}>
          <View style={{justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:Colors.primaryBgColor.white,fontFamily:"MainFont",fontSize:15}}>This Goal should be under</Text>
            <Text style={{color:Colors.primaryBgColor.newPrime,fontFamily:"BoldFont",fontSize:25}}>{numberValidation.converToString(incomeNum - Math.abs(numberValidation.convertToNumber(fixedCostAmount)))}</Text>
          </View>
          <Text style={{color:"gray",fontFamily:"MainFont",fontSize:14,marginTop:50}}>It will help you to keep a solid saving over time</Text>
          <Text style={{color:Colors.primaryBgColor.babyBlue,fontFamily:"MainFont",fontSize:14}}>Still, you should Enjoy:)</Text>
        </View>
      )}
        
      <NumberInput isOnFocus={isOnFocus} setIsOnFocus={setIsOnFocus} state={savingVal} setState={setSavingVal} secState={false} style={styles.input} onPress={() => {}}/>

      <View style={{flexDirection:"row",gap:10}}>
        <CondBtn cond={validationInput} label={"Save"} type={"confirm"} onPress={() =>{
          const actualVal = numberValidation.convertToNumber(savingVal)
          const fixed = numberValidation.converToString(actualVal)
          db.createSavingGoal(actualVal)
          if(pointerSeen[7] === 1){
            setPointer(7)
            setPrevGoal(fixed)
          }else {
            setPrevGoal(fixed)
            setPointer(prev => prev + 1)
            setPointerSeen((prev) => {
            const copy = prev
            copy[5] = 1
            return copy
          })
          }
        }}/>
        <CondBtn cond={false} label={"Skip"} type={""} onPress={() => {
          setPrevGoal("None")
          setPointer(prev => prev + 1)
          setPointerSeen((prev) => {
            const copy = prev
            copy[5] = 1
            return copy
          })
        }}/>
    </View>
    </KeyboardAvoidingView>
    </View>
  )
}

export default SavingForm

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  validationDiv:{
    justifyContent:"center",
    alignItems:"center",
    textAlign:"center"
  },
  keyboardDiv:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    gap:10,
    paddingHorizontal:30
  },
})