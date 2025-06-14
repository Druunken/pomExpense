import { Colors } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

import SwipeLabelDataComp from '../components/SwipeLabelDataComp.js'
import GraphComp from '../components/GraphComp.js'
import db from '../services/serverSide'
import { months, days, years } from '../constants/Dates.js'
import FilterTransactionComp from './FilterTransactionComp.js'
import StatsComp from '../components/StatsComp.js'
import CategoryComp from '../components/CategoryComp.js'
import CompareComp from '../components/CompareComp.js'


const TransactionDataComponent = ({ typeDate, dateData, transModalVisible, setTransModalVisible , setId}) => {

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
  const [scrollingDown,setScrollingDown] = useState(false)
  const [yearLabel,setYearLabel] = useState("")
  const [noData,setNoData] = useState(true)

  const [staticData, setStaticData] = useState()

  const containerY = useSharedValue(0)
  const containerHeight = useSharedValue(220)
  const containerOp = useSharedValue(1)


  const mainContainerOp = useSharedValue(0)
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
        opacity: mainContainerOp.value
      }
    })

    const animatedMainContainer = useAnimatedStyle(() => {
      return{
        opacity:containerOp.value
      }
    })

    const fetchData = async() => {
      try {
        if(typeDate === "month"){
          const monthData = await db.getProperMonths()


          if(monthData.length > 0){
            console.log(monthData)
            const incomeDate = monthData[1][trackingIndex].monthsIncomeDate
            const keyToCheck = monthData[0][0]

          setDataLength(monthData[0].length)
          setLabel(months[keyToCheck])
          setData(monthData[1])
          setTrackingIndex(monthData[0].length - 1)
          setYearLabel(monthData[trackingIndex]?.yearsIncomeDate)
          setQueryState(keyToCheck)
          mainContainerOp.value = withTiming(1, { duration: 250 })
          }else {
            mainContainerOp.value = withTiming(0, { duration: 250 })
          }
          
        }else if(typeDate === "year"){
           
          const yearsData = await db.getAllYears()
          console.log(Object.values(yearsData)[0].monthsTotalTransactions)
          if(Object.values(yearsData)[0].monthsTotalTransactions > 0){
            setDataLength(Object.keys(yearsData).length)
            setTrackingIndex(Object.keys(yearsData).length - 1)
            setQueryState(Object.keys(yearsData)[trackingIndex])
            setLabel(Object.keys(yearsData)[trackingIndex])
            mainContainerOp.value = withTiming(1, { duration: 250 })
          }else if(Object.values(yearsData)[0].monthsTotalTransactions < 1) {
            mainContainerOp.value = withTiming(0, { duration: 250 })
          }

          setData(yearsData)
        }else if(typeDate === "day"){
          const daysData = await db.getDayTrans() 
          if(Object.keys(daysData).length > 0){
            console.log("Ok ok ok ")

            const len = Object.keys(daysData).length
            const daysStr = Object.keys(daysData)[len - 1].split("-")[2]
            setDataLength(len)
            setTrackingIndex(len - 1)
            setQueryState(daysStr)
            setLabel(daysStr)
            setData(daysData)
            mainContainerOp.value = withTiming(1, { duration: 250 })
          }else{
            mainContainerOp.value = withTiming(0, { duration: 250 })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
      fetchData()
    },[])

    useEffect(() => {
      if(data === undefined) return

      if(typeDate === "month"){
        if(data && dataLength > 0) {
          setOutputData(data[trackingIndex])
          setLabel(months[data[trackingIndex]?.monthsIncomeDate])
          setYearLabel(data[trackingIndex]?.yearsIncomeDate)
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
      }else if(typeDate === "year" || typeDate === "day"){
        const isDay = typeDate === "day"
        const norm = Object.keys(data)[trackingIndex]
        let valid;
        if(isDay && norm) valid = norm.split("-")[2]

        if(data && dataLength > 0){
          setOutputData(Object.values(data)[trackingIndex])
          setLabel(!isDay ? norm : valid)
          setYearLabel(isDay && norm.split("-")[0] + " " + months[norm.split("-")[1]])
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

    useEffect(() => {
      mainContainerOp.value = withTiming(1,{ duration:500})
    },[])

    useEffect(() => {
      if(scrollingDown){
        containerOp.value = withTiming(0,{ duration:250})
        return containerHeight.value = withTiming(0,{ duration: 150})
      }else{!scrollingDown}{
        containerOp.value = withTiming(1,{ duration:250})
        return containerHeight.value = withSpring(210)
      }
    },[scrollingDown])

  return (
    <Animated.View style={[styles.container,animatedMainContainer,{}]}>
      {/* <Text style={styles.label}>{typeDate === "day" ? "Day component" : typeDate === "month" ? "Month component" : "Year component"}</Text> */}
      <SwipeLabelDataComp setState={setTrackingIndex} dataLength={dataLength} label={label} backLabel={backLabel} forwLabel={forwLabel} yearLabel={yearLabel}/>
      <Animated.View style={[animatedContainer,styles.graphContainer,{zIndex:0}]} >

        <ScrollView contentContainerStyle={styles.scrollDiv} horizontal pagingEnabled  scrollEnabled>
          <StatsComp outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
          <CategoryComp outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
          <CompareComp outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
        </ScrollView>
      </Animated.View>

      <FilterTransactionComp scrollbehaviour={true} setId={setId} setTransModalVisible={setTransModalVisible} scrollingDown={scrollingDown} setScrollingDown={setScrollingDown} filteredData={staticData} setFilteredData={setStaticData} queryState={queryState} dayView={typeDate === "day"} monthView={typeDate === "month"} yearView={typeDate === "year"} setContentOffSetY={setContentOffSetY}/>
      
    </Animated.View >
  )
}

export default TransactionDataComponent

const styles = StyleSheet.create({
  container:{
    width:"100%",
    marginTop:5,
    flex:1,
    gap:15
  },
  transactionComponent:{
  },
  graphContainer:{
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