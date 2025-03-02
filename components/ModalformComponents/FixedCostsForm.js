import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import CondBtn from '../CondBtn'
import FixedCostsRowInput from '@/components/FixedCostsRowInput'
import AddRoundBtn from '@/components/AddRoundBtn'
import FixedCostsElement from '@/components/ModalformComponents/FixedCostsElement'
import { usersBalanceContext } from "@/hooks/balanceContext"
import inputConverter from '@/services/numberInputValidation'
import { Colors } from '@/constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import db from '@/services/serverSide'
import numberInputValidation from '@/services/numberInputValidation'

const FixedCostsForm = ({ setPointer, setPointerSeen, inset}) => {
  const [showAdd,setShowAdd] = useState(false)
  const [cate,setCate] = useState("")
  const [amount,setAmount] = useState("0")
  const [title,setTitle] = useState("")
  const [fixedCostArr,setFixedCostArr] = useState([])
  const [data,setData] = useState([])

  const { currency, setFixedCostAmount, fixedCostAmount } = useContext(usersBalanceContext)

  const addRow = async() => {
    const num = inputConverter.convertToNumber(amount)
    await db.createCostsColumn(title,num,"Expense")
    getAllItems()
  }

  const deleteRow = async(id,amount) => {
    const rmColumn = await db.deleteCostsColumn(id,amount)
    getAllItems()
  }

  const displayElements = () => {
    let elements = []
    for(let i = 0; i < data.length; i++){
      elements.push(
        <FixedCostsElement key={data[i].id} id={data[i].id} setAmount={setAmount} del={deleteRow} currency={currency} title={data[i].value} amount={data[i].moneyValue} type={data[i].type} />
      )
    }
    return elements
  }

  const getAllItems = async() => {
    try {
      const data = await db.getAllCosts()
      setData(data)
      displayElements()

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllItems()
  },[])

  return (
    <View style={[styles.container,{}]}>
      <KeyboardAvoidingView style={styles.keyboardDiv} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
      {!showAdd && data.length === 0 && (
        <View style={styles.infoDiv}>
          <Icon name={"info"} size={20} />
          <Text style={{fontSize:25,color:"white",fontFamily:"MainFont",textAlign:"center"}}>Each row stands for a transaction</Text>
        </View>  
      )}
      {!showAdd && data.length !== 0 && (
        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.scrollDiv} showsVerticalScrollIndicator={false}>
            {fixedCostArr.length !== undefined && (
              displayElements()
            )}
          </ScrollView>
        </View>
      )}
      {showAdd && (
        <View style={{paddingTop:0}}>
          <FixedCostsRowInput amount={amount} setAmount={setAmount} title={title} setTitle={setTitle} setShowAdd={setShowAdd} fn={() => {
            addRow()
            const actualCost = numberInputValidation.convertToNumber(fixedCostAmount)
            const actualAmount = numberInputValidation.convertToNumber(amount)
            const sum = (actualCost - actualAmount)
            const res = numberInputValidation.converToString(sum)

            setFixedCostAmount(res)
            setAmount("")
            setCate("")
            setTitle("")
          }} />
        </View>
      )}
      {!showAdd && (
        <View style={{paddingBottom:0}} >
          <AddRoundBtn setShowAdd={setShowAdd} />
        </View>
      )}
      {!showAdd && (
        <View style={{justifyContent:"center", alignItems:"center", flexDirection:"row", gap:10}}>
          <CondBtn type={"confirm"} label={"Confirm"} onPress={() => {
            db.activateCosts()
            setPointer(prev => prev + 1)
            setPointerSeen((prev) => {
              const copy = prev
              copy[4] = 1
              return copy
            })
          }}/>
          <CondBtn type={'cancel'} label={'Skip'} onPress={() => {
            db.deactiveCosts()
            db.deleteAllCosts()
            setFixedCostAmount("0,00")
            setPointer(prev => prev + 1)
            setPointerSeen((prev) => {
              const copy = prev
              copy[4] = 1
              return copy
            })
          }}/>
      </View>
      )}
      </KeyboardAvoidingView>
    </View>
  )
}

export default FixedCostsForm

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  scrollDiv:{
    gap:15,
    borderRadius:20,
  },
  scrollContainer:{
    borderRadius:10,
    overflow:"hidden",
    maxWidth:320,
    marginBottom:10,
    height:300
  },
  infoDiv:{
    backgroundColor:Colors.primaryBgColor.prime,
    paddingTop:8,
    paddingBottom:15,
    paddingHorizontal:20,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center",
    width:300
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    width:"100%",
    marginBottom:30,
    backgroundColor:Colors.primaryBgColor.prime,
    paddingHorizontal:20,
    height:75,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  keyboardDiv:{
    flex:1,
    justifyContent:"space-evenly",
    alignItems:"center",
  },
})