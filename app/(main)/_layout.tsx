import { Colors } from '@/constants/Colors'
import { Stack, } from 'expo-router'
import { Tabs } from 'expo-router'
import { Image,Text } from 'react-native'
import React from 'react'


import SettingsIcon from '../../assets/icons/pompomFriends.svg'; 
import BalanceIcon from '../../assets/icons/pompomBox.svg';
import HomeIcon from '../../assets/icons/pompomMuffin.svg';

// create a modern navbar design 
// the tabbar has a safeArea thats why i couldnt center the elements
const _layout = () => {
  return (
    <Tabs  safeAreaInsets={{bottom:0}}  screenOptions={{ tabBarStyle:{
      backgroundColor:Colors.primaryBgColor.prime,
      position:"absolute",
      height:110,
      borderRadius:15,
      justifyContent:"center",
      paddingTop:20,
    },
     
    }}>
      <Tabs.Screen name="transactions"   options={{ headerShown: false, tabBarIcon:({focused}) => (
          <BalanceIcon height={32} width={32} fill={focused ? Colors.primaryBgColor.prime : Colors.txtColor.dark} />
        ),
        tabBarLabel:({focused}) => (
          <Text style={{
            fontSize:15,
            fontFamily:"MainFont",
            color: focused ? Colors.primaryBgColor.white : "black",
            fontWeight: focused ? "600" : "300",
          }} >Transactions</Text>
        )}}/>
        
      <Tabs.Screen  name="home" options={{ headerShown: false,tabBarIcon:({focused}) => (
         <HomeIcon height={35} width={35}/>
        ),
        tabBarLabel:({focused}) => (
          <Text style={{
            fontSize:15,
            fontFamily:"MainFont",
            color: focused ? Colors.primaryBgColor.white : "black",
            fontWeight: focused ? "600" : "300"
          }} >Home</Text>
        )
        
        }}/>

      <Tabs.Screen  name="settings" options={{ headerShown: false,tabBarIcon:({focused}) => (
         <SettingsIcon height={35} width={35}/>
        ),
        tabBarLabel:({focused}) => (
          <Text style={{
            fontSize:15,
            fontFamily:"MainFont",
            color: focused ? Colors.primaryBgColor.white : "black",
            fontWeight: focused ? "600" : "300"
          }} >Settings</Text>
        )
        
        }}/>

        
    </Tabs>
  )
}

export default _layout