import { Colors } from '@/constants/Colors'
import { Stack, } from 'expo-router'
import { Tabs } from 'expo-router'
import { Image,Text,StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native';


import SettingsIcon from '../../assets/icons/pompomFriends.svg'; 
import BalanceIcon from '../../assets/icons/pompomBox.svg';
import HomeIcon from '../../assets/icons/pompomMuffin.svg';
import LottieView from 'lottie-react-native'

// create a modern navbar design 
// the tabbar has a safeArea thats why i couldnt center the elements
const _layout = () => {


  const [settingsRef,setSettingsRef] = useState(null)
  const [transactionsRef,setTransactionsRef] = useState(null)

  return (
    <Tabs   safeAreaInsets={{bottom:0}}  screenOptions={{ tabBarStyle:{
      backgroundColor:Colors.primaryBgColor.newPrime,
      position:"absolute",
      height:90,
      borderRadius:15,
      justifyContent:"center",
      paddingTop:10,
      alignItems:"center",
      marginBottom:0,
      borderColor:Colors.primaryBgColor.prime
    },
     
    }}>
      <Tabs.Screen listeners={(({ navigation, route}) => ({
        tabPress:(e) => {
          e.preventDefault()
          transactionsRef.reset()
          navigation.navigate(route.name)
          transactionsRef.play()
        }
      }))} name="transactions"  options={{ headerShown: false, tabBarIcon:({focused}) => (
          focused ? 
          <LottieView ref={(ref) => setTransactionsRef(ref)} speed={1} resizeMode='contain' loop={false} autoPlay={false} source={require("../../assets/lottie/transaction_lottie.json")} style={styles.lottieIcon}/>
          :
          <LottieView speed={1} resizeMode='contain' loop={false} autoPlay={false} source={require("../../assets/lottie/transaction_lottie_static.json")} style={styles.lottieIcon}/>
        ),
        tabBarLabel:({focused}) => (
          <Text style={{
            fontSize:15,
            fontFamily:"MainFont",
            color: focused ? Colors.primaryBgColor.prime : "black",
            fontWeight: focused ? "600" : "300"
          }} >Transactions</Text>
        )}}/>
        
      <Tabs.Screen listeners={(({navigation, route}) => ({
        tabPress: (e) => {
          console.log("pressed home")
        }
      }))} name="home" options={{ headerShown: false,tabBarIcon:({focused}) => (
         <HomeIcon/>
        ),
        tabBarLabel:({focused}) => (
          <Text style={{
            fontSize:15,
            fontFamily:"MainFont",
            color: focused ? Colors.primaryBgColor.prime : "black",
            fontWeight: focused ? "600" : "300"
          }} >Home</Text>
        )
        
        }}/>

      <Tabs.Screen  listeners={(({ navigation, route} )=> ({
        tabPress: (e) => {
          console.log("pressed settings")
          e.preventDefault()
          settingsRef.reset()
          navigation.navigate(route.name)
          settingsRef.play()
        }
      }) )} name="settings" options={{ headerShown: false, 
        tabBarIcon:({focused}) => (
          focused ? (
            <LottieView ref={(ref) => setSettingsRef(ref)} speed={1} resizeMode='contain' loop={false} autoPlay={true} source={require("../../assets/lottie/settings_lottie.json")} style={styles.lottieIcon}/>
          ) :
          <>
            <LottieView  speed={1} resizeMode='contain' loop={false} autoPlay={false} source={require("../../assets/lottie/settings_lottie_static.json")} style={styles.lottieIcon}/>
          </>
        ),
        tabBarLabel:({focused}) => (
          <Text style={{
            fontSize:15,
            fontFamily:"MainFont",
            color: focused ? Colors.primaryBgColor.prime : "black",
            fontWeight: focused ? "600" : "300"
          }} >Settings</Text>
        )
        
        }}/>

        
    </Tabs>
  )
}

const styles = StyleSheet.create({
  lottieIcon: {
    width:30,
    height:30,
  }
})

export default _layout