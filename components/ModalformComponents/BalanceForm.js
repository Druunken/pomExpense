import { KeyboardAvoidingView, StyleSheet, Text, View, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import numberValidation from '@/services/numberInputValidation'
import db from '@/services/serverSide'
import { Colors } from '@/constants/Colors'
import { usersBalanceContext } from "@/hooks/balanceContext";
import NumberInput from '../NumberInput'
import CondBtn from '../CondBtn'
import Icon from 'react-native-vector-icons/MaterialIcons'


const BalanceForm = ({ setPointer, setPointerSeen, prevVal, setPrevVal, pointerSeen }) => {
  
  const { value,setValue } = useContext(usersBalanceContext)
  const [numberFocus,setNumberFocus] = useState(false)

  const isSeen = pointerSeen[7] !== 1


  return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardDiv} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
          <View style={{justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:20}}>Enter your starting balance</Text>
            <Text style={styles.label}>Count every penny and enter that value right here :)</Text>
          </View>
          <NumberInput setIsOnFocus={setNumberFocus} isOnFocus={numberFocus} autoFocus={false} state={value} setState={setValue} secState={false} style={styles.input}/>
          <CondBtn cond={value === "" ? true : false} label={"Save"} type={"confirm"} onPress={() =>{
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
    flex:1
  },
  labelContainer:{
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    paddingTop:10,
    position:"absolute",
    top:0
  },
  labelDiv:{
    paddingHorizontal:50,
    backgroundColor:Colors.primaryBgColor.prime,
    width:300,
    justifyContent:"center",
    alignItems:"center",
    paddingTop:8,
    paddingBottom:15,
    paddingHorizontal:20,
    borderRadius:20,
  },
  label:{
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.babyBlue,
    fontSize:15,
    textAlign:"center"
  },
  keyboardDiv:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    gap:20
  },
})