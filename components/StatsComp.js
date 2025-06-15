import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { months } from '../constants/Dates.js'
import { incomeActiveContext, usersBalanceContext } from "../hooks/balanceContext";
import { Colors } from '@/constants/Colors'
import { useAnimatedStyle } from 'react-native-reanimated';
import numberInputValidation from '@/services/numberInputValidation'

const { width } = Dimensions.get("window")

const GraphComp = ({ outputData, typeDate, setGivenWidth }) => {

  

  const {
      currency
    } = useContext(usersBalanceContext)

  const [renderItems,setRenderItems] = useState()

  const animatedContainer = useAnimatedStyle(() => {
    return {

    }
  })

    /* 



    */
    const yearRender = () => {
      if(Object.values(outputData).length > 0){
        setRenderItems(() =>{
        return( 
          <View style={[,{width:"100%"}]}>
          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Balance: </Text>
            <Text style={styles.resLabel}>{numberInputValidation.converToString(outputData.balance)} {currency}</Text>
          </View>

          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Total Transactions: </Text>
            <Text style={styles.resLabel}>{outputData.monthsTotalTransactions}</Text>
          </View>

          <View style={styles.elementDiv}>
            <Text style={[styles.mainLabel,{}]}>Expenses: </Text>
            <Text style={[styles.resLabel,{color:Colors.primaryBgColor.persianRed}]}>{numberInputValidation.converToString(outputData.expense)} {currency}</Text>
          </View>

          {/* <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Static Income: </Text>
            <Text style={styles.resLabel}>{outputData.staticIncome} {currency}</Text>
          </View> */}

          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Income: </Text>
            <Text style={styles.resLabel}>{numberInputValidation.converToString(outputData.income)} {currency}</Text>
          </View>
          </View>
        )
      })

      }
    }

    const monthRender = () => {
      if(Object.values(outputData).length > 0){
         setRenderItems(() =>{
        return( 
          <View style={[,{width:"100%"}]}>
          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Balance: </Text>
            <Text style={styles.resLabel}>{numberInputValidation.converToString(outputData?.monthsTotalBalance)} {currency}</Text>
          </View>
          
          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Total Transactions: </Text>
            <Text style={styles.resLabel}>{outputData.monthsTotalTransactions}</Text>
          </View>

          <View style={styles.elementDiv}>
            <Text style={[styles.mainLabel,{}]}>Expenses: </Text>
            <Text style={[styles.resLabel,{color:Colors.primaryBgColor.persianRed}]}>{numberInputValidation.converToString(outputData.monthsTotalExpenses)} {currency}</Text>
          </View>

          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Static Income: </Text>
            <Text style={styles.resLabel}>{numberInputValidation.converToString(outputData.monthsStaticIncomeVal)} {currency}</Text>
          </View>

          <View style={styles.elementDiv}>
            <Text style={styles.mainLabel}>Income: </Text>
            <Text style={styles.resLabel}>{numberInputValidation.converToString(outputData.monthsIncomeVal)} {currency}</Text>
          </View>
          </View>
        )
      }) 
        }
    }

    const dayRender = () => {
      if(Object.values(outputData).length > 0){
        setRenderItems(() =>{
          return( 
            <View style={[,{width:"100%"}]}>
            <View style={styles.elementDiv}>
              <Text style={styles.mainLabel}>Balance: </Text>
              <Text style={[styles.resLabel,{ color: outputData.balance < 0 ? Colors.primaryBgColor.persianRed : Colors.primaryBgColor.prime}]}>{numberInputValidation.converToString(outputData.balance)} {currency}</Text>
            </View>

            <View style={styles.elementDiv}>
              <Text style={styles.mainLabel}>Total Transactions: </Text>
              <Text style={styles.resLabel}>{outputData.numbersOfTrans}</Text>
            </View>

            <View style={styles.elementDiv}>
              <Text style={[styles.mainLabel,{}]}>Expenses: </Text>
              <Text style={[styles.resLabel,{color:Colors.primaryBgColor.persianRed}]}>{numberInputValidation.converToString(outputData.expense)} {currency}</Text>
            </View>

            <View style={styles.elementDiv}>
              <Text style={styles.mainLabel}>Income: </Text>
              <Text style={styles.resLabel}>{numberInputValidation.converToString(outputData.income)} {currency}</Text>
            </View>

            
            </View>
          )
        })
      }
    }


    useEffect(() => {
      if(typeDate === "year"){
        yearRender()

      }else if(typeDate === "month"){
        monthRender()
      }else if(typeDate === "day"){
        dayRender()
      }
    },[outputData])
  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <View style={styles.layout}>
        <View>
          {/* <Text style={styles.label}>{typeDate === "month" ? months[outputData?.monthsIncomeDate] : outputData.year}</Text>  */}

        </View>
        {renderItems}
        
        {/* Stats of the Month comp here */}
      </View>
    </View>
  )
}

export default GraphComp

const styles = StyleSheet.create({
    container:{
        width:width,
        alignItems:"center",
        height:250,
    },
    label:{
      fontSize:15,
      fontFamily:"MainFont",
    },
    layout:{
      borderWidth:2,
      borderRadius:6,
      width:width - 50,
      height:200,
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:Colors.primaryBgColor.newPrimeLight,
      borderColor:Colors.primaryBgColor.darkPurple
    },
    mainLabel:{
      fontSize:20,
      fontFamily:"MainFont",
      color:Colors.primaryBgColor.black
    },
    resLabel:{
     fontSize:23,
      fontFamily:"MainFont",
      color:"black",
      color:Colors.primaryBgColor.prime
    },
    elementDiv:{
      flexDirection:"row",
      width:"100%",
      justifyContent:"space-between",
      paddingHorizontal:25,
      alignItems:"center"
    }
})