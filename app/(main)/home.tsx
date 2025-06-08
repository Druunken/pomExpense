import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Platform
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import ModalTransactions from '@/components/ModalTransactions'
import SystemNavigationBar from 'react-native-system-navigation-bar';

import { Colors } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

import { usersBalanceContext } from "@/hooks/balanceContext";
import ModalInfoTransaction from '@/components/ModalInfoTransaction'
import BalanceContainer from '@/components/BalanceContainer'
import AddTransactionBtn from '@/components/AddTransactionBtn'
import LatestTransComponent from '@/components/LatestTransComponent'
import OverviewComponent from '@/components/OverviewComponent'
import { Calendar, CalendarList } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";



// ** *** TECHNICAL SOLUTIONS *** ** //

// ** *** DESIGN SOLUTIONS *** ** //
const home = () => {


  const {
    currency,
    value,setValue,
  } = useContext(usersBalanceContext)

  const [expenseMode,setExpenseMode] = useState(true)
  const [editMode,setEditMode] = useState(false)
  const [editId,setEditId] = useState(0)


  const [visibleModal,setVisibleModal] = useState(false)
  const [infoModal,setInfoModal] = useState(false)
  const [infoId,setInfoId] = useState(0)
  
  const [visibleOverview, setVisibleOverview] = useState(false)
  
  const balanceOpacity = useSharedValue(1)
  const balanceColor = useSharedValue(1)

  const containerBg = useSharedValue(0)

  const containerOpacity = useSharedValue(0)

  const insets = useSafeAreaInsets()

  const balanceFade = () =>{
    balanceOpacity.value = 0
    balanceOpacity.value = withTiming(1, { duration: 500 })
    balanceColor.value = withTiming(0, { duration: 600 }, () => {
      balanceColor.value = withDelay(2250,withTiming(1, { duration:500 }))
    })
  }

  const animatedContainer = useAnimatedStyle(() => {
    return{
      backgroundColor: interpolateColor(
        containerBg.value,
        [0,1],
        [Colors.primaryBgColor.newPrime, Colors.primaryBgColor.darkPurple]
      )
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value
    }
  })


  useEffect(() => {
    containerOpacity.value = withTiming(1, {duration:1500})
  }, [])

  useEffect(() => {
    if(visibleOverview){
      containerBg.value = withTiming(1, { duration:500 })
    }else{
      containerBg.value = withTiming(0, { duration:500 })
    }
  },[visibleOverview])

  // ** MAIN COMPONENT ** //

  return (
    <Animated.View style={[styles.container,animatedContainer]}>
      <StatusBar hidden={true} />
      {/* <ImageBackground style={styles.pomBg}source={require("@/assets/imagesMain/pompomBg.png")}/> */}
      <SafeAreaView style={{paddingTop: Platform.OS === "android" && insets.top}}>
        <OverviewComponent visibleOverview={visibleOverview} setVisibleOverview={setVisibleOverview}/>
        <Animated.View style={[containerStyle]}>
          <ModalTransactions editId={editId} balanceFade={balanceFade} value={value} setValue={setValue} editMode={editMode} setEditMode={setEditMode} expenseMode={expenseMode} setExpenseMode={setExpenseMode} visible={visibleModal} setVisible={setVisibleModal}/>
          <ModalInfoTransaction id={infoId} visible={infoModal} setVisible={setInfoModal}/>
          <BalanceContainer currency={currency} value={value} setVisibleOverview={setVisibleOverview} visibleOverview={visibleOverview}/>
          <AddTransactionBtn setVisibleModal={setVisibleModal}/>
          <LatestTransComponent setInfoId={setInfoId} setInfoModal={setInfoModal} setEditId={setEditId} setEditMode={setEditMode} setVisibleModal={setVisibleModal}/>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primaryBgColor.newPrime,
    position: "relative",
  },
  pomBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  overviewContainer:{
    width:"100%",
    height:350,
    position:"absolute",
    top:0,
    paddingHorizontal:15,
  },
  overViewLayout:{
    backgroundColor: Colors.primaryBgColor.chillOrange,
    borderRadius: 15,
    borderColor: Colors.primaryBgColor.white,
    borderWidth: 2,
    zIndex:1,
    width:"100%",
    height:"100%",

  },
});

export default home;
