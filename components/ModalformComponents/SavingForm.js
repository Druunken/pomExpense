import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import numberValidation from '@/services/numberInputValidation'
import db from '@/services/serverSide'
import { Colors } from '@/constants/Colors'
import NumberInput from '../NumberInput'
import CondBtn from '../CondBtn'

const SavingForm = ({ setPointer, pointerSeen, setPointerSeen, prevIncome, setPrevGoal, prevGoal }) => {
  const [savingGoalVal,setSavingGoalVal] = useState("")
  const incomeNum = numberValidation.convertToNumber(prevIncome)
  const isNull = numberValidation.convertToNumber(savingGoalVal) === 0
  const isBigger = numberValidation.convertToNumber(savingGoalVal) >= incomeNum
  const [isOnFocus,setIsOnFocus] = useState(false)
  const validationInput = isNull || isBigger
  const isSeen = pointerSeen[7] !== 1
  

  useEffect(() => {
    console.log("here")
  },[isOnFocus])

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardDiv} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
      <View>
        <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:20}}>Enter a Saving Goal</Text>
      </View>
      <View style={styles.validationDiv}>
        {isBigger && (
          <Text style={{fontSize:25,color:Colors.primaryBgColor.brown,textAlign:"center"}}>The Goal should be Under {numberValidation.converToString(incomeNum)}</Text>
        )}
      </View>
      {!isOnFocus && (
        <View style={{justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:Colors.primaryBgColor.white,fontFamily:"MainFont",fontSize:15}}>This Feature will be reseted on the first calendar day. You will be asked for a new Goal!</Text>
          <Text style={{color:"gray",fontFamily:"MainFont",fontSize:14,marginTop:50}}>It will help you to keep a solid goal</Text>
          <Text style={{color:Colors.primaryBgColor.babyBlue,fontFamily:"MainFont",fontSize:14}}>Still, you should Enjoy:)</Text>
        </View>
      )}
        
      <NumberInput setIsOnFocus={setIsOnFocus} state={savingGoalVal} setState={setSavingGoalVal} secState={false} style={styles.input} onPress={() => {}}/>

      <View style={{flexDirection:"row",gap:10}}>
        <CondBtn cond={validationInput} label={"Save"} type={"confirm"} onPress={() =>{
          const actualVal = numberValidation.convertToNumber(savingGoalVal)
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