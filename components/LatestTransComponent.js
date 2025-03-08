import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors } from '@/constants/Colors'
import TransactionElement from '@/components/TransactionElement'
import { usersBalanceContext } from "@/hooks/balanceContext";

const LatestTransComponent = ({ setVisibleModal, setEditMode, setEditId, setInfoModal, setInfoId }) => {

    const {
        currency,setCurrency,
        username,setUsername,
    } = useContext(usersBalanceContext)

  return (
    <View style={styles.container}>
        <View style={{alignItems:"center",justifyContent:"center",marginBottom:5}} >
            <View style={{ width:70,height:10,backgroundColor:Colors.primaryBgColor.gray,borderRadius:10}}/>
        </View>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Latest Transactions</Text>
            <Text style={{ fontFamily: "MainLight" }}>{username}</Text>
        </View>

        <View style={styles.latestTransDiv}>
            <TransactionElement setInfoId={setInfoId} setInfoModal={setInfoModal} setEditId={setEditId} setVisibleModal={setVisibleModal} setEditMode={setEditMode} currency={currency}/>
        </View>
    </View>
  )
}

export default LatestTransComponent

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.primaryBgColor.prime,
        width:"100%",
        height:"100%",
        borderRadius:15,
        paddingVertical:10,
    },
    latestTransDiv:{
        height: 350,
        paddingHorizontal: 20,
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
        color: Colors.primaryBgColor.brown,
        fontFamily: "BoldFont",
    },
})