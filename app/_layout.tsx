import { Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import * as Font from 'expo-font';
import { BalanceProvider, IncomeProvider, usersBalanceContext } from "../hooks/balanceContext";
import { AppInitializationProvider } from '../hooks/appContext'
import * as SplashScreen from 'expo-splash-screen';
import db from '../services/serverSide'
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
  const [appReady,setAppReady] = useState(false)



  
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const prepareApp = async() => {
      try {
        await Font.loadAsync({
          "MainFont": require("../assets/fonts/MainFont/Nunito-Bold.ttf"),
          "BoldFont": require("../assets/fonts/MainFont/Nunito-ExtraBold.ttf"),
          "MainReg": require("../assets/fonts/MainFont/Nunito-Regular.ttf"),
          "MainLight": require("../assets/fonts/MainFont/Nunito-Light.ttf")
        })
        const createDb = await db.newOpening()
        if(createDb) setAppReady(true)
        else setAppReady(false)

      } catch (error) {
        console.error(error,"BEGINNING OF THE APP")
      } finally{
        SplashScreen.hideAsync();
      }
    }
    prepareApp()
  },[])

  if(!appReady){
    return null
  }


  return (
    <SafeAreaProvider>
      <AppInitializationProvider>
        <IncomeProvider>
          <BalanceProvider>
            <Stack>
              <Stack.Screen name="(main)" options={{ headerShown: false, animation:"none"}}  />
              <Stack.Screen name="index" options={{ headerShown: false,statusBarStyle:"dark"}}/>
              <Stack.Screen name="auth"/>
            </Stack>
          </BalanceProvider>
        </IncomeProvider>
      </AppInitializationProvider>
    </SafeAreaProvider>
  );
}
