import { Colors } from '@/constants/Colors'
import { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

import SwipeLabelDataComp from '../components/SwipeLabelDataComp.js'
import GraphComp from '../components/GraphComp.js'
import db from '../services/serverSide'
import { months, days, years } from '../constants/Dates.js'
import FilterTransactionComp from './FilterTransactionComp.js'
import StatsComp from '../components/StatsComp.js'
import CategoryComp from '../components/CategoryComp.js'
import CompareComp from '../components/CompareComp.js'

const transactionStyle = {
    borderRadius:30,
    paddingTop:15,
    height:200,
  }


const TransactionDataComponent = ({ typeDate, dateData, transModalVisible, comparedData, setTransModalVisible , setId, cateMonths, cateDays, cateYears}) => {

  const [data,setData] = useState({})
  const [outputData,setOutputData] = useState({})
  const [prevOutputData,setPrevOutputData] = useState({})
  const [outputCate,setOutputCate] = useState({})
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
  

  const [cateIndex,setCateIndex] = useState(0)
  const [cateLength,setCateLength] = useState(0)

  const [scrollIndex,setScrollIndex] = useState(0)

  const [staticData, setStaticData] = useState()

  const containerY = useSharedValue(0)
  const containerHeight = useSharedValue(390)
  const containerOp = useSharedValue(1)


  const mainContainerOp = useSharedValue(0)

  const lIndicatorBg = useSharedValue(1)
  const lIndicatorWidth = useSharedValue(15)
  const lIndicatorOp = useSharedValue(1)

  const mIndicatorBg = useSharedValue(0)
  const mIndicatorWidth = useSharedValue(10)
  const mIndicatorOp = useSharedValue(1)

  const rIndicatorBg = useSharedValue(0)
  const rIndicatorWidth = useSharedValue(10)
  const rIndicatorOp = useSharedValue(1)

  const lTextOp = useSharedValue(0)
  const lTextY = useSharedValue(-50)

  const mTextOp = useSharedValue(0)
  const mTextY = useSharedValue(-50)

  const rTextOp = useSharedValue(0)
  const rTextY = useSharedValue(-50)

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


    const animatedTextL = useAnimatedStyle(() =>{
      return{
        opacity: lTextOp.value,
        transform: [{ translateY: lTextY.value }]
      }
    })

    const animatedTextM = useAnimatedStyle(() =>{
      return{
        opacity: mTextOp.value,
        transform: [{ translateY: mTextY.value }]
      }
    })

    const animatedTextR = useAnimatedStyle(() =>{
      return{
        opacity: rTextOp.value,
        transform: [{ translateY: rTextY.value }]
      }
    })

    const animatedIndicatorL = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        lIndicatorBg.value,
        [0,1],
        [Colors.primaryBgColor.gray,Colors.primaryBgColor.brown]
      )
      return{
        backgroundColor,
        width:lIndicatorWidth.value,
        opacity: lIndicatorOp.value
      }
    })

    const animatedIndicatorM = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        mIndicatorBg.value,
        [0,1],
        [Colors.primaryBgColor.gray,Colors.primaryBgColor.brown]
      )
      return{
        backgroundColor,
        width: mIndicatorWidth.value,
        opacity: mIndicatorOp.value
      }
    })

    const animatedIndicatorR = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        rIndicatorBg.value,
        [0,1],
        [Colors.primaryBgColor.gray,Colors.primaryBgColor.brown]
      )
      return{
        backgroundColor,
        width: rIndicatorWidth.value,
        opacity: rIndicatorOp.value
      }
    })

    const animatedContainer = useAnimatedStyle(() => {
      return{
        transform: [{ translateY: containerY.value}],
        height: containerHeight.value,
        opacity: mainContainerOp.value,

      }
    })

    const animatedMainContainer = useAnimatedStyle(() => {
      return{
        opacity:containerOp.value
      }
    })


    const prepCateData = () => {
      const len = Object.keys(cateYears).length
      const keys = Object.keys(cateYears)
      setCateIndex(len - 1)
      setCateLength(len)
    }

    const fetchData = async() => {
      try {
        if(typeDate === "month"){
          const monthData = await db.getProperMonths()
          const transExists = monthData[1][0].monthsTotalTransactions > 0
          if(monthData.length > 0){
            const keyToCheck = monthData[0][0]

          setDataLength(monthData[0].length)
          setLabel(months[keyToCheck])
          setData(monthData[1])
          setTrackingIndex(monthData[0].length - 1)
          setYearLabel(monthData[1][trackingIndex].yearsIncomeDate)
          setQueryState(keyToCheck)
          if(transExists){
            mainContainerOp.value = withTiming(1, { duration: 250 })
          }else{
            mainContainerOp.value = withTiming(0, { duration: 250 })
          }
          }else {
            mainContainerOp.value = withTiming(0, { duration: 250 })
          }
          
        }else if(typeDate === "year"){
           
          const yearsData = await db.getAllYears()
          const transExists = Object.values(yearsData)[0].monthsTotalTransactions > 0
          if(Object.values(yearsData).length > 0){
            setDataLength(Object.keys(yearsData).length)
            setTrackingIndex(Object.keys(yearsData).length - 1)
            setQueryState(Object.keys(yearsData)[trackingIndex])
            setLabel(Object.keys(yearsData)[trackingIndex])

            if(transExists){
              mainContainerOp.value = withTiming(1, { duration: 250 })
            }else{
              mainContainerOp.value = withTiming(0, { duration: 250 })
            }
          }else if(Object.values(yearsData)[0].monthsTotalTransactions < 1) {
            mainContainerOp.value = withTiming(0, { duration: 250 })
          }

          setData(yearsData)
        }else if(typeDate === "day"){
          const daysData = await db.getDayTrans() 
          if(Object.keys(daysData).length > 0){

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
          if(data[trackingIndex - 1] !== undefined){
            setPrevOutputData(data[trackingIndex - 1])
          }
          setLabel(months[data[trackingIndex]?.monthsIncomeDate])
          setYearLabel(data[trackingIndex]?.yearsIncomeDate)
          setQueryState(data[trackingIndex]?.monthsIncomeDate)


          if(cateMonths){
          const ind = Object.keys(cateMonths)[trackingIndex]
          setOutputCate(cateMonths[ind])
        }

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

        if(cateYears){
          const ind = Object.keys(cateYears)[trackingIndex]
          setOutputCate(cateYears[ind])
        }

        if(cateDays){
          const ind = Object.keys(cateDays)[trackingIndex]
          setOutputCate(cateDays[ind])
        }



        if(data && dataLength > 0){
          setOutputData(Object.values(data)[trackingIndex])

          if(Object.values(data)[trackingIndex - 1] !== undefined){
            setPrevOutputData(Object.values(data)[trackingIndex - 1])
          }else{
            setPrevOutputData(undefined)
          }
          setLabel(!isDay ? norm : valid)
          setYearLabel(isDay ? norm.split("-")[0] + " " + months[norm.split("-")[1]] : "...")
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
    },[trackingIndex,data])



    /* SCROLLING DOWN CONDITIONS */
    useEffect(() => {
      if(scrollingDown){
        mainContainerOp.value = withTiming(0,{ duration:250})
        return containerHeight.value = withTiming(0,{ duration: 150})
      }else{!scrollingDown}{
        if(Object.values(data).length > 0){
          mainContainerOp.value = withTiming(1,{ duration:250})
        }else{
          mainContainerOp.value = withTiming(0,{ duration:250})
        }
        return containerHeight.value = withSpring(390)
      }
    },[scrollingDown])


    const timeOutIdRef = useRef(null)
    const handleScrollPage = (index) => {
      if(timeOutIdRef.current){
        clearTimeout(timeOutIdRef.current)
        timeOutIdRef.current = null
      }
      if(index === 0){
        mIndicatorOp.value = withTiming(0,{duration:500 })
        lIndicatorOp.value = withTiming(0,{ duration:500 })
        rIndicatorOp.value = withTiming(0,{ duration: 500 })

        lTextOp.value = withTiming(1,{ duration:250 })
        lTextY.value = withSpring(0,{ damping: 14})

        timeOutIdRef.current = setTimeout(() => {

          lIndicatorOp.value = withTiming(1,{ duration:250 })
          lIndicatorWidth.value = withSpring(15)
          lIndicatorBg.value = withTiming(1,{ duration:250 })

          mIndicatorOp.value = withTiming(1,{duration:250 })
          rIndicatorOp.value = withTiming(1,{ duration: 250 })

          lTextOp.value = withTiming(0,{duration:250})
          lTextY.value = withSpring(-50)
        }, 2000);

        mTextY.value = withSpring(-50)
        mTextOp.value = withTiming(0,{ duration:250 })

        rTextY.value = withSpring(-50)
        rTextOp.value = withTiming(0,{ duration:250 })

        if(mIndicatorBg.value === 1){
          mIndicatorBg.value = withTiming(0,{ duration:250 })
          mIndicatorWidth.value = withSpring(10)
        }

      }else if(index === 1){
        mIndicatorOp.value = withTiming(0,{duration:500 })
        lIndicatorOp.value = withTiming(0,{ duration:500 })
        rIndicatorOp.value = withTiming(0,{ duration: 500 })

        mTextOp.value = withTiming(1,{ duration: 250})
        mTextY.value = withSpring(0,{ damping: 14})

        timeOutIdRef.current = setTimeout(() => {
          mTextOp.value = withTiming(0, { duration: 250 })
          mTextY.value = withTiming(-50, { duration: 250 })

          mIndicatorBg.value = withTiming(1,{ duration:250 })
          mIndicatorWidth.value = withSpring(15)
          mIndicatorOp.value = withTiming(1,{ duration: 320})


          lIndicatorOp.value = withTiming(1,{ duration: 280 })
          rIndicatorOp.value = withTiming(1,{ duration: 300 })
        }, 2000);

        lTextY.value = withSpring(-50)
        lTextOp.value = withTiming(0,{ duration:250 })

        rTextY.value = withSpring(-50)
        rTextOp.value = withTiming(0,{ duration:250 })


        if(lIndicatorBg.value === 1){
          lIndicatorBg.value = withTiming(0,{ duration:250 })
          lIndicatorWidth.value = withSpring(10)
        }
        if(rIndicatorBg.value === 1){
          rIndicatorBg.value = withTiming(0,{ duration:250 })
          rIndicatorWidth.value = withSpring(10)
        }
      }else if(index === 2){
        mIndicatorOp.value = withTiming(0,{duration:500 })
        lIndicatorOp.value = withTiming(0,{ duration:500 })
        rIndicatorOp.value = withTiming(0,{ duration: 500 })

        rTextOp.value = withTiming(1,{duration:250})
        rTextY.value = withSpring(0,{ damping: 14})

        timeOutIdRef.current = setTimeout(() => {
          rIndicatorBg.value = withTiming(1,{ duration:250 })
          rIndicatorWidth.value = withSpring(15)
          rIndicatorOp.value = withTiming(1,{ duration: 250 })

          mIndicatorOp.value = withTiming(1,{duration:250 })
          lIndicatorOp.value = withTiming(1,{ duration:250 })

          lTextY.value = withSpring(-50)
          lTextOp.value = withTiming(0,{ duration:250 })

          rTextOp.value = withTiming(0,{duration:250})
          rTextY.value = withSpring(-50)
        }, 2000);

        mTextY.value = withSpring(-50,{damping:14})
        mTextOp.value = withTiming(0,{ duration:250 })

        if(mIndicatorBg.value === 1){
          mIndicatorBg.value = withTiming(0,{ duration:250 })
          mIndicatorWidth.value = withSpring(10)
        }
      }
    }

    /*  INDICATOR */
    useEffect(() => {
      if(typeof cateYears === "object"){
        if(Object.values(cateYears).length > 0){
          prepCateData()
        }
      }
    },[cateYears,cateDays])

  return (
    <Animated.View style={[styles.container,animatedMainContainer,{}]}>
      <SwipeLabelDataComp setState={setTrackingIndex} dataLength={dataLength} label={label} backLabel={backLabel} forwLabel={forwLabel} yearLabel={yearLabel}/>
      <Animated.View style={[animatedContainer,styles.graphContainer,{zIndex:0}]} >
        <View style={styles.indicatorDiv}>
          <Animated.View style={[styles.scrollIndicator,animatedIndicatorL]}/>
          <Animated.View style={[styles.scrollIndicator,animatedIndicatorM]}/>
          { typeDate !== "day" && (
            <Animated.View style={[styles.scrollIndicator,animatedIndicatorR]}/>
          )}
          <Animated.View style={[animatedTextL,{ position:"absolute"}]}>
            <Text style={styles.indText}>Stats</Text>
          </Animated.View>
          <Animated.View style={[animatedTextM,{ position:"absolute"}]}>
            <Text style={styles.indText}>Category Stats</Text>
          </Animated.View>
          <Animated.View style={[animatedTextR,{ position:"absolute"}]}>
            <Text style={styles.indText}>Compare Stats</Text>
          </Animated.View>
        </View>
        <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollDiv} horizontal pagingEnabled  scrollEnabled showsHorizontalScrollIndicator={false} onScroll={(ev) => {
          const offsetX = ev.nativeEvent.contentOffset.x
          const pageWidth = ev.nativeEvent.layoutMeasurement.width
          const pageIndex = Math.round(offsetX / pageWidth)
          if(scrollIndex !== pageIndex){
            setScrollIndex(pageIndex)
            handleScrollPage(pageIndex)
          }
        }}>

          <StatsComp prevData={prevOutputData} outputData={outputData} typeDate={typeDate} setGivenWidth={setGivenWidth}/>
          <CategoryComp outputData={outputCate && outputCate} typeDate={typeDate} setGivenWidth={setGivenWidth} isVisible={scrollIndex === 1}/>
          { typeDate !== "day" && (
            <CompareComp outputData={comparedData && comparedData} typeDate={typeDate} setGivenWidth={setGivenWidth} isVisible={scrollIndex === 2}/>
          )}
        </ScrollView>
      </Animated.View>

      <FilterTransactionComp givinStyle={transactionStyle} scrollbehaviour={true} setId={setId} setTransModalVisible={setTransModalVisible} scrollingDown={scrollingDown} setScrollingDown={setScrollingDown} filteredData={staticData} setFilteredData={setStaticData} queryState={queryState} dayView={typeDate === "day"} monthView={typeDate === "month"} yearView={typeDate === "year"} setContentOffSetY={setContentOffSetY}/>
      
    </Animated.View >
  )
}

export default TransactionDataComponent

const styles = StyleSheet.create({
  container:{
    width:"100%",
    overflow:"hidden",
  },
  indicatorDiv:{
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    marginBottom:5,
    flexDirection:"row",
    gap:5,
  },
  transactionComponent:{
  },
  graphContainer:{
  },
  scrollDiv:{
  },
  label:{
    color: Colors.primaryBgColor.prime,
    fontSize:25,
    fontFamily:"MainFont"
  },
  transactionStyle:{
    backgroundColor:Colors.primaryBgColor.babyBlue,
    borderRadius:20,

  },
  scrollIndicator:{
    width:12,
    height:10,
    backgroundColor:Colors.primaryBgColor.gray,
    borderRadius:10,
  },
  indText:{
    fontFamily:"BoldFont",
    fontSize:18,
    color:Colors.primaryBgColor.black
  }
})