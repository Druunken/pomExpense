import { KeyboardAvoidingView, StyleSheet, Text, View, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import numberValidation from '@/services/numberInputValidation'
import db from '@/services/serverSide'
import { Colors } from '@/constants/Colors'
import { usersBalanceContext } from "@/hooks/balanceContext";
import NumberInput from '../NumberInput'
import CondBtn from '../CondBtn'


const BalanceForm = ({ setPointer, setPointerSeen, prevVal, setPrevVal, pointerSeen }) => {
  
  const { value,setValue } = useContext(usersBalanceContext)
  const isSeen = pointerSeen[7] !== 1

  return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardDiv} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
          <View>
            <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:20}}>Enter your starting balance</Text>
          </View>
          <NumberInput autoFocus={false} state={value} setState={setValue} secState={false} style={styles.input}/>
          <CondBtn cond={value.toString().length < 1} label={"Save"} type={"confirm"} onPress={() =>{
              const actualVal = numberValidation.convertToNumber(value)
              const fixedVal = numberValidation.converToString(actualVal)
              setPrevVal(fixedVal)
              setValue(fixedVal)

              db.positiveBalance(actualVal,true)
              db.updateMonthsBalance(actualVal)
              if(pointerSeen[7] === 1){
                console.log(prevVal)
                setPointer(7)
                setPrevVal(fixedVal)
              }else {
                setPointer(prev => prev + 1)
                setPointerSeen((prev) => {
                const copy = prev
                copy[2] = 1
                return copy
              })
              }
            }}/>
          </KeyboardAvoidingView>
    </View>
  )
}

export default BalanceForm

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  keyboardDiv:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    gap:20
  },
})