import { View, Text, StyleSheet, TextInput,Modal, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { Colors } from '@/constants/Colors'

import db from '../services/serverSide.js'

import CondBtn from '@/components/CondBtn';
import SwitchBtn from './SwitchBtn.tsx';
import { incomeActiveContext, usersBalanceContext } from '../hooks/balanceContext.tsx'
import CalendarPick from '../components/CalendarPick.tsx';
import NumberInput from './NumberInput.js';
import numberValidation from '@/services/numberInputValidation.js'


const UserInput = ({ label,type, onPress }) => {
    const {
      incomeActive, setIncomeActive,
      automateIncomeDay,setAutomateIncomeDay,
      savingGoalActive,setSavingGoalActive
    } = useContext(incomeActiveContext)

    const { currency, setCurrency, username, setUsername} = useContext(usersBalanceContext)


    const [income,setIncome] = useState("")
    const [pressed,setPressed] = useState(false)
    const [userPressed,setUserPressed] = useState(false)
    const [savingGoal,setSavingGoal] = useState("")
    const [incomeProcess,setIncomeProcess] = useState(true)
    const [incomeInputFocus,setIncomeInputFocus] = useState(false)
    const [savingInputFocus,setSavingInputFocus] = useState(false)

      

    const validation = (type:string) => {
        if(type === "username"){
            return "Current username"
        }else if(type === "currency"){
            return "Current currency"
        }else if(type === 'income'){
            if(incomeActive) return "Current Income"
            else return ""
        }else if(type === "savingGoal"){
            if(savingGoalActive) return "Current saving goal"
            else return ""
        }
    }
    

    const disableBtn = (type:string) => {
        if(label === type) return true
        else return false
    }

    useEffect(() => {
        const updateCurrency = async() => {
            try {
                if(pressed){
                    const data = await db.convertCurrency(currency,label)
                    setPressed(false)
                }
            } catch (error) { 
              console.error(error)
            }
          }
          updateCurrency()
    },[pressed])

    useEffect(() => {
        const updateName = async() => {
            try {
                if(userPressed){
                    await db.updateUsername(username)
                    setUserPressed(false)
                }
            } catch (error) {
              console.error(error)
            }
          }
        updateName()
    },[userPressed])

  return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{alignItems:"center"}}>
                <Text style={styles.label}>{validation(type)}</Text>
                <Text style={[styles.label,{color:Colors.primaryBgColor.lightGray}]}>{
                  (type === "income" && !incomeActive) || (type === "savingGoal" && !savingGoalActive)  ? "" : numberValidation.converToString(label)
                  } {type === "currency" || type === "username" ? label : ""}</Text>
            </View>
            {type === "currency" && (
                <View style={{
                    flexDirection:"row",
                    gap:20,
                    flexWrap:"wrap",
                    justifyContent:"center",
                    alignItems:"center",
                  }}>
                  <TouchableOpacity
                    style={[styles.input, {backgroundColor: disableBtn("€") ? Colors.primaryBgColor.prime : "white"}]}
                    onPress={ async() => {
                      setCurrency("€")
                      setPressed(true)

                      onPress()
                    }}
                    disabled={disableBtn("€")}
                  >
                    <Text style={[styles.btnText, {backgroundColor: disableBtn("€") ? Colors.primaryBgColor.prime : "white"}]}>€</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.input, {backgroundColor: disableBtn("$") ? Colors.primaryBgColor.prime : "white"}]}
                    onPress={ async() => {
                      setCurrency("$")
                      setPressed(true)
                      onPress()
                    }}
                    disabled={disableBtn("$")}
                  >
                    <Text style={[styles.btnText, {backgroundColor: disableBtn("$") ? Colors.primaryBgColor.prime : "white"}]}>$</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.input, {backgroundColor: disableBtn("¥") ? Colors.primaryBgColor.prime : "white"}]}
                    onPress={ async() => {
                      setCurrency("¥")
                      setPressed(true)
                      onPress()
                    }}
                    disabled={disableBtn("¥")}
                  >
                    <Text style={[styles.btnText, {backgroundColor: disableBtn("¥") ? Colors.primaryBgColor.prime : "white"}]}>¥</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.input, {backgroundColor: disableBtn("₩") ? Colors.primaryBgColor.prime : "white"}]}
                    onPress={ async() => {
                      setCurrency("₩")
                      setPressed(true)
                      onPress()
                    }}
                    disabled={disableBtn("₩")}
                  >
                    <Text style={[styles.btnText, {backgroundColor: disableBtn("₩") ? Colors.primaryBgColor.prime : "white"}]}>₩</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.input, {backgroundColor:Colors.primaryBgColor.persianRed,marginTop:100}]}
                    onPress={ async() => {
                      onPress()
                    }}
                  >
                    <Text style={[styles.btnText, {backgroundColor:Colors.primaryBgColor.persianRed}]}>Go back</Text>
                  </TouchableOpacity>

                  </View>
            )}
            {type == "username" && (
                <>
                <TextInput placeholder='New username..' placeholderTextColor={"black"} style={styles.input} value={username}
                    onChangeText={(txt) => setUsername(txt)}
                ></TextInput>
                <View style={styles.btnContainer}>
                <CondBtn type={"confirm"} label={"Confirm"} onPress={() => {
                    setUserPressed(true)
                    onPress()
                }}/>
                <CondBtn type={"decline"} label={"Go back"} onPress ={() => {
                    onPress()
                }}/>
            </View>
                </>
                
            )}

            {type == "income" && (
                <>
                {incomeActive && (
                  <NumberInput state={income} setState={setIncome} setIsOnFocus={setIncomeInputFocus}/>
                )}
                  
                  <View style={{display:incomeInputFocus ? "none" : "flex"}} >
                    <SwitchBtn label={'Automated Income'} active={incomeActive} setActive={setIncomeActive}/>
                  </View>

                  {incomeActive && (
                  <View style={{display:incomeInputFocus ? "none" : "flex"}} >
                    <SwitchBtn label={'Mark this as Processed'} active={incomeProcess} setActive={setIncomeProcess}/>
                  </View>
                  )}
                  {incomeActive && (
                    <View style={{display:incomeInputFocus ? "none" : "flex"}}>
                    <CalendarPick day={automateIncomeDay} setDay={setAutomateIncomeDay}/>
                  </View>
                  )}
                  <View style={[styles.btnContainer,{display:incomeInputFocus ? "none" : "flex"}]}>
                      <CondBtn cond={
                        incomeActive && income <= 0 || automateIncomeDay === null
                      } type={"confirm"} label={"Save"} onPress={() => {
                        const actualVal = numberValidation.convertToNumber(income)

                        if(incomeActive){
                          db.updateIncome(incomeActive,actualVal,automateIncomeDay,incomeProcess)
                          onPress()
                        }
                        else if(!incomeActive){
                          db.updateIncome(incomeActive,null,null,null)
                          onPress()
                        }
                        
                    }}/>
                    <CondBtn type={"decline"} label={"Go back"} onPress ={() => {
                      onPress()
                  }}/>
                  </View>
                </>
                
            )}

            {type === "savingGoal" && (
              <>
              {!incomeActive && (
                <View style={{justifyContent:"center",alignItems:"center",gap:5}}>
                  <Text style={{fontSize:13,fontFamily:"MainFont", color:Colors.primaryBgColor.prime,marginBottom:15}}>Home - Settings - Change Income</Text>
                  <Text style={{fontSize:16,fontFamily:"MainFont", color:Colors.primaryBgColor.babyBlue}}>If you want a Saving Goal</Text>
                  <Text style={{fontSize:20,fontFamily:"MainFont", color:Colors.primaryBgColor.persianRed, textAlign:"center",marginBottom:50}}>You have to activate Income Function</Text>
                  <CondBtn type={"decline"} label={"Go back"} onPress ={() => {
                      onPress()
                  }}/>
                </View>
              )}
              {incomeActive && (
                <>
                {savingGoalActive && (
                <NumberInput state={savingGoal.toString()} setState={setSavingGoal} setIsOnFocus={setSavingInputFocus}/>
              )}
              <View style={{display: savingInputFocus ? "none" : "flex"}}>
                <SwitchBtn label={'Automated saving goal'} active={savingGoalActive} setActive={setSavingGoalActive}/>
              </View>
              {savingGoalActive && (
                <View style={{alignItems:"center",display: savingInputFocus ? "none" : "flex"}}>
                  <Text style={{fontSize:15,color:Colors.primaryBgColor.white,fontFamily:"MainFont"}}>The outcome will be on the income day</Text>
                  <Text style={{fontSize:14,color:Colors.primaryBgColor.babyBlue,fontFamily:"MainFont"}}>Otherwise on the first month day</Text>
              </View>
              )}

              <View style={[styles.btnContainer,{display: savingInputFocus ? "none" : "flex"}]}>
                      <CondBtn cond={
                        savingGoalActive && savingGoal <= 0
                      } type={"confirm"} label={"Save"} onPress={() => {
                        const actualVal = numberValidation.convertToNumber(savingGoal)
                        if(savingGoalActive){
                          db.updateSavingGoal(savingGoalActive,actualVal)
                          onPress()
                        }else{
                          db.updateSavingGoal(savingGoalActive,null)
                          onPress()
                        }
                        
                    }}/>
                    <CondBtn type={"decline"} label={"Go back"} onPress ={() => {
                      onPress()
                  }}/>
                  </View>
                </>
              )}
              
              </>
            )}
        </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent:"center",
        alignItems:"center",
        gap:20
    },
    layout:{
        flexDirection:"row",
        gap:20,
        flexWrap:"wrap",
        justifyContent:"center",
        alignItems:"center",
    },
    input:{
        borderWidth:1,
        width:100,
        height:50,
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        fontFamily:"MainFont",
        borderRadius:10,
        fontSize:20,
        backgroundColor:"white",
        color:"black",
        minWidth:200,
      },
    modal:{
    },
    label:{
        color:Colors.primaryBgColor.prime,
        fontFamily:"BoldFont",
        fontSize:20
    },
    btnText:{
        fontSize:20,
        backgroundColor:"white",
        color:"black",
        fontFamily:"MainFont"
      },
    btnContainer:{
        flexDirection:"row",
        gap:15,
    },
})

export default UserInput