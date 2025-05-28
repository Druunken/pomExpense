import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { usersBalanceContext } from "@/hooks/balanceContext";
import { Colors } from '@/constants/Colors';
import db from '@/services/serverSide'
import numberValidation from '@/services/numberInputValidation'
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';

const TransactionElement = ({  setInfoId, currency, setVisibleModal, setEditMode, setEditId, setInfoModal, darkmode, dayView, givinData }) => {

    const { value,setValue, setMarkedDates } = useContext(usersBalanceContext)
    const [isExisting,setIsExisting] = useState(true)
    const [initilaizedData,setInitilaizedData] = useState(false)
    const [dataIsBig,setDataIsBig] = useState(false)
    const [renderedItem,setRenderedItem] = useState([])

    const getImageSource = (description) => {

        switch (description.toLowerCase()) {
            case "food":
            return require("../assets/lottie/food_lottie.json");
            case "drink":
            return require("../assets/lottie/drink_lottie");
            case "education":
            return require("../assets/lottie/education_lottie");
            case "grocerie":
            return require("../assets/lottie/groceries_lottie.json");
            case "shopping":
            return require("../assets/lottie/shopping_bag_lottie.json");
            case "":
            return require("../assets/lottie/settings_lottie.json");
            case "income":
            return require("../assets/lottie/income_lottie.json");

            default :
            return require("../assets/lottie/settings_lottie.json")
        }
    };

    const getBal = async() => {
        try {
            const getBal = await db.getBalance()
            const val = numberValidation.converToString(getBal)
            return val
        } catch (error) {
            console.error(error)            
        }
    }

    // show a shorter title
    const isLongVal = (title) => {
        if(title.length > 10){
            const arr = title.split("")
            return arr.slice(0,11).join("") + "..."
        }else return title
    }

    const displayData = async() => {
        let elements = []
        const fetchIt = await db.getTransactions()
        const date = await db.createCurrentDate()
        
        if(fetchIt.length > 13) setDataIsBig(true)

        for(let i = 0; i < fetchIt.length; i++){
            const isValuePositive = fetchIt[i].moneyValue > 0
            const getCorrectDate = fetchIt[i].date.split("-")
            const year = getCorrectDate[0]
            const month = getCorrectDate[1]
            const day = getCorrectDate[2]

            const isToday = year === date[2] && month === date[1] && day === date[0]
            elements.push(
                <TouchableOpacity key={fetchIt[i].id} style={styles.layout} onPress={() => {
                    setInfoModal(true)
                    setInfoId(fetchIt[i].id)
                }} onLongPress={() => {
                    if(month === date[1] && year === date[2] && fetchIt[i].automationType === "none"){
                        Alert.alert("Balance", "balance editor", [
                            { text: "Cancel", onPress: () => console.log("cancel"), style: "cancel" },
                            {
                              text: "Delete",
                              onPress: async() => {
                                await db.deleteSingleEntrie(fetchIt[i].id,fetchIt[i].moneyValue,fetchIt[i].balanceType === "plus" ? true : false);
                                const correctVal = await getBal()
                                setMarkedDates((prev) =>{
                                    let copy = prev
                                    const amount = copy[fetchIt[i].date].amount
                                    if(copy[fetchIt[i].date]){
                                        copy[fetchIt[i].date].amount = amount - fetchIt[i].moneyValue
                                    }
                                    return copy
                                })
                                setValue(correctVal)
                                setInfoId(0)
                              },
                              style: "destructive",
                            },
                            {
                              text: "Edit",
                              onPress: () => {
                                setVisibleModal(true)
                                setEditMode(true)
                                setEditId(fetchIt[i].id)
                                setInfoId(0)
                              },
                            },
                          ]);
                    }else if(fetchIt[i].automationType === "income") alert("This is not configurable!")
                     else alert("NOT configurable\nOnly Transactions that made in this month and year are configurable")
                }}>
                    <View style={[styles.leftDiv]}>
                        <LottieView autoPlay={false} loop={false} style={styles.image} source={getImageSource(fetchIt[i].type)}/> 
                        <View>
                            <Text style={[styles.title,{color:fetchIt[i].automationType === "income" ? Colors.primaryBgColor.lightPrime : darkmode ? Colors.primaryBgColor.white : Colors.primaryBgColor.black}]}>{isLongVal(fetchIt[i].value)}</Text>
                            <View style={{flexDirection:"row",gap:20}}>
                                <View style={styles.dateDiv}>
                                    <Text style={styles.dateLabel}>{isToday ? "today" : fetchIt[i].date}</Text>
                                </View>
                                <View style={styles.genreDiv}>
                                    <Text style={styles.genreLabel}>{fetchIt[i].subType}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.valueDiv}>
                        <Text style={[styles.valueLabel,{color: isValuePositive ? Colors.primaryBgColor.prime : Colors.primaryBgColor.persianRed}]}>{numberValidation.converToString(fetchIt[i].moneyValue)}</Text>
                        <Text style={styles.currencyLabel}>{currency}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        setInitilaizedData(true)
            
        if(fetchIt.length < 1) setIsExisting(false)
        else setIsExisting(true)

        setRenderedItem(elements)
    }

    /* const fetchData = async() => {
        try {
            console.log("new data here")
            const getData = await db.getTransactions()
            const getDate = await db.createCurrentDate()
            setData(getData)
            setDate(getDate)
            
        } catch (error) {
            setInitilaizedData(false)
            console.error("Error while fetching getAllData()",error)
        }
    } */

    const viewMoreHandle = () =>{
        console.log("route to Transactions History with the date")
        router.push("/transactions")
    }

    if(!dayView){
        useEffect(() => {
            displayData()
        },[value])
    
        useEffect(() => {
            displayData()
        },[])
    }else{dayView}{
        useEffect(() => {
            console.log(givinData)
            /* setRenderedItem(givinData) */
            setInitilaizedData(true)
        },[])
        useEffect(() => {
            console.log(givinData)
            /* setRenderedItem(givinData) */
            setInitilaizedData(true)
        },[givinData])
    }

    
  return (
    <View style={[styles.container,/* darkmode && styles.containerDark */]}>
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollDiv,styles.scrollDarkDiv]}>
            {renderedItem}
            {!isExisting && (
                <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center",marginTop:80}}>
                    <LottieView autoPlay loop source={require("../assets/lottie/settings_lottie.json")} style={styles.noDataLottie} />
                </View>
            )}
            {dataIsBig && (
                <View style={{width:"100%",alignItems:"center",justifyContent:"center",marginTop:10}}>
                    <TouchableOpacity style={styles.btn} onPress={viewMoreHandle}>
                        <Text style={styles.label}>View more</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        marginTop:10,
        height:"100%",
        paddingHorizontal:12,
        gap:7,
        justifyContent:"center",
        alignItems:"center",
    },
    btn:{
        width:"100%",
        height:45,
        backgroundColor:Colors.primaryBgColor.lightPrime,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:2,
        borderColor:Colors.primaryBgColor.gray

    },
    genreDiv:{
        borderWidth:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:Colors.primaryBgColor.chillOrange,
        paddingHorizontal:5,
        borderRadius:10,
        minWidth:50
    },
    dateDiv:{
        justifyContent:"center",
        alignItems:"center",
        minHeight:30
    },
    genreLabel:{
        fontSize:8,
        fontFamily:"MainReg",

    },
    noDataLottie:{
        width:50,
        height:50
    },
    containerDark:{
        backgroundColor:Colors.primaryBgColor.white,
        borderRadius:10,
    },
    scrollDiv:{
        gap:10,
    },
    valueDiv:{
        flexDirection:"row",
        gap:5,
        justifyContent:"center",
        alignItems:"center",
    },
    leftDiv:{
        flexDirection:"row",
        alignItems:"center",
        gap:17
    },
    dateLabel:{
        color:Colors.primaryBgColor.gray,
        fontSize:14,
        fontFamily:"MainReg"
    },
    image:{
        width:50,
        height:50,
    },
    layout:{
        width:"100%",
        height:65,
        justifyContent:"space-between",
        padding:5,
        flexDirection:"row",
        alignItems:"center",
        borderBottomWidth:0.2,
        borderColor:Colors.primaryBgColor.gray

    },
    label:{
        fontSize:15,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black
    },
    title:{
        fontSize:20,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black
    },
    titleDark:{
        fontSize:20,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.lightGray
    },
    currencyLabel:{
        color:Colors.primaryBgColor.gray,
        fontSize:14,
        fontFamily:"MainReg"
    },
    valueLabel:{
        fontSize:20,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black,
    },


})

export default TransactionElement