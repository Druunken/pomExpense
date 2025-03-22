import { View, Text, SafeAreaView, StyleSheet, Alert, Modal, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/Colors.ts'

import db from '../../services/serverSide';
import { incomeActiveContext, IncomeProvider } from "../../hooks/balanceContext"
import Buttons from '../../components/Buttons'
import UserInput from '../../components/UserInput';
import { AppInitializationContext } from '../../hooks/appContext';
import { usersBalanceContext } from "../../hooks/balanceContext"




// ** add Theme
// ** Reset Balance function missing

const settings = () => {
  const [currentUsername,setCurrentUsername] = useState("")
  const [currrentCurrency,setCurrentCurrency] = useState("")
  const [currentIncome,setCurrentIncome] = useState(0)
  const [currentGoal,setCurrentGoal] = useState(0)

  const { setFirstLaunch } = useContext(AppInitializationContext)
  const { setFixedCostAmount, setMarkedDates } = useContext(usersBalanceContext)
  const { setIncomeActive,setSavingGoalActive,setAutomateIncomeDay } = useContext(incomeActiveContext)

  const [showUsername,setShowUsername] = useState(true)
  const [showCurrency,setShowCurrency] = useState(false)
  const [showIncome,setShowIncome] = useState(false)
  const [showSavingGoal,setShowSavingGoal] = useState(false)


  const [modalVisible,setModalVisible] = useState(false)
  const [modalCurrVisible,setModalCurrVisible] = useState(false)

  const handleReset = async() => {
    try {
      const deleteTables = await db.deleteTable();
      const insertTables = await db.newOpening()
      setFixedCostAmount("0,00")
      setMarkedDates({})
      setFirstLaunch(true)
      if(deleteTables && insertTables) return true
      else return false
    } catch (error) {
      console.error("ERROR HERE")
    }
  }

  const getData = async() =>{
    try {
      const user = await db.getUsername()
      const currency = await db.getCurrency()

      const checkIncomeActive = await db.checkIncome()
      const checkSavingActive = await db.checkSavingGoal()
      const getIncomeDay = await db.incomeDay()


      setAutomateIncomeDay(getIncomeDay)
      setSavingGoalActive(checkSavingActive)
      setIncomeActive(checkIncomeActive)

      if(checkIncomeActive){
        const getIncomeVal = await db.getIncome()
        setCurrentIncome(getIncomeVal)
      }else{
        setCurrentIncome(0)
      }

      if(checkSavingActive){
        const getSavingVal = await db.getSavingGoal()
        setCurrentGoal(getSavingVal)
      }else{
        setCurrentGoal(0)
      }
      
      setCurrentUsername(user)
      setCurrentCurrency(currency)
  
    } catch (error) {
      console.error(error)
    }
  }
  

  useEffect(() => {
    getData()

  },[modalVisible,modalCurrVisible])

  
  const router = useRouter();


  return (
    <View style={styles.container}>
      {showUsername && (
        <Modal visible={modalVisible}>
          <UserInput label={currentUsername} type={"username"} onPress={() => {
            setModalVisible(false)

          }}  />
        </Modal>
      )}
      {showCurrency && (
        <Modal visible={modalCurrVisible}>
          <UserInput label={currrentCurrency} type={"currency"} onPress={() => {
            setModalCurrVisible(false)
          }}  />
        </Modal>
      )}
      {showIncome && (
        <Modal visible={modalVisible}>
            <UserInput label={currentIncome} type={"income"} onPress={() => {
              setModalVisible(false)

            }}  />
        </Modal>
      )}
      {showSavingGoal && (
        <Modal visible={modalVisible}>
            <UserInput label={currentGoal} type={"savingGoal"} onPress={() => {
              setModalVisible(false)
            }}  />
        </Modal>
      )}

      <SafeAreaView style={[styles.layout,{backgroundColor:Colors.primaryBgColor.newPrime}]}>
        <View style={{alignItems:"center",marginBottom:10}}>
          <Text style={{fontSize:30,fontFamily:"MainFont"}}>Settings</Text>
        </View>
      <ScrollView contentContainerStyle={styles.mainOptions} >
        <Text style={styles.settingsLabel}>Appearance</Text>
        <Buttons secBtn={false} icon={""} onPress={() => alert("Available soon")} label={"Change Theme"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>
        <Text style={styles.settingsLabel}>Profile</Text>
        <Buttons 
          secBtn={false} icon={""} 
          onPress={() => {
            setShowUsername(true)
            setShowSavingGoal(false)
            setShowIncome(false)
            setModalVisible(true)
          }}
          label={"Change Name"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>
        <Text style={styles.settingsLabel}>Accounting settings</Text>
        <Buttons 
          secBtn={false} 
          icon={""} 
          onPress={() => {
            setShowCurrency(true)
            setShowIncome(false)
            setShowSavingGoal(false)
            setModalCurrVisible(true)
          }}
          label={"Change Currency"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>
        <Buttons 
          secBtn={false} 
          icon={""} 
          onPress={() => {
            setShowIncome(true)
            setShowUsername(false)
            setShowSavingGoal(false)
            setModalVisible(true)
          }}
          label={"Change Income"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>

        <Buttons 
          secBtn={false} 
          icon={""} 
          onPress={() => {
            setShowSavingGoal(true)
            setShowIncome(false)
            setShowUsername(false)
            setModalVisible(true)
          }}
          label={"Change Saving Goal"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>

        <Buttons 
          secBtn={false} 
          icon={""} 
          onPress={() => {
            alert("Available soon")
          }}
          label={"Change Fixed Costs"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>
        <Text style={styles.settingsLabel}>App service</Text>
        <Buttons 
          secBtn={false} 
          icon={""} 
          onPress={() => {
            alert("Available soon")
          }}
          label={"Reset Balance"} brdCol={Colors.primaryBgColor.newPrimeLight}></Buttons>


        <Buttons secBtn={true} icon={""} label={"Reset App"} brdCol={Colors.primaryBgColor.persianRed} onPress={() => {
          Alert.alert(
            'Reset App',
            'It will reset all your balance transactions',
            [
              {text: "Cancel", style:"cancel"},
              {text: "Reset", style:"destructive",onPress:async() => {
                const handleFn = await handleReset()
                if(handleFn)
                setTimeout(()=>{
                  router.push("/")
                },4000)
              }}
            ]
          );
          }}></Buttons>
      </ScrollView>
      </SafeAreaView>
    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    position:"relative",
  },
  mainOptions:{
    paddingHorizontal:20,
    paddingBottom:80,
    },
  layout:{
    height:"100%",
  },
  footer:{
    marginTop:10,
    marginBottom:60,
  },
  settingsLabel:{
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.prime
  }
})

export default settings