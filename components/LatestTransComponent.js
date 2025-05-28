import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import TransactionElement from '@/components/TransactionElement'
import { usersBalanceContext } from "@/hooks/balanceContext";
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get("window").height

const LatestTransComponent = ({ setVisibleModal, setEditMode, setEditId, setInfoModal, setInfoId }) => {

    const {
        currency,setCurrency,
        username,setUsername,
    } = useContext(usersBalanceContext)


    const [availableHeight,setAvailableHeight] = useState(350)

    useEffect(() => {
        /* hardcorded val 500 */
        setAvailableHeight(screenHeight - 500)
    },[])
  return (
    <View style={styles.container}>
        {/* <View style={{alignItems:"center",justifyContent:"center",marginBottom:5}} >
            <View style={{ width:70,height:10,backgroundColor:Colors.primaryBgColor.gray,borderRadius:10}}/>
        </View> */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Latest Transactions</Text>
            <Text style={{ fontFamily: "MainLight" }}>{username}</Text>
        </View>

        <View style={[styles.latestTransDiv,{height:availableHeight}]}>
            <TransactionElement setInfoId={setInfoId} setInfoModal={setInfoModal} setEditId={setEditId} setVisibleModal={setVisibleModal} setEditMode={setEditMode} currency={currency}/>
        </View>
    </View>
  )
}

export default LatestTransComponent

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        borderRadius:15,
        paddingVertical:10,
    },
    latestTransDiv:{
        paddingHorizontal: 15,
    },
    header:{
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerTitle:{
        textAlign: "center",
        fontSize: 18,
        color: Colors.primaryBgColor.black,
        fontFamily: "BoldFont",
    },
})