import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Animated, {  Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import {CalendarList} from 'react-native-calendars';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import TransactionDataComponent from '../../components/TransactionDataComponent.js'
import db from '../../services/serverSide.js'

import { Colors } from '@/constants/Colors'
import CategorieBtn from '@/components/CategorieBtn';
import { usersBalanceContext, incomeActiveContext } from "@/hooks/balanceContext";
import DayView from '@/components/MonthComponents/DayView'
import numberInputValidation from '@/services/numberInputValidation';
import FilterTransactionComp from '../../components/FilterTransactionComp.js'
import FilterNavComp from '../../components/FilterNavComp.js'
import TransactionModal from '../../components/ModalformComponents/TransactionModal.js'
import { months, years, days} from '@/constants/Dates.js';

import SecondNavComp from '../../components/SecondNavComp.js'


const { height: SCREEN_HEIGHT } = Dimensions.get('window')


// Build a graph that displays all transactions made by month and day
// calculate the differences between months and days
// 

const transactions = () => {

  const insets = useSafeAreaInsets()

  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT  + 50


  const [swiped,setSwiped] = useState(false)
  const [dateStringPressed,setDayStringPressed] = useState("")
  const [dayPressed,setDayPressed] = useState(false)

  const [transModalVisible,setTransModalVisible] = useState(false)
  const [id,setId] = useState(0)

  const [filteredData,setFilteredData] = useState()
  const [searchPressed,setSearchPressed] = useState(false)
  const [inputSearch,setInputSearch] = useState("")
  const [filterPressed,setFilterPressed] = useState(false)

  const { currency,value,markedDates } = useContext(usersBalanceContext)
  const { automateIncomeDay } = useContext(incomeActiveContext)

  const [categoryList, setCategoryList] = useState([])

  const [selectedDay,setSelectedDay] = useState("")
  const [selectedMonth,setSelectedMonth] = useState("")
  const [selectedYear,setSelectedYear] = useState("")

  const [contentOffSetY,setContentOffSetY] = useState(0)
  const [scrollingDown,setScrollingDown] = useState(false)

  const [cateYears,setCateYears] = useState({})
  const [cateMonths,setCateMonths] = useState({})
  const [cateDays,setCateDays] = useState({})

  const [tabs,setTabs] = useState("month")


  const mainNavContainerOp = useSharedValue(1)
  const mainNavContainerIndex = useSharedValue(1)
  const mainNavContainerX = useSharedValue(0)
  
  const secondNavContainerOp = useSharedValue(0)
  const secondNavContainerIndex = useSharedValue(0)
  const secondNavContainerHeight = useSharedValue(0)
  const secondNavBG = useSharedValue(0)

  const filterNavOp = useSharedValue(0)
  const filterInd = useSharedValue(0)
  const filterX = useSharedValue(-80)
  const filterBg = useSharedValue(0)
  const filterHeight = useSharedValue(45)
  const filterMargin = useSharedValue(80)

  const allNavOp =  useSharedValue(1)
  const allNavIndex = useSharedValue(1)

  const searchNavOp = useSharedValue(0)
  const searchNavIndex = useSharedValue(0)
  const searchNavX = useSharedValue(-50)

  const balanceContainerY = useSharedValue(0)

  const validateFData = Array.isArray(filteredData) && filteredData.length > 0

  const animatedFilterNav = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      filterBg.value,
      [0,1],
      [validateFData ? Colors.primaryBgColor.chillOrange : Colors.primaryBgColor.gray,Colors.primaryBgColor.darkPurple]
    )
    return{
      opacity: filterNavOp.value,
      zIndex: filterInd.value,
      transform: [{ translateX: filterX.value }],
      backgroundColor: backgroundColor,
      height: filterHeight.value,
      marginTop: filterMargin.value
    }
  })

  const animatedMainNav = useAnimatedStyle(() => {
    return{
      opacity: mainNavContainerOp.value,
      zIndex: mainNavContainerIndex.value,
      transform: [{ translateX: mainNavContainerX.value }]
    }
  })

  const animatedSecondNav = useAnimatedStyle(() => {
    return {
      opacity: secondNavContainerOp.value,
      zIndex: secondNavContainerIndex.value,
    }
  })

  const animatedAllNav = useAnimatedStyle(() => {
    return {
      opacity: allNavOp.value,
      zIndex: allNavIndex.value,
      transform: [{ translateX: mainNavContainerX.value }]
    }
  })

  const animatedSearchNav = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      secondNavBG.value,
      [0,1],
      [Colors.primaryBgColor.lightPrime,Colors.primaryBgColor.gray]
    )
    return {
      opacity: searchNavOp.value,
      zIndex: searchNavIndex.value,
      transform: [{ translateX: searchNavX.value }],
      height: secondNavContainerHeight.value,
      backgroundColor: backgroundColor
    }
  })

  const animatedBalanceContainer = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      balanceContainerY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [15,5],
      Extrapolation.CLAMP
    )
    const backgroundColor = interpolateColor(
      balanceContainerY.value,
      [MAX_TRANSLATE_Y + 100,-300],
      [Colors.primaryBgColor.newPrime,Colors.primaryBgColor.black],
    )

    return {
      borderRadius,
      backgroundColor,
      transform: [
        {translateY: balanceContainerY.value}
      ],
      
    }
  })

  const scrollTo = useCallback((destination: number) =>{
    'worklet'
    balanceContainerY.value = withSpring(destination,{damping:12})
  },[])

  const context = useSharedValue({y:0})

  const gesture = Gesture.Pan().onStart(() => {
    /* context.value = {y: balanceContainerY.value}
  }).onUpdate((event) => {
    balanceContainerY.value = event.translationY + context.value.y
    balanceContainerY.value = Math.max(balanceContainerY.value,MAX_TRANSLATE_Y-50)
  }).onEnd(() => {
    if(balanceContainerY.value > -SCREEN_HEIGHT / 1.5){
      scrollTo(-SCREEN_HEIGHT / 2.7)
    }else if(balanceContainerY.value < -SCREEN_HEIGHT / 1.5){
      scrollTo(MAX_TRANSLATE_Y - insets.top)
    } */
  })

  const animatedDateBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      balanceContainerY.value,
      [MAX_TRANSLATE_Y+300,-360],
      [
        Colors.primaryBgColor.prime,Colors.primaryBgColor.lightGray
      ],
    )
    return{
      backgroundColor
    }
  })

  const animatedText = useAnimatedStyle(() => {
    const fontSize = interpolate(
      balanceContainerY.value,
      [MAX_TRANSLATE_Y,MAX_TRANSLATE_Y+450],
      [30,20]
    )
    const opacity = interpolate(
      balanceContainerY.value,
      [MAX_TRANSLATE_Y,MAX_TRANSLATE_Y-30],
      [1,0.6],
    )
    return{
      fontSize,
      opacity,
    }
  })


  type DayObject = {
    dateString: string;
    DateString: string;
  };

  const handlePress = (day:DayObject) => {
    setDayPressed(true)
  }

  const navAllPressHandler = () => {

    /*  this will handle the press on the all nav press */
    /*  if pressed on All this will animate the navs to disapear and show only

          searchbar
          filters
          an x button to close the nav mode

    */
    if(tabs === "all"){
      /* Main Screen */
      mainNavContainerOp.value = withTiming(1,{ duration:500 })
      mainNavContainerIndex.value = 1
      mainNavContainerX.value = withSpring(0)
      allNavIndex.value = 1
      allNavOp.value = withTiming(1,{ duration:500 })


      /* Second Screen */
      secondNavContainerOp.value = withTiming(0,{ duration:500 })
      setTimeout(() => {
        secondNavContainerIndex.value = -3
        filterInd.value = -3
      }, 500);
      searchNavX.value = withTiming(-50,{ duration:500 })
      secondNavContainerHeight.value = withTiming(0,{ duration: 500 })
      filterNavOp.value = withTiming(0, { duration:500 })
      filterX.value = withTiming(-80,{ duration:500 })
      setTabs("week")
    }else {
      /* MAIN Screen */
      mainNavContainerOp.value = withTiming(0,{ duration:500 })
      mainNavContainerX.value = withTiming(300, { duration: 500 })
      allNavOp.value = withTiming(0,{ duration:500 })

      setTimeout(() => {
        mainNavContainerIndex.value = -3
      }, 500);
      setTimeout(() => {
        allNavIndex.value = -3
      }, 500);

      /* Second Screen */
      secondNavContainerHeight.value = withTiming(80,{ duration: 500 })
      secondNavContainerIndex.value = 1
      secondNavContainerOp.value = withTiming(1,{ duration:500 })
      searchNavIndex.value = 1
      searchNavOp.value = withTiming(1,{ duration:500 }) 
      searchNavX.value = withSpring(0)
      filterInd.value = 3
      filterNavOp.value = withTiming(1,{ duration:500 })
      filterX.value = withSpring(0, { damping:13})
      setTabs("all")
    }
   
  }

  useEffect(() => {
    /* scrollTo(-SCREEN_HEIGHT / 2.6) */
    scrollTo(-SCREEN_HEIGHT)
  },[])

  useEffect(() => {
    console.log("new value")
  },[value])

  useDerivedValue(() => {
    if (balanceContainerY.value < -SCREEN_HEIGHT / 1.5) {
      runOnJS(setSwiped)(false)
    } else {
      runOnJS(setSwiped)(true);
    }
  }, [balanceContainerY]);

  useEffect(() => {
    if(searchPressed){
      secondNavContainerHeight.value = withSpring(45)
      secondNavBG.value = withTiming(1,{ duration: 250 })
      filterMargin.value = withSpring(55)
    }else{
      secondNavContainerHeight.value = withSpring(80)
      secondNavBG.value = withTiming(0,{ duration: 250 })
      filterMargin.value = withSpring(90)
    }
  },[searchPressed])

  useEffect(() => {

    /* 
      if Filter has gotten any succesfull search than change to purple

      if no search found then change to another chosen color 
    */

    if(filterPressed){
      filterBg.value = withTiming(1,{ duration: 500 })
      filterHeight.value = withTiming(450, { duration: 500 })
    }else {
      filterBg.value = withTiming(0,{ duration: 500 })
      filterHeight.value = withTiming(45, { duration: 500 })
    }
  },[filterPressed])

  const fetchData = async() => {

    /* this could need a splashscreen for loading this data */
  
    try {
      // categoryData
      const yearData = await db.getCategoryYears()
      const monthData = await db.getCategoryMonths()
      const dayData = await db.getCategoryDays()
      if(cateYears){
        setCateYears(yearData)
      }
      
      if(monthData){
        setCateMonths(monthData)
      }

      if(dayData){
        setCateDays(dayData)
      }
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    /* 
      this should load all data on the beginning of the tab 
    */
    fetchData()

  },[])
  
  return (
    
  <GestureHandlerRootView>  
    <SafeAreaView>
    <View style={styles.container}>
      <StatusBar hidden={true} />
        <Animated.View style={[styles.dateContainer, animatedDateBackground, {zIndex:0}]}>
          
          <View style={styles.calendarContainer}>
            <CalendarList
            horizontal={true}
            style={[styles.calendarLayout,{}]}
            pastScrollRange={2}
            futureScrollRange={5}
            theme={{
              textDayFontFamily: '',
              textMonthFontFamily: 'MainFont',
              textDayHeaderFontFamily: 'MainFont',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 12,
              textMonthFontSize: 15,
              textDayHeaderFontSize: 12,
              weekVerticalMargin:10,
            }}
            pagingEnabled
            displayLoadingIndicator={false}
            markedDates={markedDates}   
            onMonthChange={(el) => {
              /* let currDateString = el.dateString.split("-")
              setSelectedMonth(currDateString[1])
              setSelectedYear(currDateString[0]) */
            }}
            dayComponent={({date,state,marking}) => {
              const automateDayValid = date?.day === Number(automateIncomeDay)
              const costsDayValid = date?.day === 1
              return(
                <TouchableOpacity onPress={() => {
                  handlePress({ dateString: date?.dateString})
                  setDayStringPressed(date?.dateString as string)
                  if(markedDates[date?.dateString] !== undefined){
                    scrollTo(-SCREEN_HEIGHT + insets.top + 50)
                  }
                  
                }} activeOpacity={0.5} style={[styles.dayDiv,{
                  backgroundColor: 
                  marking?.selected ? Colors.primaryBgColor.prime : marking?.marked ? Colors.primaryBgColor.lightGray :
                  automateDayValid ? Colors.primaryBgColor.lightPrime : costsDayValid? Colors.primaryBgColor.persianRed
                  : "white",
                  minWidth:50,
                  maxHeight:51,
                  overflow:"hidden"
                  
                }]}>
                  <Text style={{fontSize:16,fontFamily:"MainFont",color: state ? "blue" : "black"}}>{date?.day}</Text>
                  {marking?.marked && (
                    <Text style={[styles.amountLabel,{color: marking?.amount < 0 ? Colors.primaryBgColor.persianRed : "mediumgray"}]}>{numberInputValidation.converToString(marking?.amount.toFixed(2))} {currency}</Text>
                    
                  )}
                  {!marking?.marked &&  (
                    <Text style={{fontSize:10,fontFamily:"MainLight",color:"mediumgray",textAlign:"center"}}>{automateDayValid ? "Income" : costsDayValid ? "Fixed Ex.." : ""}</Text>
                  )}
                </TouchableOpacity>
              )
            }}
            />
          </View>
        </Animated.View>

          <GestureDetector gesture={gesture}>
          <Animated.View  style={[styles.modalBalanceContainer,animatedBalanceContainer,{backgroundColor:"black",borderRadius:13}]}>
            <View style={[{width:80,height:5,backgroundColor:Colors.primaryBgColor.black,marginTop:10,justifyContent:"center",alignSelf:"center",borderRadius:5}]}/>
              <View style={[styles.balanceContainer]}>
              {/* <HeaderComp/> */}
            {/* {dayPressed && !swiped && (
              <TouchableOpacity style={styles.btnBack} onPress={() => setDayPressed(false)} >
                <Text style={styles.btnLabel}>Back to Month</Text>
              </TouchableOpacity> 
            )} */}
            {dayPressed && (
              <DayView date={dateStringPressed} totalAmount={markedDates[dateStringPressed] && markedDates[dateStringPressed].amount} currency={currency} />
            )}

            {!dayPressed && !swiped && (
              <View style={{paddingHorizontal:30,width:"100%",marginTop:tabs === "all" ? 0 : 0}}>
                <View style={[styles.categorieBtnContainer,{width:"100%"}]}>  
                  {/* second container */}
                  <Animated.View style={[animatedSecondNav,{position:"absolute",width:"100%",borderColor:Colors.primaryBgColor.darkPurple,top:0}]}>
                    <Animated.View style={[animatedSearchNav,styles.secondContainer,{}]}>
                      <SecondNavComp  categoryList={categoryList} filteredData={filteredData} setFilteredData={setFilteredData} selectedMonth={selectedMonth} selectedYear={selectedYear} selectedDay={selectedDay} navAllPressHandler={navAllPressHandler} searchPressed={searchPressed} setSearchPressed={setSearchPressed} inputSearch={inputSearch} setInputSearch={setInputSearch} />
                    </Animated.View>
                    <Animated.View style={[animatedFilterNav,{borderRadius:8,position:"absolute",width:"100%"}]}>
                      <FilterNavComp  setSelectedDay={setSelectedDay} selectedYear={selectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} filteredData={filteredData} filterPressed={filterPressed} setFilterPressed={setFilterPressed}  categoryList={categoryList} setCategoryList={setCategoryList}/>
                  </Animated.View>
                  </Animated.View>
                  {/* main container */}
                  <Animated.View style={[animatedAllNav,{paddingLeft:10}]}>
                    <TouchableOpacity onPress={navAllPressHandler}>
                      <Text style={{
                        color: Colors.primaryBgColor.black,
                        fontSize:17,
                        fontFamily:"BoldFont"
                      }}>All</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <Animated.View style={[animatedMainNav,{justifyContent:"flex-end",flexDirection:"row",alignItems:"center",backgroundColor:Colors.primaryBgColor.gray,borderRadius:6,marginLeft:30}]}>
                    <CategorieBtn label={"Day"} onPress={() => {
                      setTabs("day")
                    }} focused={tabs === "day"}/>
                    <CategorieBtn label={"Month"} onPress={() => {
                      setTabs("month")
                    }} focused={tabs === "month"}/>
                    <CategorieBtn label={"Year"} onPress={() => {
                      setTabs("year")
                    }} focused={tabs === "year"}/>
                  </Animated.View>
              </View>
            </View>
            )}
          
            {!swiped && !dayPressed && tabs === "day" &&(
              <TransactionDataComponent typeDate={tabs} dateData={days} transModalVisible={transModalVisible} setTransModalVisible={setTransModalVisible} setId={setId}/>
            )}
            {!swiped && !dayPressed && tabs === "month" &&(
              <TransactionDataComponent typeDate={tabs} dateData={months} transModalVisible={transModalVisible} setTransModalVisible={setTransModalVisible} setId={setId}/>
            )}
            {!swiped && !dayPressed && tabs === "year" &&(
              <TransactionDataComponent typeDate={tabs} dateData={years} cateYears={cateYears} transModalVisible={transModalVisible} setTransModalVisible={setTransModalVisible} setId={setId}/>
            )}
            {!swiped && !dayPressed && tabs === "all" && (
              <FilterTransactionComp scrollbehaviour={false} setScrollingDown={setScrollingDown} setContentOffSetY={setContentOffSetY} style={{position:"absolute",top:150,height:450}} filteredData={filteredData} setFilteredData={setFilteredData} setTransModalVisible={setTransModalVisible} setId={setId}/>
            )}
          </View>
           
        </Animated.View>
        </GestureDetector>
        <TransactionModal visible={transModalVisible} setVisible={setTransModalVisible} id={id} setId={setId} />
    </View>
    </SafeAreaView>
  </GestureHandlerRootView>
  )
}


