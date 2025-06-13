import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import db from '@/services/serverSide'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import numberInputValidation from '@/services/numberInputValidation'
import { months } from '../constants/Dates.js'

const FilterTransactionComp = ({ filteredData, setFilteredData, setTransModalVisible, setId , monthView, yearView, queryState, setContentOffSetY, style }) => {


    const [renderItems,setRenderItems] = useState([])


    /* 
    ANIMATION
    */

    const noDataOp = useSharedValue(0)
    const noDataInd = useSharedValue(-3)


    const dataRdyOp = useSharedValue(0)
    const dataRdyInd = useSharedValue(-3)


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

    const firstMountFetch = async() => {
      try {
        let data;
        if(monthView){
          data = await db.dynamicQuery(queryState,undefined)
        }else if(yearView){
          data = await db.dynamicQuery(undefined,queryState)
        }else{
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
              type.toLowerCase() == "fixed cost" ? Colors.primaryBgColor.brown : Colors.primaryBgColor.newPrimeLight
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
    <View style={[styles.container,style]}>
      <View style={styles.transactionContainer}>
        <Animated.View style={[animatedNoData,{position:"absolute",top:0,justifyContent:"center",alignItems:"center",width:"100%",height:350}]}>
          <Text style={styles.infoLabel}>No data</Text>
          <LottieView style={styles.lottieNoData} source={require("../assets/lottie/settings_lottie.json")} autoPlay loop/>
        </Animated.View>
        {/* 

            Graph Component is missing here.
            It should appear before the transactions

            The graph component can be shared between the def stages in the opening transaction page-
            that means we could use it 4 times 

            Thought could be 

         */}
        <Animated.View style={[animatedDataRdy]}>
          <ScrollView scrollEnabled scrollEventThrottle={16} contentContainerStyle={styles.itemContainer} onScroll={(ev) => {
            setContentOffSetY(ev.nativeEvent.contentOffset.y )
          }}>
            {renderItems}
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  )
}

export default FilterTransactionComp

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:35,
        height:250,
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
      flexGrow:1,
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