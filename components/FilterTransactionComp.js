import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import db from '@/services/serverSide'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import numberInputValidation from '@/services/numberInputValidation'
import { months } from '../constants/Dates.js'
import { Ionicons } from '@expo/vector-icons'

const FilterTransactionComp = ({ givinStyle, scrollingDown,filteredData, setFilteredData, scrollbehaviour, setTransModalVisible, setId , monthView, yearView, dayView, queryState, style, setContentOffSetY, setScrollingDown }) => {


    const [renderItems,setRenderItems] = useState([])

    const prevOffestY = useRef(0)

    const [pressedUpBtn,setPressedUpBtn] = useState(false)

    const scrollViewRef = useRef(null)


    /* 
    ANIMATION
    */

    const noDataOp = useSharedValue(0)
    const noDataInd = useSharedValue(-3)


    const dataRdyOp = useSharedValue(0)
    const dataRdyInd = useSharedValue(-3)

    const containerHeight = useSharedValue(500)

    const scrollBg = useSharedValue(0)

    const upBtnOp = useSharedValue(0)

    const animatedNoData = useAnimatedStyle(() => {
      return {
        opacity: noDataOp.value,
        zIndex: noDataInd.value
      }
    })
    const animatedDataRdy = useAnimatedStyle(() => {
      return {
        opacity: dataRdyOp.value,
        zIndex: dataRdyInd.value,
      }
    })

    const animatedContainer = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        scrollBg.value,
        [0,1],
        [Colors.primaryBgColor.black,Colors.primaryBgColor.newPrimeLight]
      )
      return{
        height: containerHeight.value,
        backgroundColor:backgroundColor
      }
    })
    const animatedUpBtn = useAnimatedStyle(() => {
      return {
        opacity:upBtnOp.value,
      }
    })

    const animateValidtion = (valid) => {
      if(!valid){
          noDataOp.value = withTiming(1,{duration:250})
          noDataInd.value = 0

          setTimeout(() => {
            dataRdyInd.value = -3
          }, 250);
          dataRdyOp.value = withTiming(0,{ duration:250 })
        }else{
          noDataOp.value = withTiming(0,{duration:250})
          setTimeout(() => {
            noDataInd.value = -3
          }, 250);

          dataRdyOp.value = withTiming(1, {duration:250})
          dataRdyInd.value = 0
        } 
    } 


    const pressHandler = (id) => {
      setTransModalVisible(true)
      setId(id)
    }

    const scrollToTop = () => {
      scrollViewRef.current?.scrollTo({ y:0, animated: true })
    }

    const firstMountFetch = async() => {
      try {
        let data;
        if(monthView){
          data = await db.dynamicQuery(queryState,undefined)
        }else if(yearView){
          data = await db.dynamicQuery(undefined,queryState)
        }else if(dayView){
          let dateString = queryState.split("-")
          let month = dateString[1]
          let year = dateString[0]
          let day = dateString[2]
          data = await db.dynamicQuery(month,year,"","","",undefined,day)
        }
        else{
          data = await db.dynamicQuery()
        }
        setFilteredData(data)
        animateValidtion(data.length > 0 ? true : false)
        elementToRender(data.length > 0 ? true : false,data)
      } catch (error) {
        console.error(error,"firstMountFetch")
      
      }
    }

    useEffect(() => {
      firstMountFetch()
    },[])

    useEffect(() => {
      firstMountFetch()
    },[queryState])

    /* useEffect(() => {

      animateValidtion(filteredData?.length > 0 ? true : false)
      if(monthView || yearView) return console.log(queryState)
      else elementToRender(filteredData?.length > 0 ? true : false)
  
    },[filteredData]) */

    const getReadableDate = (date) => {      const arr = date.split("-")
      const year = arr[0]
      const month = months[arr[1]]
      const day = arr[2]
      return day + " " + month + " "  + year
    }

    const handleScroll = (ev) => {
      if(!scrollbehaviour) return
      const currOffset = ev.nativeEvent.contentOffset.y
      const isScrollingDown = currOffset >= prevOffestY.current
      prevOffestY.current = currOffset
      if(isScrollingDown && currOffset > 5 && !scrollingDown){
        
        setScrollingDown(true)
        scrollBg.value = withTiming(1,{ duration:500})
        containerHeight.value = withTiming(600,{ duration: 500 })
        upBtnOp.value = withTiming(0,{ duration: 450 })
        if(pressedUpBtn){
          setPressedUpBtn(false)
        }
        return
      }else if (currOffset < 5){
        containerHeight.value = withTiming(500,{ duration: 400 })
        upBtnOp.value = withTiming(0,{ duration: 450 })
        setScrollingDown(false)
        scrollBg.value = withTiming(0,{ duration:500})
        return
      }else if(!isScrollingDown && currOffset > 5 && !pressedUpBtn){
        upBtnOp.value = withTiming(1,{ duration: 450 })
        return 
      }
    }

    const upPressHandle = () => {
      setScrollingDown(false)
      setPressedUpBtn(true)
      scrollToTop()
      scrollBg.value = withTiming(0,{ duration:500})
      containerHeight.value = withTiming(500,{ duration: 400 })
      upBtnOp.value = withTiming(0,{ duration: 450 })
    }

    const elementToRender = (valid,data) => {
      if(valid){
        let elementsArr = []
        let dateMemo = ""
        let flag = false
        for(let i = 0; i < data?.length; i++){
          const title = data[i].value
          const moneyValue = data[i].moneyValue
          const date = data[i].date
          const type = data[i].type
          const id = data[i].id
          let dateDiff = date
          if(dateMemo !== dateDiff){
            dateDiff = date
            dateMemo = date
            flag = true
          }
          elementsArr.push(
            <View key={i}>
              { flag && (
                <View style={{borderBottomWidth:0.2,marginBottom:5}}>
                  <Text style={styles.dateLabel}>{getReadableDate(date)}</Text>
                </View>
              )}
            <View style={[styles.transactionDiv,{
              backgroundColor: 
              type.toLowerCase() === "income" ? Colors.primaryBgColor.prime :
              type.toLowerCase() == "fixed cost" ? Colors.primaryBgColor.chillOrange : Colors.primaryBgColor.newPrimeLight
            }]}>
              <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-between",width:"100%",alignItems:"center",height:"100%"}} onPress={() => pressHandler(id)}>
              <View style={styles.lPart}>
                <Text style={styles.title}>{title}</Text>
                <View>
                  <Text style={[styles.title,{fontFamily:"LightFont",color:Colors.primaryBgColor.gray}]}>{date}</Text>
                </View>
              </View>

              <View style={styles.rPart}>
                <Text style={[styles.title,{color:type.toLowerCase() === "income" ? Colors.primaryBgColor.white : Colors.primaryBgColor.persianRed,fontSize:17,}]}>{numberInputValidation.converToString(moneyValue)} $</Text>
              </View>
              </TouchableOpacity>
            </View>
            </View>
          )
          flag = false
        }
        return setRenderItems(elementsArr)
      }
    }


  return (
    <Animated.View style={[styles.container,animatedContainer,style && style,givinStyle,{borderWidth:0}]}>
      <View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
        <View style={{width:60,height:5,backgroundColor:Colors.primaryBgColor.white,borderRadius:10}}/>
      </View>
      <View style={styles.transactionContainer}>
        <Animated.View style={[animatedNoData,{justifyContent:"center",alignItems:"center",width:"100%",position:"absolute"}]}>
          <Text style={styles.infoLabel}>No data</Text>
          <LottieView style={styles.lottieNoData} source={require("../assets/lottie/settings_lottie.json")} autoPlay loop/>
        </Animated.View>

        <Animated.View style={[animatedUpBtn,styles.upBtnDiv,{}]}>
          <TouchableOpacity style={styles.upBtn} onPress={upPressHandle}>
            <Ionicons name='arrow-up' size={30}/>
          </TouchableOpacity>
        </Animated.View>
        {/* 

            Graph Component is missing here.
            It should appear before the transactions

            The graph component can be shared between the def stages in the opening transaction page-
            that means we could use it 4 times 

            Thought could be 

         */}
        <Animated.View style={[animatedDataRdy]}>
          <ScrollView  ref={scrollViewRef} bounces={false} scrollEnabled scrollEventThrottle={16} contentContainerStyle={styles.itemContainer} /* stickyHeaderHiddenOnScroll stickyHeaderIndices={[0]}  */onScroll={(ev) => {
            handleScroll(ev)
          }}>
            {/* <View style={{backgroundColor:Colors.primaryBgColor.babyBlue,padding:5,borderRadius:5}}>
              <Text style={[styles.label,{color:Colors.primaryBgColor.black}]}>Transactions</Text>
            </View> */}
            
            {renderItems}
          </ScrollView>
        </Animated.View>
      </View>
    </Animated.View>
  )
}