const styles = StyleSheet.create({
  container:{
    backgroundColor: Colors.primaryBgColor.lightGray,
    height:"100%",
    width:"100%",
    position:"relative"
  },
  amountLabel:{
    fontSize:9,
    fontFamily:"MainFont",
    color:"mediumgray",
    textAlign:"center",
  },
  secondContainer:{
    width:"100%",
    borderRadius:6,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal:10,
  },
  btnBack:{
    width:115,
    height:30,
    backgroundColor:Colors.primaryBgColor.prime,
    marginLeft:10,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    paddingHorizontal:5
  },
  btnLabel:{
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.white,
    fontSize:15
  },
  monthLinearLayout:{
    width:300,
    flexDirection:"row"
  },
  categorieBtnContainer:{
    width:"100%",
    alignItems:"center",
    flexDirection:"row",
    borderRadius:10,
    height:45,
  },
  modalBalanceContainer:{
    position:"absolute",
    width:"100%",
    top:SCREEN_HEIGHT,
    height:SCREEN_HEIGHT,
  },
  balanceContainer:{
    height:"100%",
    width:"100%",
    paddingTop:10,
  },
  calendarContainer:{
  },
  infoContainer:{

  },
  infoColumn:{
    backgroundColor:Colors.primaryBgColor.babyBlue,
    paddingHorizontal:0,
    paddingVertical:10,
    borderRadius:10,
    width:150,
    alignItems:"center",
    borderWidth:3,
    borderColor:Colors.primaryBgColor.prime
  },
  infoLabel:{
    fontSize:15,
    color:Colors.primaryBgColor.white,
    fontFamily:"MainFont"
  },
  infoLayout:{
    flexDirection:"row",
    gap:15,
    padding:10,
    flexWrap:"wrap",
    justifyContent:"center"
  },
  infoTotal:{
    fontFamily:"BoldFont",
    color:Colors.primaryBgColor.white,
    fontSize:20,
  },
  dayDiv:{
    borderRadius:5,
    padding:5,
    alignItems:"center"
  },
  calendarLayout:{
    borderRadius:20,
    height:"100%",
    fontSize:20,
  },
  dateHeaderContent:{
    flexDirection:"row",
    justifyContent:"space-between"
  },
  dateHeaderDiv:{
    justifyContent:"flex-end",
    paddingBottom:5,

  },
  dateContainer:{
    height:550,
    backgroundColor:Colors.primaryBgColor.prime,
    position:"relative",
    zIndex:-1
  },
  headerLabel:{
    fontFamily:"MainFont",
    fontSize:30
  },
  
})

export default transactions