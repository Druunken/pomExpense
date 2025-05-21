import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors'
import numberValidation from '@/services/numberInputValidation'
import { usersBalanceContext } from "@/hooks/balanceContext";
import db from '@/services/serverSide'
import LottieView from 'lottie-react-native';


const MonthInfoComp = ({ month, year}) => {
    const [staticIncome,setStaticIncome] = useState(0)
    const [totalExpenseMonthVal,setTotalExpenseMonthVal] = useState(0)
    const [totalSavingsMonthVal,setTotalSavingsMonthVal] = useState(0)
    const [savingGoalMonthVal,setSavingGoalMonthVal] = useState(0)
    const [totalTransactionMonth,setTotalTransactionMonth] = useState(0)
    const [incomeMonthVal,setIncomeMonthVal] = useState(0)
    const [incomeProcessed,setIncomeProcessed] = useState("")
    const [goalAchieved,setGoalAchieved] = useState("")

    const [monthDisplayNullRender,setMonthDisplayNullRender] = useState(false)

    const { currency, fixedCostAmount } = useContext(usersBalanceContext)

    const monthPropData = async(month,year) => {
        if(month === undefined || year === undefined) return
        const actualDate = await db.createCurrentDate()
        const actualMonth = actualDate[1]
        const actualYear = actualDate[2]

        const monthProps = await db.getMonthProps(month === undefined ? actualMonth : month,year === undefined ? actualYear : year)
    
        if(monthProps[0] === undefined){
          return setMonthDisplayNullRender(true)
        }else{
          setMonthDisplayNullRender(false)
          setTotalExpenseMonthVal(monthProps[0].monthsTotalExpenses)
          console.log(monthProps[0].monthsTotalExpenses)
          setTotalSavingsMonthVal(monthProps[0].monthsTotalBalance)
          setSavingGoalMonthVal(monthProps[0].monthsSavingGoalVal)
          setTotalTransactionMonth(monthProps[0].monthsTotalTransactions)
          setIncomeMonthVal(monthProps[0].monthsIncomeVal)
          setStaticIncome(monthProps[0].monthsStaticIncomeVal)
          /* setTotalFixedCosts(monthProps[0].monthsTotalFixedCosts) */


          if(monthProps[0].monthsIncomeAutomateProcessed > 0) setIncomeProcessed("Processed")
          else if((monthProps[0].monthsIncomeAutomateProcessed === 0 || monthProps[0].monthsIncomeAutomateProcessed === null) && monthProps[0].monthsStaticIncomeVal === 0) setIncomeProcessed("Not Active")
          else setIncomeProcessed("Not Processed..")
    
          
          if(monthProps[0].monthsTotalTransactions < 1 && monthProps[0].monthsIncomeDate !== actualMonth) setGoalAchieved("You were not Active")
          else if(monthProps[0].monthsSavingGoalPassed > 0) setGoalAchieved("Achieved!")
          else if((monthProps[0].monthsIncomeDate === actualMonth && monthProps[0].yearsIncomeDate === actualYear) && monthProps[0].monthsStaticIncomeVal !== 0 && monthProps[0].monthsSavingGoalVal !== null) setGoalAchieved("In Process")
          else if(monthProps[0].monthsStaticIncomeVal < 1 || monthProps[0].monthsSavingGoalVal === null || monthProps[0].monthsSavingGoalVal === 0) setGoalAchieved("Not Active")
          else setGoalAchieved("You didn't make it :(")
        }
    }
    
    useEffect(() => {
        monthPropData(month, year)
    },[month,year])

    useFocusEffect(
      useCallback(() => {
        monthPropData()
      }, [])
    );

  return (
    <View style={styles.infoContainer}>
        {!monthDisplayNullRender && (
            <View style={[styles.infoLayout]}>
              <View style={[styles.infoColumn,{flexDirection:"row",justifyContent:"space-evenly",paddingHorizontal:5,backgroundColor:Colors.primaryBgColor.chillOrange,borderColor:Colors.primaryBgColor.chillOrange}]}>
                <View style={{flexDirection:"row"}}>
                  <View>
                    <LottieView  style={styles.lottie} source={(require("../../assets/lottie/income_lottie.json"))}/>
                  </View>
                  <View style={{width:50,height:50,borderWidth:0}}>
                    <Text style={[styles.infoLabel,{fontSize:12,color:Colors.primaryBgColor.black}]}>Percent</Text>
                  </View>
                </View>
                <View>
                  <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Total Expenses</Text>
                  <Text style={[styles.infoTotal,{
                    color: totalExpenseMonthVal < 0 ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.black
                  }]}>{totalExpenseMonthVal === 0 ? "0,00" : numberValidation.converToString(totalExpenseMonthVal.toFixed(2))} {currency}</Text>
                </View>
              </View>

              <View style={[styles.infoColumn,{flexDirection:"row",justifyContent:"space-evenly",paddingHorizontal:5}]}>
                <View style={{flexDirection:"row"}}>
                  <View>
                    <LottieView  style={styles.lottie} source={(require("../../assets/lottie/income_lottie.json"))}/>
                  </View>
                  <View style={{width:50,height:50,borderWidth:0}}>
                    <Text style={[styles.infoLabel,{fontSize:12,color:Colors.primaryBgColor.black}]}>Percent</Text>
                  </View>
                </View>
                <View>
                  <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Total income</Text>
                  <Text style={[styles.infoTotal,{
                    color: Colors.primaryBgColor.prime
                  }]}>{incomeMonthVal === 0 ? "0,00" : numberValidation.converToString(incomeMonthVal.toFixed(2))} {currency}</Text>
                </View>
              </View>

              <View style={[styles.infoColumn,{flexDirection:"row",justifyContent:"space-evenly",paddingHorizontal:5}]}>
                <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Total</Text>
                <Text style={[styles.infoTotal,{
                  color: totalExpenseMonthVal + incomeMonthVal < 0 ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.prime
                }]}>{totalExpenseMonthVal + incomeMonthVal === 0 ? "0,00" : numberValidation.converToString(Number(totalExpenseMonthVal + incomeMonthVal).toFixed(2))} {currency}</Text>
              </View>

           {/*  <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Static income</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.prime
              }]}>{numberValidation.converToString(staticIncome)} {currency}</Text>
            </View> */}

            <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Total Transactions</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.black 
              }]}>{totalTransactionMonth}</Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Total Savings</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.prime
              }]}>{totalSavingsMonthVal === 0 ? "0,00" : numberValidation.converToString(totalSavingsMonthVal.toFixed(2))} {currency}</Text>
            </View>

            {/* <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Saving Goal</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.prime
              }]}>{numberValidation.converToString(savingGoalMonthVal > 0 ? savingGoalMonthVal : 0)} {currency}</Text>
            </View> */}

            {/* <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Fixed Costs</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.prime
              }]}>{fixedCostAmount} {currency}</Text>
            </View> */}

            {/* <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Saving Achieved</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.prime,
                fontSize:15,
                textAlign:"center"
              }]}>{goalAchieved}</Text>
            </View> */}

            {/* <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel,{color:Colors.primaryBgColor.black}]}>Income Processed</Text>
              <Text style={[styles.infoTotal,{
                color: Colors.primaryBgColor.prime,
                fontSize:15,
                textAlign:"center"
              }]}>{incomeProcessed}</Text>
            </View> */}

          </View>
        )}
        {monthDisplayNullRender && (
          <View style={{justifyContent:"center",alignItems:"center",marginTop:20}}>
            <Text style={{fontSize:18,color:"white",fontFamily:"MainFont"}}>No data this month</Text>
          </View>
        )}
          
      </View>
  )
}

export default MonthInfoComp

const styles = StyleSheet.create({
    infoLayout:{
        gap:15,
        padding:10,
        justifyContent:"center",
        alignItems:"center",
    },
    lottie:{
      width:50,
      height:50
    },
    infoColumn:{
    backgroundColor:Colors.primaryBgColor.babyBlue,
    paddingHorizontal:0,
    paddingVertical:10,
    borderRadius:10,
    width:"100%",
    alignItems:"center",
    borderWidth:2,
    borderColor:Colors.primaryBgColor.prime
    },

    infoLabel:{
    fontSize:15,
    color:Colors.primaryBgColor.white,
    fontFamily:"MainFont"
    },

    infoTotal:{
        fontFamily:"BoldFont",
        color:Colors.primaryBgColor.white,
        fontSize:30,
    },
})