import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'

import { usersBalanceContext } from "@/hooks/balanceContext";
import { Colors } from '@/constants/Colors';
import db from '@/services/serverSide'
import numberValidation from '@/services/numberInputValidation'

const TransactionElement = ({  setInfoId, currency, setVisibleModal, setEditMode, setEditId, setInfoModal, darkmode, dayView, givinData }) => {

    const { value,setValue, setMarkedDates } = useContext(usersBalanceContext)
    const [data,setData] = useState({})
    const [date,setDate] = useState([])
    const [initilaizedData,setInitilaizedData] = useState(false)

    const getImageSource = (description) => {

        switch (description.toLowerCase()) {
            case "drink":
            return require("@/assets/imagesMain/categories/drink.jpg");
            case "food":
            return require("@/assets/imagesMain/categories/food.png");
            case "education":
            return require("@/assets/imagesMain/categories/education.jpg");
            case "":
            return require("@/assets/imagesMain/categories/pomDefault.webp");
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

    const displayData = () => {
        let elements = []
        if(data === undefined) return
        for(let i = data.length - 1; i >= 0; i--){
            const isValuePositive = data[i].moneyValue > 0
            const getCorrectDate = data[i].date.split("-")
            const year = getCorrectDate[0]
            const month = getCorrectDate[1]
            const day = getCorrectDate[2]


            const isToday = year === date[2] && month === date[1] && day === date[0]

            elements.push(
                <TouchableOpacity key={data[i].id} style={styles.layout} onPress={() => {
                    setInfoModal(true)
                    setInfoId(data[i].id)
                }} onLongPress={() => {
                    if(month === date[1] && year === date[2] && data[i].automationType === "none"){
                        Alert.alert("Balance", "balance editor", [
                            { text: "Cancel", onPress: () => console.log(), style: "cancel" },
                            {
                              text: "Delete",
                              onPress: async() => {
                                await db.deleteSingleEntrie(data[i].id,data[i].moneyValue,data[i].balanceType === "plus" ? true : false);
                                const correctVal = await getBal()
                                setMarkedDates((prev) =>{
                                    let copy = prev
                                    const amount = copy[data[i].date].amount
                                    if(copy[data[i].date]){
                                        copy[data[i].date].amount = amount - data[i].moneyValue
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
                                setEditId(data[i].id)
                                setInfoId(0)
                              },
                            },
                          ]);
                    }else if(data[i].automationType === "income") alert("This is not configurable!")
                     else alert("NOT configurable\nOnly Transactions that made in this month and year are configurable")
                }}>
                    <View style={[styles.leftDiv]}>
                        <Image style={styles.image} source={getImageSource(data[i].type)}/>
                        <View>
                            <Text style={[styles.title,{color:data[i].automationType === "income" ? Colors.primaryBgColor.lightPrime : darkmode ? Colors.primaryBgColor.white : Colors.primaryBgColor.black}]}>{isLongVal(data[i].value)}</Text>
                            <Text style={styles.dateLabel}>{isToday ? "today" : data[i].date}</Text>
                        </View>
                    </View>
                    <View style={styles.valueDiv}>
                        <Text style={[styles.valueLabel,{color: isValuePositive ? Colors.primaryBgColor.prime : Colors.primaryBgColor.persianRed}]}>{numberValidation.converToString(data[i].moneyValue)}</Text>
                        <Text style={styles.currencyLabel}>{currency}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return elements
    }

    const fetchData = async() => {
        try {
            const getData = await db.getTransactions()
            const getDate = await db.createCurrentDate()
            setData(getData)
            setDate(getDate)
            setInitilaizedData(true)
        } catch (error) {
            setInitilaizedData(false)
            console.error("Error while fetching getAllData()",error)
        }
    }

    if(!dayView){
        useEffect(() => {
            fetchData()
        },[value])
    
        useEffect(() => {
            fetchData()
        },[])
    }else{dayView}{
        useEffect(() => {
            setData(givinData)
            setInitilaizedData(true)
        },[])
        useEffect(() => {
            setData(givinData)
            setInitilaizedData(true)
        },[givinData])
    }
    
  return (
    <View style={[styles.container,/* darkmode && styles.containerDark */]}>
        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollDiv,styles.scrollDarkDiv]}>
            {initilaizedData && displayData()}
        </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        marginTop:10,
        height:300,
        paddingHorizontal:12,
        gap:7,
    },
    containerDark:{
        backgroundColor:Colors.primaryBgColor.white,
        borderRadius:10,
    },
    scrollDiv:{
        gap:10
    },
    scrollDarkDiv:{
    },
    valueDiv:{
        flexDirection:"row",
        gap:5,
        justifyContent:"center",
        alignItems:"center"
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
        borderRadius:10
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