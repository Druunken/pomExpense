import { View, Text, StyleSheet, Alert, Modal, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from '../../constants/Colors.ts'

import db from '../../services/serverSide';
import { incomeActiveContext, IncomeProvider } from "../../hooks/balanceContext"
import Buttons from '../../components/Buttons'
import UserInput from '../../components/UserInput';
import { AppInitializationContext } from '../../hooks/appContext';
import { usersBalanceContext } from "../../hooks/balanceContext"
import LoadingSplashScreen from '../../components/LoadingSplashScreen.js'




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
  const [loadingSplash,setLoadingSplash] = useState(false)

  const handleReset = async() => {
    try {
      await db.deleteTable()
      await db.newOpening()
      setFixedCostAmount("0,00")
      setMarkedDates({})
      setFirstLaunch(true)
      setLoadingSplash(true)
      return true
    } catch (error) {
      console.error("ERROR HERE")
      setLoadingSplash(false)
      return false
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
        <View>
        <Modal visible={modalVisible}>
          <UserInput label={currentUsername} type={"username"} onPress={() => {
            setModalVisible(false)

          }}  />
        </Modal>
        </View>
      )}
      {showCurrency && (
        <View>
        <Modal visible={modalCurrVisible}>
          <UserInput label={currrentCurrency} type={"currency"} onPress={() => {
            setModalCurrVisible(false)
          }}  />
        </Modal>
        </View>
      )}
      {showIncome && (
        <View>
        <Modal visible={modalVisible}>
            <UserInput label={currentIncome} type={"income"} onPress={() => {
              setModalVisible(false)

            }}  />
        </Modal>
        </View>
      )}
      {showSavingGoal && (
        <View>
        <Modal visible={modalVisible}>
            <UserInput label={currentGoal} type={"savingGoal"} onPress={() => {
              setModalVisible(false)
            }}  />
        </Modal>
        </View>
      )}

      <SafeAreaView style={[styles.layout,{backgroundColor:Colors.primaryBgColor.newPrime}]}>
        <ScrollView contentContainerStyle={styles.mainOptions} keyboardShouldPersistTaps="always" scrollEnabled={true} showsHorizontalScrollIndicator>
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
              `This will literally reset everything.\n All data will be lost!`,
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
        <LoadingSplashScreen title={"Reseting Application..."} visible={loadingSplash} />
      </SafeAreaView>
    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    position:"relative",
    flex:1
  },
  mainOptions:{
    paddingHorizontal:20,
    paddingBottom:80,
    },
  layout:{
    flex:1
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