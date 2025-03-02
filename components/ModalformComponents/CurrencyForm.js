import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Colors } from '@/constants/Colors'
import { usersBalanceContext } from "@/hooks/balanceContext";
import db from '@/services/serverSide'

const CurrencyForm = ({ setPointer, setPointerSeen, pointerSeen,  prevCurrency, setPrevCurrency }) => {

  const { currency,setCurrency } = useContext(usersBalanceContext)

  const validation = () => {

    if(pointerSeen[7] === 1){
      setPointer(7)
      setPrevCurrency(currency)
    }else {
      setPointer(2)
      setPointerSeen((prev) => {
      const copy = prev
      copy[1] = 1
      return copy
    })
    }
  }
  

  const isInputGiven = (style,checkCur) => {
    const isInputGiven = {backgroundColor:currency === checkCur ? Colors.primaryBgColor.prime : Colors.primaryBgColor.white}
    const isDisabled = currency === checkCur
    if(style) return isInputGiven
    else return isDisabled ? true : false
  }

  return (
    <View style={styles.container}>

      <View>
        <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:20}}>Choose your Currency</Text>
      </View>

      <View style={{
        flexDirection:"row",
        gap:20,
        flexWrap:"wrap",
        alignItems:"center",
        width:250,
        justifyContent:"center",
      }}>
      <TouchableOpacity
        style={[styles.input,isInputGiven(true,"€")]}
        disabled={isInputGiven(false,"€")}
        onPress={() => {
          setPrevCurrency("€")
          setCurrency("€")
          validation()
          setPointerSeen((prev) => {
            const copy = prev
            copy[1] = 1
            return copy
        })
          db.updateCurrency("€",true)
        }}
      >
        <Text style={[styles.btnText,isInputGiven(true,"€")]}>€</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.input,isInputGiven(true,"$")]}
        disabled={isInputGiven(false,"$")}
        onPress={() => {
          setPrevCurrency("$")
          setCurrency("$")
          validation()
          setPointerSeen((prev) => {
            const copy = prev
            copy[1] = 1
            return copy
        })
          db.updateCurrency("$",true)
        }}
      >
        <Text style={[styles.btnText,isInputGiven(true,"$")]}>$</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.input,styles.btnText,isInputGiven(true,"¥")]}
        disabled={isInputGiven(false,"¥")}
        onPress={() => {
          setPrevCurrency("¥")
          setCurrency("¥")
          validation()
          setPointerSeen((prev) => {
            const copy = prev
            copy[1] = 1
            return copy
          })
          db.updateCurrency("¥",true)
        }}
      >
        <Text style={[styles.btnText,styles.btnText,isInputGiven(true,"¥")]}>¥</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.input,isInputGiven(true,"₩")]}
        disabled={isInputGiven(false,"₩")}
        onPress={() => {
          setPrevCurrency("₩")
          validation()
          setPointerSeen((prev) => {
            const copy = prev
            copy[1] = 1
            return copy
        })
          db.updateCurrency("₩",true)
        }}
      >
        <Text style={[styles.btnText,isInputGiven(true,"₩")]}>₩</Text>
      </TouchableOpacity>

      </View>
    </View>
  )
}

export default CurrencyForm

const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems:"center",
    width:"100%",
    flex:1,
    gap:20,
  },
  btnText:{
    fontSize:20,
    backgroundColor:"white",
    color:"black",
    fontFamily:"MainFont"
  },
  input:{
    borderWidth:1,
    width:100,
    height:50,
    justifyContent:"center",
    alignItems:"center",
    textAlign:"center",
    fontFamily:"MainFont",
    borderRadius:10,
    fontSize:20,
    backgroundColor:"white",
    color:"black"
  },
})