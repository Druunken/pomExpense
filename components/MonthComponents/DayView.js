import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import TransactionsComponent from '@/components/TransactionsComponent'
import db from '@/services/serverSide'
import TransactionElement from '../TransactionElement'
import numberInputValidation from '@/services/numberInputValidation'

const DayView = ({ date, totalAmount, currency }) => {
    const [data,setData] = useState({})
    const [lenTrans,setLenTrans] = useState(0)

    const fetchDayTrans = async() => {
        try {
            const fetchData = await db.getDayTrans(date)
            setData(fetchData)
            setLenTrans(fetchData.length)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDayTrans()
    },[date])

  return (
    <View style={styles.container}>
        {totalAmount !== undefined && (
            <>
                <View style={styles.infoDiv}>
                    <View style={{flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={[styles.label, {fontSize:23}]}>Date</Text>
                        <Text style={styles.dateLabel}>{date}</Text>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={[styles.label, {fontSize:23}]}>Total</Text>
                        <Text style={styles.dateLabel}>{numberInputValidation.converToString(totalAmount.toFixed(2))}{currency}</Text>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={[styles.label, {fontSize:23}]}>Total Transactions</Text>
                        <Text style={styles.dateLabel}>{lenTrans}</Text>
                    </View>
                </View>
                <TransactionElement  darkmode={true} dayView={true} givinData={data}/>
            </>
        )}
        {totalAmount === undefined && (
            <Text style={[styles.label,{textAlign:"center"}]}>No Transactions made</Text>
        )}
        {/* <TransactionsComponent data={data}/> */}
    </View>
  )
}

export default DayView

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20
    },
    label:{
        fontSize:30,
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont"
    },
    header:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:20
    },
    dateLabel:{
        fontSize:25,
        color:Colors.primaryBgColor.lightGray,
        fontFamily:"MainFont"
    },
})