export default FilterTransactionComp

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:35,
    },
    upBtnDiv:{
      position:"absolute",
      bottom:150,
      zIndex:100,
      justifyContent:"center",
      alignItems:"center",
      right:0
    },
    upBtn:{
      width:50,
      height:50,
      backgroundColor:Colors.primaryBgColor.newPrimeLight,
      borderRadius:10,
      borderWidth:1,
      borderColor:Colors.primaryBgColor.babyBlue,
      justifyContent:"center",
      alignItems:"center",

    },
    transactionContainer:{
    },
    dateLabel:{
      fontSize:15,
      fontFamily:"MainFont",
      color:Colors.primaryBgColor.prime
    },
    lPart:{
      justifyContent:"center"
    },
    rPart:{
      justifyContent:"center",
      alignItems:"center"
    },
    lottieNoData:{
      width:70,
      height:70
    },
    itemContainer:{
      gap:10,
      paddingBottom:200,
      paddingTop:50
    },
    title:{
      fontSize:13,
      color:Colors.primaryBgColor.black,
      fontFamily:"MainFont",
    },
    infoLabel:{
      fontFamily:"MainFont",
      fontSize:15,

    },
    label:{
        color:Colors.primaryBgColor.prime,
        fontSize:25,
        fontFamily:"MainFont"
    },
    transactionDiv:{
      width:"100%",
      height:55,
      borderWidth:0.3,
      borderRadius:6,
      paddingHorizontal:20,
      paddingVertical:5,
      backgroundColor:Colors.primaryBgColor.newPrimeLight
    }

})