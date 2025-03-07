import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, Platform, StatusBar } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";


import Mainpom from '../assets/icons/pompomFriends.svg'
import  db  from '../services/serverSide.js'
import { incomeActiveContext, usersBalanceContext } from "../hooks/balanceContext";
import { AppInitializationContext } from "../hooks/appContext";
import numberValidation from '../services/numberInputValidation'
import ModalEntryForm from '../components/ModalEntryForm'
import AnimatedSplashScreen from '../components/AnimatedSplashScreen.js'
import AnimatedViewComp from '../components/AnimatedViewComp.js'

// ** ** Build splash Art
// ** ** **  Make the layout responsive throught out devices ** ** ** //


export default function Index() {
  const { 
    automateIncomeDay,setAutomateIncomeDay,
    currentIncome,setCurrentIncome
  } = useContext(incomeActiveContext)

  const {
    firstLaunch,setFirstLaunch
  } = useContext(AppInitializationContext)

  const {
    setCurrency,
    setValue
  } = useContext(usersBalanceContext)

  const [pointer,setPointer] = useState(1)

  const [currentState,setCurrentState] = useState("launch")
  const [textContent,setTextContent] = useState("loading")

  const [modalVisible,setModalVisible] = useState(false)

  const [count,setCount] = useState(0)

  const [modalSwipe,setModalSwipe] = useState(false)


  const width = useSharedValue(300)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(0)

  const arrowY = useSharedValue(0)
  const arrowOpacity = useSharedValue(0)
 
  const scaleDown = () => {
    width.value = withSpring(100)
    setTimeout(()=>{
      width.value = withSpring(300)
    },1000)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return{
      width: width.value,
      opacity: opacity.value
    }
  })
  
  const fadeDown = () => {
    arrowY.value = withRepeat(
      withTiming(90, {duration: 1000}),
      -1,
      true
    )
  }

  const arrowOnPress = () => {
    arrowOpacity.value = withTiming(0, { duration: 500})
  }

  const animatedArrow = useAnimatedStyle(() => {

    return{
      transform: [
        { translateY : arrowY.value },
      ],
      opacity: arrowOpacity.value

    }
  })

  const fadeIn = () => {
    opacity.value = withTiming(1,{duration:3500})
  }


  const progress = useSharedValue(0)

  const animatedBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0,1],
        ["white",Colors.primaryBgColor.newPrime]
      )
    }
  })

  const router = useRouter();

  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);
  const opacity4 = useSharedValue(0);
  const opacity5 = useSharedValue(0);
  const opacity6 = useSharedValue(0);

  const yVal1 = useSharedValue(-100);
  const yVal2 = useSharedValue(-100);
  const yVal3 = useSharedValue(-100);
  const yVal4 = useSharedValue(-100);
  const yVal5 = useSharedValue(-100);
  const yVal6 = useSharedValue(-100);

  const modalOpacity = useSharedValue(0)
  const modalY = useSharedValue(0)
  const modalX = useSharedValue(0)



  const startAnimationOpacity = () => {
    opacity1.value = withTiming(1, { duration: 500 }, () => {
      opacity2.value = withTiming(1, { duration: 700 }, () => {
        opacity3.value = withTiming(1, { duration: 700 }, () => {
          opacity4.value = withTiming(1, { duration: 700 }, () => {
            opacity5.value = withTiming(1, { duration: 700 }, () => {
              opacity6.value = withTiming(1, { duration: 700 }, () =>{
                arrowOpacity.value = withTiming(1, { duration: 1000})
              });
            });
          });
        });
      });
    });
  }

  const finalAnimationOpacity = () => {
    opacity1.value = withTiming(0, { duration: 300 }, () => {
      opacity2.value = withTiming(0, { duration: 500 }, () => {
        opacity3.value = withTiming(0, { duration: 500 }, () => {
          opacity4.value = withTiming(0, { duration: 500 }, () => {
            opacity5.value = withTiming(0, { duration: 500 }, () => {
              opacity6.value = withTiming(0, { duration: 500 });
            });
          });
        });
      });
    });
  }

  const startAnimationY = () => {
    yVal1.value = withTiming(0, { duration: 500}, () => {
      yVal2.value = withTiming(0,{ duration: 500}, () => {
        yVal3.value = withTiming(0,{ duration: 700}, () => {
          yVal4.value = withTiming(0,{ duration: 700}, () => {
            yVal5.value = withTiming(0,{ duration: 700}, () => {
              yVal6.value = withTiming(0,{ duration: 700})
            })
          })
        })
      })
    })
  }

  const finalAnimationY = () => {
    yVal1.value = withTiming(-100, { duration: 500}, () => {
      yVal2.value = withTiming(-100,{ duration: 500}, () => {
        yVal3.value = withTiming(-100,{ duration: 500}, () => {
          yVal4.value = withTiming(-100,{ duration: 300}, () => {
            yVal5.value = withTiming(-100,{ duration: 400}, () => {
              yVal6.value = withTiming(-100,{ duration: 500})
            })
          })
        })
      })
    })
  }

  const loadingBarWidth = useSharedValue(10)


  const animateLoadingBar = useAnimatedStyle(() => ({
    width: loadingBarWidth.value
  }))


  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [ { translateY: yVal1.value}],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [ { translateY: yVal2.value}],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [ { translateY: yVal3.value}],
    opacity: opacity3.value,
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    opacity: opacity4.value,
    transform: [ { translateY: yVal4.value}],
  }));
  const animatedStyle5 = useAnimatedStyle(() => ({
    opacity: opacity5.value,
    transform: [ { translateY: yVal5.value}],
  }));
  const animatedStyle6 = useAnimatedStyle(() => ({
    opacity: opacity6.value,
    transform: [ { translateY: yVal6.value}],
  }));

  const modalAnimation = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [ { translateY: modalY.value}, {translateX: modalX.value} ],
  }))

  const colors = [
    Colors.primaryBgColor.prime,
    Colors.primaryBgColor.babyBlue,
    Colors.primaryBgColor.light,
    Colors.primaryBgColor.brown,
    Colors.primaryBgColor.persianRed,

  ]

  const loadingTextX = useSharedValue(0)

  const textAnimate = useAnimatedStyle(() => ({
    transform: [
      { translateX: loadingTextX.value}
    ]
  }))

  useEffect(()=> {
    loadingBarWidth.value = withTiming(150, { duration:2000},() => {
      loadingBarWidth.value = withTiming(200, { duration: 3000}, () => {
        loadingBarWidth.value = withTiming(300, { duration:1000})
      })
    })
    loadingTextX.value = withTiming(130, { duration:2000},() => {
      loadingTextX.value = withTiming(170, { duration: 3000}, () => {
        loadingTextX.value = withTiming(240, { duration:1000})
      })
    })
    setTimeout(()=>{
      setTextContent("Finish!")
    }, 6000)
  },[])

  useEffect(() => {
    startAnimationOpacity()
    startAnimationY()
    fadeIn()
    fadeDown()
  },[])

  useEffect(() => {
    if(count == colors.length){
      setCount(0)
    }
  },[count])

  const asyncUpdateFirstLaunch = async() => {
    try {
      const updateLaunch = await db.updateUserVisited(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {

    if(!firstLaunch){
      progress.value = withTiming(1,{duration:1000})
      /* setTimeout(() => {
        asyncUpdateFirstLaunch()
        router.push("/(main)/home")
      },10000) */
    }
  },[firstLaunch])
 
  useEffect(() => {
    if(currentState == "configure"){
      modalOpacity.value = withTiming(1, { duration: 500 })
      modalY.value = withSpring(-270, { damping: 500})
    }
  },[currentState])

  useEffect(() =>{
    if(modalSwipe === true){
      modalX.value = withSpring(-300, {damping:5000})
      modalOpacity.value = withTiming(0, {duration:150})
      setTimeout(()=> {
        modalX.value = withSpring(0, {damping:5000})
        modalOpacity.value = withTiming(1, {duration:150})
        setModalSwipe(false)
      },250)
    }
  },[modalSwipe])

  /* const createCurrentDate = async() => {
    const date = await db.createCurrentDate()
    const day = date[0]
    const month = date[1]
    const year = date[2]
    setCurrentDate(date[3])
    setCurrentDate(day)
    setCurrentMonth(month)
    setCurrentYear(year)
  } */

  const setBalance = async() => {
    try {
      const balance = await db.getBalance()
      const convert = numberValidation.converToString(balance)

      setValue(convert)
    } catch (error) {
      console.error(error)
    }
  }
  

  useEffect(() => {
    setPointer(1)
    setCurrency("")
  },[])

  useEffect(() => {
    if(pointer === 8){
      setModalVisible(false)
      setCurrentState("setup")
      scaleDown()
      setTimeout(() => {
        setFirstLaunch(false)
      }, 2000);
    }
  },[pointer])

  /* START OF THE APP */

  useEffect(() => {
    if(firstLaunch){
      db.createDefaultMonthsProps()

      setPointer(1)
      setCurrency("")
      setValue("")
    }else{
      setBalance()
      db.InitialiseMonthsProps()
    }
  },[])

  const insets = useSafeAreaInsets()

  return (

      <Animated.View style={[animatedBackground,{flex:1,position:"relative",backgroundColor:Colors.primaryBgColor.white}]}>
        
        {/* <AnimatedViewComp/> */}
        {!firstLaunch && (
          <AnimatedSplashScreen/>
        )}
        <ModalEntryForm visible={modalVisible} pointer={pointer} setPointer={setPointer}/>
        {firstLaunch && (
          <ImageBackground resizeMode="cover" style={styles.pomPomBg}  source={require("../assets/imagesMain/pompomBg4.jpg")}/>
        )}
        <SafeAreaView style={{flex:1,position:"relative", paddingTop:Platform.OS === "android" && insets.top}}>
          
        <View style={[styles.greetContainer]}>

          
          <View style={[styles.descripContainer]}>
            {firstLaunch && (
              <View style={{alignItems:"center",gap:30}}>
                <Animated.View style={[styles.descripDiv, animatedStyle1,{display:"none"}]}>
                  <Text style={styles.descripP}>A cute simple way to track withdraws.</Text>
                </Animated.View>

                <View style={{flexDirection:"row",gap:30}}>
                  <Animated.View style={[styles.descripDiv,animatedStyle2, {backgroundColor:Colors.primaryBgColor.light}]}>
                    <Text style={styles.descripP}>#fast</Text>
                  </Animated.View>
                  <Animated.View style={[styles.descripDiv,animatedStyle, {backgroundColor:Colors.primaryBgColor.light}]}>
                    <Text style={[styles.descripP, {fontSize:18}]}>#simple</Text>
                  </Animated.View>
                </View>

                <Animated.View style={[styles.descripDiv, animatedStyle3,{backgroundColor:Colors.primaryBgColor.dark}]}>
                  <Text style={styles.descripP}>no fancy tracker </Text>
                </Animated.View>

                <View style={{flexDirection:"row",gap:30}}>
                  <Animated.View style={[styles.descripDiv, animatedStyle4, {backgroundColor:Colors.primaryBgColor.brown}]}>
                    <Text style={[styles.descripP, { color:"white" }]}>#safe</Text>
                  </Animated.View>
                  <Animated.View style={[styles.descripDiv, animatedStyle5, {backgroundColor:Colors.primaryBgColor.brown}]}>
                    <Text style={[styles.descripP, { color:"white" }]}>#secure</Text>
                  </Animated.View>
                  <Animated.View style={[styles.descripDiv, animatedStyle6, {backgroundColor:Colors.primaryBgColor.brown}]}>
                    <Text style={[styles.descripP, { color:"white" }]}>#reliable</Text>
                  </Animated.View>
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                  setCount(prev => prev + 1)
                }}>

                  <Animated.View style={[animatedArrow,styles.descripDiv,{backgroundColor:colors[count]}]}>
                    <Ionicons name="arrow-down" size={40}></Ionicons>
                  </Animated.View>
                </TouchableOpacity>

              </View>
              
            )}

          </View>
          
        </View>
        {firstLaunch && (
          <View style={[styles.btnContainer, {zIndex: currentState == "configure" ? 100 : 1,}]}>

          <Animated.View style={[styles.btnLayout,animatedStyle,{width}]}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => {
                  if(currentState == "setup"){
                    scaleDown()
                    setCurrentState("start")
                    finalAnimationOpacity()
                    finalAnimationY()
                    setTimeout(() => {
                    router.push("/(main)/home")
                  },3000)
                  } 
                  if(currentState == "launch"){
                    arrowOnPress()
                    scaleDown()
                    setCurrentState("operating")
                    setTimeout(() => {
                    setCurrentState("configure")
                    setModalVisible(true)
                  },1000)
                  }
                }}>
                <Animated.View style={[styles.btn,{width}]}>
                  <Mainpom style={[styles.pomMain, {width:50,height:50}]} resizeMode="contain"/>
                  <Animated.View>
                    <Text style={{fontFamily:"MainFont"}}>{
                      currentState === "launch" 
                      ? "Start Tracking" 
                      : currentState == "operating" 
                      ? "operating db" 
                      : currentState == "setup" 
                      ? "press if you ready"
                      : currentState == "start"
                      && "starting.."
                      }</Text>
                  </Animated.View>
                  <Ionicons name="arrow-forward" size={30} />
                </Animated.View>
              </TouchableOpacity>
          </Animated.View>
        </View>
        )}
        </SafeAreaView>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container:{ 
    
  },
  input:{
    borderWidth:1,
    width:100,
    height:50,
    justifyContent:"center",
    alignItems:"center",
    textAlign:"center",
    fontFamily:"MainFont",
    borderRadius:10,
    fontSize:20,
    backgroundColor:"white",
    color:"black"
  },
  btnText:{
    fontSize:20,
    backgroundColor:"white",
    color:"black",
    fontFamily:"MainFont"
  },
  chatDiv:{
    position:"absolute",
    top:50,
    right:50,
    left:50,
    transform: [{translateX: 0}, {translateY:300}],
    alignItems:"center",
    zIndex:100,
    justifyContent:"center",
  },
  inputContainer:{
    width:300,
    height:300,
    borderRadius:20,
    alignItems:"center",
    flexDirection:"column",
    justifyContent:"center",
    gap:30,
  }, 
  pomMain:{
    width:100,
    height:100,
  },
  pomPomBg:{
    position:"absolute",
    width:"100%",
    height:"100%",
  },
  loadingContainer:{
    backgroundColor:"white",
    width:300, 
    height:30,
    borderRadius:8,
    justifyContent:"center",
    paddingVertical:3,
    borderColor:Colors.primaryBgColor.prime
  },
  loadingLayout:{
    backgroundColor:Colors.primaryBgColor.prime,
    borderWidth:3,
    height:"100%",
    width:"10%",
    borderRadius:5,
    borderColor:Colors.primaryBgColor.babyBlue

  },
  loadingIcon:{
    backgroundColor:"white",
    borderRadius:20 
  },
  btn:{
    height:65,
    alignItems:"center",
    justifyContent:"space-between",
    backgroundColor:Colors.primaryBgColor.light,
    borderRadius:10,
    borderWidth:3,
    paddingBottom:3,
    flexDirection:"row",
    paddingHorizontal:10
  },
  btnLayout:{
    borderWidth:3,
    borderRadius:10,
    padding:2,
    backgroundColor:Colors.primaryBgColor.prime,
    alignItems:"flex-start",
    paddingBottom:5,
    paddingLeft:4,
  },
  descripContainer:{
    width:"100%",
    flexDirection:"column",
    gap:10,
    alignItems:"center",

  },
  descripDiv:{
    backgroundColor:Colors.primaryBgColor.prime,
    borderRadius:20,
    padding:15,
  },
  descripDiv2:{
    backgroundColor:Colors.primaryBgColor.prime,
    borderRadius:20,
    padding:15,
    flexDirection:"row",
    gap:20
  },
  descripP:{
    fontFamily:"BoldFont",
    fontSize:20
  },
  btnContainer:{
    alignItems:"center",
    paddingBottom:15,
  },
  greetContainer:{
    alignItems:"center",
    flex:1,
    paddingHorizontal:15,
    gap:30,
  },
  greetP:{
    fontSize:35,
    fontWeight:900,
    color:"white",
    borderWidth:3,
    padding:10,
    borderRadius:10,
    backgroundColor:Colors.primaryBgColor.prime,
    width:"100%",
    borderColor:"white",
    overflow:"hidden",
    textAlign:"center"
  },
  greetLayout:{
    width:"100%",
    alignItems:"center",
    justifyContent:"center",
    textAlign:"center",
    borderWidth:3,
    backgroundColor:Colors.primaryBgColor.babyBlue,
    padding:3,
    borderRadius:13,
    borderColor:"white"
  }

})
