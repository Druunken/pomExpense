import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CondBtn from './CondBtn'
import { Colors } from '@/constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import db from '@/services/serverSide'
import numberInputValidation from '@/services/numberInputValidation'

const ModalInfoTransaction = ({ id, visible, setVisible }) => {

    const [amount,setAmount] = useState("")
    const [date,setDate] = useState("")
    const [name,setName] = useState("")
    const [type,setType] = useState("")

    const fetchData = async(id) => {
        try {
            const data = await db.getSingleEntry(id)
            if(!data) return
            const fixedNum = numberInputValidation.converToString(data.moneyValue)
            setName(data.value)
            setDate(data.date)
            setType(data.type)
            setAmount(fixedNum)
            
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log("Current ID:",id)
        fetchData(id)
    },[id])

  return (
    <Modal transparent visible={visible} animationType='slide' >
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.exitDiv}>

                    <TouchableOpacity onPress={() => {setVisible(false)}} >
                        <Icon size={40} color={"white"} name={"close"}/>
                    </TouchableOpacity>


                </View>
                <Text style={styles.title}>Information</Text>
                <View style={{gap:30}}>
                    <View style={styles.infoDiv}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.val}>{name}</Text>
                    </View>

                    <View style={styles.infoDiv}>
                        <Text style={styles.label}>Amount</Text>
                        <Text style={styles.val}>{amount}</Text>
                    </View>

                    <View style={styles.infoDiv}>
                        <Text style={styles.label}>Date</Text>
                        <Text style={styles.val}>{date}</Text>
                    </View>

                    <View style={styles.infoDiv}>
                        <Text style={styles.label}>Type</Text>
                        <Text style={styles.val}>{type}</Text>
                    </View>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default ModalInfoTransaction

const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center"
    },
    infoDiv:{
        justifyContent:"center",
        alignItems:"center",
        gap:2
    },
    val:{
        fontSize:20,
        color:Colors.primaryBgColor.lightGray,
        fontFamily:"MainFont"
    },
    title:{
        fontSize:30,
        color:Colors.primaryBgColor.babyBlue,
        fontFamily:"MainFont",
        textAlign:"center"
    },
    content:{
        backgroundColor:'rgba(0, 0, 0, 0.9)',
        width:"100%",
        height:500,
        borderRadius:10,
        padding:13,

    },  
    exitDiv:{
        position:"absolute",
        zIndex:100,
        left:10,
        top:10,
    },
    label:{
        fontSize:25,
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont",
    }
})