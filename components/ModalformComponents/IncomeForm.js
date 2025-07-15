import { KeyboardAvoidingView, StyleSheet, Text, View, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import numberValidation from '@/services/numberInputValidation'
import db from '@/services/serverSide'
import { Colors } from '@/constants/Colors'
import { incomeActiveContext } from "@/hooks/balanceContext";
import NumberInput from '../NumberInput'
import CondBtn from '../CondBtn'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CalendarPick from '../CalendarPick'

const IncomeForm = ({ setPointer, setPointerSeen, pointerSeen, prevIncome, setPrevIncome }) => {

  const { 
    automateIncomeDay,setAutomateIncomeDay,
    currentIncome,setCurrentIncome,
    incomeActive,setIncomeActive
  } = useContext(incomeActiveContext)


  const [incomeAddup,setIncomeAddup] = useState(false)
  const [isOnFocus,setIsOnFocus] = useState(false)

  const isSeen = pointerSeen[7] !== 1

  
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardDiv} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
      <View style={{gap:15,justifyContent:"center",alignItems:"center"}}>
        <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:20}}>Enter your monthly Income</Text>
        <Text style={styles.label}>Collect all your hustle, even sides and enter that here</Text>
        <NumberInput setIsOnFocus={setIsOnFocus} isOnFocus={isOnFocus} autoFocus={false} state={currentIncome} setState={setCurrentIncome} secState={false} style={styles.input} onPress={() => {}}/>
      </View>

      {/* {!isOnFocus && (
        <View style={styles.bouncyDiv}>
        {!prevIncome &&  (
          <BouncyCheckbox
          text="Add up to balance"
          textStyle={{textDecorationLine:"none",color: incomeAddup ? Colors.primaryBgColor.babyBlue : "gray"}}
          fillColor={Colors.primaryBgColor.prime}
          style={{flexDirection:"row",height:50,justifyContent:"center",alignItems:"center"}}
          onPress={(el) => {
            setIncomeAddup((prev) => !prev)
          }}
          isChecked={incomeAddup}
        />
        )}
  
          <BouncyCheckbox
            text={!incomeActive ? "Automate this Expense" : `Choosen Income day: ${automateIncomeDay}`}
            textStyle={{textDecorationLine:"none",color: incomeActive ? Colors.primaryBgColor.babyBlue : "gray"}}
            fillColor={Colors.primaryBgColor.prime}
            style={{flexDirection:"row",height:50,justifyContent:"center",alignItems:"center"}}
            onPress={(el) => {
              setIncomeActive((prev) => !prev)
            }}
            isChecked={incomeActive}
          />
        </View>
      )} */}
      {!isOnFocus && (
        <CalendarPick day={automateIncomeDay} setDay={setAutomateIncomeDay}/>
      )}
      {!isOnFocus && (
        <View style={{flexDirection:"row",gap:10}}>
        <CondBtn cond={currentIncome.length < 1} label={"Save"} type={"confirm"} onPress={() =>{
          const actualVal = numberValidation.convertToNumber(currentIncome)
          const fixedVal = numberValidation.converToString(actualVal)
          setPrevIncome(fixedVal)
          db.createIncome(actualVal,automateIncomeDay)
          if(pointerSeen[7] === 1){
            setPointer(7)
            setPrevIncome(fixedVal)
          }else {
            setPointer(prev => prev + 1)
            setPointerSeen((prev) => {
            const copy = prev
            copy[3] = 1
            return copy
          })
          } 

          if(incomeAddup){
            db.positiveBalance(actualVal,false)
            db.saveData("Income Automation",actualVal,"income","plus","income")
            const actualValue = numberValidation.convertToNumber(value)
            const calc = actualValue + actualVal
            const convertStr = numberValidation.converToString(calc)
            setValue(convertStr)
          } 

        }}/>
        <CondBtn cond={false} label={"Skip"} type={""} onPress={() => {
          setPointer(prev => prev + 1)
          setPointerSeen((prev) => {
            const copy = prev
            copy[3] = 1
            return copy
          })
        }}/>
      </View>
      
      )}
      </KeyboardAvoidingView>
      </View>
  )
}

export default IncomeForm

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  keyboardDiv:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    gap:50,
  },
  bouncyDiv:{
    width:300
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
})