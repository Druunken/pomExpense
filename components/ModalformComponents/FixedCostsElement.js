import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from '@/constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import inputConverter from '@/services/numberInputValidation'
import { usersBalanceContext } from "@/hooks/balanceContext"
import db from '@/services/serverSide'
const minX = 150
const WIDTH = 300

const FixedCostsElement = ({ title, amount, type="expense", id, currency, del}) => {

    const [pressed,setPressed] = useState(false)

    const { fixedCostAmount,setFixedCostAmount } = useContext(usersBalanceContext)

  return (
    <TouchableOpacity  activeOpacity={0.7} style={[styles.container]} onPress={() => setPressed(true)} >
        {pressed && (
            <View style={styles.modal} >
                <View style={styles.exitDiv}>
                    <TouchableOpacity onPress={() => setPressed(false)}>
                        <Icon name={"close"} color={Colors.primaryBgColor.white} size={35}/>
                    </TouchableOpacity>                   
                </View>
                <TouchableOpacity onPress={() => {
                    
                }} >
                    <Icon name={"edit"} color={Colors.primaryBgColor.prime} size={35}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { 
                    const actualCost = inputConverter.convertToNumber(fixedCostAmount)
                    const sum = actualCost + amount
                    console.log(sum,"SUM")
                    const res = inputConverter.converToString(sum)
                    console.log(res,"RES")

                    setFixedCostAmount(res)
                    del(id,amount)
                 }}>
                    <Icon name={"delete"} color={Colors.primaryBgColor.persianRed} size={35}/>
                </TouchableOpacity>        
            </View>
        )}

        <View style={styles.elementDiv} >
            <View style={styles.div} >
                <Text style={styles.title}>ID:</Text>  
                <Text style={styles.label}>{id}</Text>            
            </View>
            <View style={styles.div} >
                <Text style={styles.title}>Title:</Text>  
                <Text style={styles.label}>{title}</Text>            
            </View>
            <View style={styles.div}>
                <Text style={styles.title}>Amount:</Text>
                <Text style={[styles.label,{color:Colors.primaryBgColor.persianRed}]}>-{amount} {currency}</Text>            
            </View>
                <View style={styles.div}>
                    <Text style={styles.title}>Type:</Text>
                    <Text style={styles.label}>{type ? type : "Expense"}</Text>
                </View>
        </View>
    </TouchableOpacity>
  )
}

export default FixedCostsElement

const styles = StyleSheet.create({
    container:{
        gap:5,
        borderWidth:0.5,
        borderColor:"white",
        borderRadius:10,
        backgroundColor:Colors.primaryBgColor.babyBlue,
        alignItems:"flex-start",
        width:WIDTH
    },
    title:{
        fontFamily:"MainFont",
        fontSize:20,
        color:Colors.primaryBgColor.prime
    },
    div:{
        flexDirection:"row",
        gap:10,
        justifyContent:"space-between",
        alignItems:"center",
        width:"100%",
        borderBottomWidth:0.5,

    },
    label:{
        fontSize:17,
        color:Colors.primaryBgColor.black,
        fontFamily:"MainFont"
    },
    modal:{
        width:"100%",
        height:"100%",
        borderColor:"white",
        position:"absolute",
        backgroundColor:'rgba(0, 0, 0, 0.9)',
        zIndex:100,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        gap:20,
    },
    elementDiv:{
        padding:10,
    },
    exitDiv:{
        right:10,
        top:10,
        position:"absolute"
    },
})