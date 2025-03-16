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

import { Colors } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
} from "react-native-reanimated";

import { usersBalanceContext } from "@/hooks/balanceContext";
import ModalInfoTransaction from '@/components/ModalInfoTransaction'
import BalanceContainer from '@/components/BalanceContainer'
import AddTransactionBtn from '@/components/AddTransactionBtn'
import LatestTransComponent from '@/components/LatestTransComponent'
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
  
  const balanceOpacity = useSharedValue(1)
  const balanceColor = useSharedValue(1)

  const containerOpacity = useSharedValue(0)

  const insets = useSafeAreaInsets()

  const balanceFade = () =>{
    balanceOpacity.value = 0
    balanceOpacity.value = withTiming(1, { duration: 500 })
    balanceColor.value = withTiming(0, { duration: 600 }, () => {
      balanceColor.value = withDelay(2250,withTiming(1, { duration:500 }))
    })
  }

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value
    }
  })


  useEffect(() => {
    containerOpacity.value = withTiming(1, {duration:1500})
  }, [])

  // ** MAIN COMPONENT ** //

  return (
    <View style={styles.container}>
      {/* <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" /> */}
     {/*  <ImageBackground style={styles.pomBg}source={require("@/assets/imagesMain/pompomBg.png")}/> */}
      <SafeAreaView style={{paddingTop: Platform.OS === "android" && insets.top}}>
        <Animated.View style={[containerStyle]}>
        <ModalTransactions editId={editId} balanceFade={balanceFade()} value={value} setValue={setValue} editMode={editMode} setEditMode={setEditMode} expenseMode={expenseMode} setExpenseMode={setExpenseMode} visible={visibleModal} setVisible={setVisibleModal}/>
        <ModalInfoTransaction id={infoId} visible={infoModal} setVisible={setInfoModal}/>
        <BalanceContainer currency={currency} value={value} />
        <AddTransactionBtn setVisibleModal={setVisibleModal}/>
        <LatestTransComponent setInfoId={setInfoId} setInfoModal={setInfoModal} setEditId={setEditId} setEditMode={setEditMode} setVisibleModal={setVisibleModal}/>
        </Animated.View>
      </SafeAreaView>
    </View>
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
});

export default home;
