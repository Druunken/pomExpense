import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Animated, {  Extrapolation, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import {CalendarList} from 'react-native-calendars';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors'
import CategorieBtn from '@/components/CategorieBtn';
import TransactionsComponent from '@/components/TransactionsComponent';
import GraphComponent from '@/components/GraphComponent';
import { usersBalanceContext, incomeActiveContext } from "@/hooks/balanceContext";
import MonthInfoComp from '@/components/MonthComponents/MonthInfoComp.js'
import DayView from '@/components/MonthComponents/DayView'
import numberInputValidation from '@/services/numberInputValidation';
import HeaderComp from '@/components/MonthComponents/HeaderComp'


const { height: SCREEN_HEIGHT } = Dimensions.get('window')


// Build a graph that displays all transactions made by month and day
// calculate the differences between months and days
// 

const transactions = () => {

  const insets = useSafeAreaInsets()

  const effectiveHeigth = SCREEN_HEIGHT - insets.top - insets.bottom
  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + insets.top + 50


  const [swiped,setSwiped] = useState(false)
  const [dateStringPressed,setDayStringPressed] = useState("")
  const [dayPressed,setDayPressed] = useState(false)

  const { currency,value,markedDates } = useContext(usersBalanceContext)
  const { automateIncomeDay } = useContext(incomeActiveContext)

  const [currentMonth,setCurrentMonth] = useState("")
  const [currentYear,setCurrentYear] = useState("")

  const [tabs,setTabs] = useState("linear")



  const balanceContainerY = useSharedValue(0)

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
      ["black",Colors.primaryBgColor.prime],
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
    context.value = {y: balanceContainerY.value}
  }).onUpdate((event) => {
    balanceContainerY.value = event.translationY + context.value.y
    balanceContainerY.value = Math.max(balanceContainerY.value,MAX_TRANSLATE_Y-50)
  }).onEnd(() => {
    if(balanceContainerY.value > -SCREEN_HEIGHT / 1.5){
      scrollTo(-SCREEN_HEIGHT / 2.7)
    }else if(balanceContainerY.value < -SCREEN_HEIGHT / 1.5){
      scrollTo(MAX_TRANSLATE_Y)
    }
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

  useEffect(() => {
    scrollTo(-SCREEN_HEIGHT + insets.top + 50)
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
  
  return (
    
  <GestureHandlerRootView>  
    <View style={styles.container}>
        <Animated.View style={[styles.dateContainer, animatedDateBackground, {zIndex:0}]}>
          <SafeAreaView>
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
              textDayFontSize: 15,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 14,
              weekVerticalMargin:10,
            }}
            pagingEnabled
            displayLoadingIndicator={false}
            markedDates={markedDates}   
            onMonthChange={(el) => {
              let currDateString = el.dateString.split("-")
              setCurrentMonth(currDateString[1])
              setCurrentYear(currDateString[0])
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
                  <Text style={{fontSize:20,fontFamily:"MainFont",color: state ? "blue" : "black"}}>{date?.day}</Text>
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
          </SafeAreaView>
        </Animated.View>

          <GestureDetector gesture={gesture}>
          <Animated.View  style={[styles.modalBalanceContainer,animatedBalanceContainer,{backgroundColor:"black",borderRadius:13}]}>
            <View style={[{width:80,height:5,backgroundColor:Colors.primaryBgColor.prime,marginTop:10,justifyContent:"center",alignSelf:"center",borderRadius:5}]}/>
              <View style={styles.balanceContainer}>
              <HeaderComp/>
            {/* {dayPressed && !swiped && (
              <TouchableOpacity style={styles.btnBack} onPress={() => setDayPressed(false)} >
                <Text style={styles.btnLabel}>Back to Month</Text>
              </TouchableOpacity> 
            )} */}
            
            {dayPressed && (
              <DayView date={dateStringPressed} totalAmount={markedDates[dateStringPressed] && markedDates[dateStringPressed].amount} currency={currency} />
            )}

            {!dayPressed && !swiped && (
              <View style={styles.categorieBtnContainer}>
              <CategorieBtn label={"Linear"} onPress={() => {
                setTabs("linear")
              }} focused={tabs === "linear"}/>
              <CategorieBtn label={"Graph"} onPress={() => {
                setTabs("graph")
              }} focused={tabs === "graph"}/>
              <CategorieBtn label={"Transactions"} onPress={() => {
                setTabs("transactions")
              }} focused={tabs === "transactions"}/>
            </View>
            )}
          
            {!swiped && !dayPressed && tabs === "linear" &&(
              <MonthInfoComp month={currentMonth} year={currentYear} />
            )}
            {!swiped && !dayPressed && tabs === "graph" &&(
              <GraphComponent month={currentMonth} year={currentYear} />
            )}
            {!swiped && !dayPressed && tabs === "transactions" &&(
              <ScrollView>
                <TransactionsComponent month={currentMonth} year={currentYear} />
              </ScrollView>
            )}
            
          </View>
           
        </Animated.View>
        </GestureDetector>
    </View>
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
    fontSize:10,
    fontFamily:"MainFont",
    color:"mediumgray",
    textAlign:"center",

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
    justifyContent:"center",
    flexDirection:"row",
    gap:10,
    marginVertical:15
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