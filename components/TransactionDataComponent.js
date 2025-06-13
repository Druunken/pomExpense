import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import SwipeLabelDataComp from '../components/SwipeLabelDataComp.js'
import GraphComp from '../components/GraphComp.js'
import db from '../services/serverSide'
import { months, days, years } from '../constants/Dates.js'
import FilterTransactionComp from './FilterTransactionComp.js'


const TransactionDataComponent = ({ typeDate, dateData }) => {

  const [dataArr,setDataArr] = useState()
  const [data,setData] = useState({})
  const [outputData,setOutputData] = useState({})
  const [trackingIndex,setTrackingIndex] = useState(0)
  const [dataLength,setDataLength] = useState(0)
  const [label,setLabel] = useState("")
  const [backLabel,setBackLabel] = useState("")
  const [forwLabel,setForwLabel] = useState("")
  const [givenWidth, setGivenWidth] = useState("")
  const [queryState,setQueryState] = useState("")
  const [contentOffSetY,setContentOffSetY] = useState(0)

  const [staticData, setStaticData] = useState()

  const containerY = useSharedValue(0)
  const containerHeight = useSharedValue(350)
  const containerOp = useSharedValue(1)
    /* 
    
    We need Week, Month and Year

    they all have the same properties like:

        Expense,
        Income,
        Total,
        Numbers of Transactions,
        Total Savings

    We will use if condition to terminate the task

    */

    const animatedContainer = useAnimatedStyle(() => {
      return{
        transform: [{ translateY: containerY.value}],
        height: containerHeight.value,
        opacity: containerOp.value
      }
    })

    const fetchData = async() => {
      try {
        if(typeDate === "month"){
          const monthData = await db.getProperMonths()

          
          const incomeDate = monthData[1][trackingIndex].monthsIncomeDate
          const keyToCheck = monthData[0][0]

          /* setting length for validating the trackingIndex */
          setDataLength(monthData[0].length)
          setLabel(months[keyToCheck])
          setData(monthData[1])
          setTrackingIndex(monthData[0].length - 1)
          console.log(queryState)
          setQueryState(keyToCheck)
          
        }else if(typeDate === "year"){
           
          const yearsData = await db.getAllYears()
          setDataLength(Object.keys(yearsData).length)
          setTrackingIndex(Object.keys(yearsData).length - 1)
          setQueryState(Object.keys(yearsData)[trackingIndex])
          setLabel(Object.keys(yearsData)[trackingIndex])
          setData(yearsData)
        }
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
      fetchData()
    },[])

    useEffect(() => {
      let obj = {y: 0}
      if(obj.y < contentOffSetY){
        obj.y = contentOffSetY
      }
      containerHeight.value = containerHeight.value - contentOffSetY
    },[contentOffSetY])

    useEffect(() => {
      if(data === undefined) return

      if(typeDate === "month"){
        if(data && dataLength > 0) {
          setOutputData(data[trackingIndex])
          setLabel(months[data[trackingIndex]?.monthsIncomeDate])
          setQueryState(data[trackingIndex]?.monthsIncomeDate)


          if(trackingIndex - 1 < 0){
            setBackLabel("")
          }else if(months[data[trackingIndex - 1]?.monthsIncomeDate] !== undefined){

            setBackLabel(months[data[trackingIndex - 1].monthsIncomeDate])
          }

          if(trackingIndex + 1 >= dataLength){
            setForwLabel("")
          }else if(months[data[trackingIndex + 1]?.monthsIncomeDate] !== undefined){
            setForwLabel(months[data[trackingIndex + 1]?.monthsIncomeDate])
          }
        }
      }else if(typeDate === "year"){
        if(data && dataLength > 0){
          setOutputData(Object.values(data)[trackingIndex])
          setLabel(Object.keys(data)[trackingIndex])
          setQueryState(Object.keys(data)[trackingIndex])

          if(trackingIndex - 1 < 0){
            setBackLabel("")
          }else if(Object.keys(data)[trackingIndex - 1] !== undefined){
            setBackLabel(Object.keys(data)[trackingIndex - 1])
          }

          if(trackingIndex + 1 >= dataLength){
            setForwLabel("")
          }else if(Object.keys(data)[trackingIndex + 1] !== undefined){
            setForwLabel(Object.keys(data)[trackingIndex + 1])
          }
        }
      }
    },[trackingIndex])

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>{typeDate === "day" ? "Day component" : typeDate === "month" ? "Month component" : "Year component"}</Text> */}
      <Animated.View style={[animatedContainer,styles.graphContainer,{zIndex:0}]} >
        <SwipeLabelDataComp setState={setTrackingIndex} dataLength={dataLength} label={label} backLabel={backLabel} forwLabel={forwLabel}/>

        <ScrollView contentContainerStyle={styles.scrollDiv} horizontal pagingEnabled  scrollEnabled>
          <GraphComp outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
          <GraphComp outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
          <GraphComp outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
        </ScrollView>
      </Animated.View>

      <FilterTransactionComp style={styles.transactionComponent} filteredData={staticData} setFilteredData={setStaticData} queryState={queryState} monthView={typeDate === "month"} yearView={typeDate === "year"} setContentOffSetY={setContentOffSetY}/>
      
    </View>
  )
}

export default TransactionDataComponent

const styles = StyleSheet.create({
  container:{
    width:"100%",
    marginTop:5,
    flex:1,

  },
  transactionComponent:{
    position:"absolute",
    top:350
  },
  graphContainer:{
    position:"absolute"
  },
  scrollDiv:{
    marginTop:5,
  },
  label:{
    color: Colors.primaryBgColor.prime,
    fontSize:25,
    fontFamily:"MainFont"
  }
})