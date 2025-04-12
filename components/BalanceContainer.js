import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import numberValidation from '@/services/numberInputValidation'
import { Colors } from '@/constants/Colors';
import LottieView from 'lottie-react-native';

const BalanceContainer = ({ value, currency, setVisibleOverview, visibleOverview}) => {




  const opacityContainer = useSharedValue(0)
  const indexContainer = useSharedValue(-1)

  const balanceOpacity = useSharedValue(1)
  const balanceColor = useSharedValue(1)


  const animatedContainer = useAnimatedStyle(() => {
    return{
      opacity:opacityContainer.value,
      zIndex:indexContainer.value,
    }
  })

  const balanceChangeAnimation = useAnimatedStyle(() =>{
    return {
      opacity: balanceOpacity.value,
      color: interpolateColor(
        balanceColor.value,
        [0,1],
        [
          Number(value) > 0 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.persianRed,Colors.primaryBgColor.brown
        ]
      )
    }
  })

  const pressHandler = () => {
    setVisibleOverview(true)
    
  }

  useEffect(() => {
    if(visibleOverview){
      opacityContainer.value = withTiming(0, { duration: 500})
      setTimeout(() => {
        indexContainer.value = -1
      }, 500);
    }else{
      indexContainer.value = 1
      setTimeout(() => {
        opacityContainer.value = withTiming(1, { duration: 800})
      }, 500);
    }
  },[visibleOverview])
  return (
    <Animated.View  style={[styles.balanceContainer,animatedContainer]} onPress={pressHandler}>
      <TouchableOpacity activeOpacity={1} onPress={pressHandler} style={{width:"100%",height:"100%"}}>
            <View style={styles.balanceDiv}>
              <View style={styles.balanceLayout}>
                {/* <Image
                  resizeMode="contain"
                  style={styles.pomCoffee}
                  source={require("@/assets/imagesMain/pomCoffee.png")}
                /> */}
                <LottieView loop autoPlay style={{width:120,height:80}} resizeMode='cover' source={require("../assets/lottie/lottieCoffee.json")} />
                <View style={{ padding: 5, alignItems: "center" }}>
                  <Text style={[styles.pomText,]}>PomBalance</Text>
                  <View style={[{ flexDirection: "row", alignItems: "center" }]}>

                    <Animated.Text style={[styles.balanceText,balanceChangeAnimation]}>
                      {value}
                    </Animated.Text>

                    <Text style={styles.currencyText}>
                      {currency}
                    </Text>

                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    paddingRight: 15,
                    paddingBottom: 5,
                  }}
                >
                  <Text style={{ fontSize: 8, fontFamily: "BoldFont" }}>
                    CrdNum: XXX XXX
                  </Text>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    paddingLeft: 10,
                    paddingBottom: 5,
                  }}
                >
                  <Text style={{ fontSize: 8, fontFamily: "BoldFont" }}>
                    PomPomVisa
                  </Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          </Animated.View>
  )
}

const styles = StyleSheet.create({
  balanceContainer: {
    alignItems: "center",
    height: 230,
  },
  balanceDiv: {
    position: "relative",
    width: "100%",
    padding: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.05,
    elevation: 4,
  },
  pomText:{
    fontSize:16,
    fontFamily:"MainFont"
  },
  balanceText:{
    fontFamily: "BoldFont",
    color:Colors.primaryBgColor.brown,
    fontSize:35
  },
  currencyText:{
    fontSize: 14,
    fontFamily: "RegFont",
    color: Colors.primaryBgColor.brown,
  },
  balanceLayout: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 180,
    backgroundColor: Colors.primaryBgColor.chillOrange,
    borderRadius: 15,
    borderColor: Colors.primaryBgColor.white,
    borderWidth: 2,
  },
  pomBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,/* 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20, */
    overflow: "hidden",
  },
  pompomBg2: {
    width: "100%",
    height: 300,
    borderWidth: 1,
  },
  pomCoffee: {
    width: 100,
    height: 80,
  },
})

export default BalanceContainer