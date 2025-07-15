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
import { create } from 'react-test-renderer'

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
    console.log(cate)
    const created = await db.createCostsColumn(title,num,cate)
    /* const getData = await db.getMonthProps() */
    if(created) getAllItems()
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
        <>
          <View style={styles.infoDiv}>
            <Icon name={"info"} size={20} />
            <Text style={{fontSize:25,color:"white",fontFamily:"MainFont",textAlign:"center"}}>Add all Your monthly Fixed Costs here</Text>
          </View>
          <View style={{justifyContent:"center",alignItems:"center",paddingHorizontal:20}}>
            <Text style={styles.label}>Check all your bills</Text>
            <Text style={styles.label}>I cooked myself seeing my own monthly Costs</Text>
            <Text style={[styles.label,{fontSize:19,fontFamily:"BoldFont",color:Colors.primaryBgColor.newPrime}]}>Don't Stress yourself.</Text>
            <Text style={styles.label}>...</Text>
          </View>  
          <View style={{flex:1}}/>
        </>
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
          <FixedCostsRowInput cate={cate} setCate={setCate} amount={amount} setAmount={setAmount} title={title} setTitle={setTitle} setShowAdd={setShowAdd} fn={() => {
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
        <View style={{height:80,width:"100%",justifyContent:"center",alignItems:"center"}} >
          <AddRoundBtn setShowAdd={setShowAdd} />
        </View>
      )}
      {!showAdd && (
        <View style={{justifyContent:"center", alignItems:"center", flexDirection:"row", gap:10}}>
          <CondBtn type={"confirm"} cond={data.length < 1} label={"Confirm"} onPress={() => {
            db.activateCosts()
            setPointer(prev => prev + 1)
            setPointerSeen((prev) => {
              const copy = prev
              copy[4] = 1
              return copy
            })
          }}/>
          <CondBtn type={''} label={'Skip'} onPress={() => {
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
    marginBottom:0,
    height:300,
    width:"100%",
    justifyContent:"center",
    alignItems:"center",borderColor:"white",
    flex:1
  },
  infoDiv:{
    backgroundColor:Colors.primaryBgColor.prime,
    paddingTop:8,
    paddingBottom:15,
    paddingHorizontal:20,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center",
    width:300,
  },
  keyboardDiv:{
    flex:1,
    alignItems:"center",
    paddingTop:15,
    marginBottom:40,
    gap:20
  },
  label:{
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.babyBlue,
    fontSize:15,
    textAlign:"center"
  },
})