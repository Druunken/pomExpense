import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

// on fully submitting the input the text will stay in place and will make some margin between val and currency

let punctMode = false
let userPunct = false
let indexPunct = 0
let overFour = false
// 

const NumberInput = ({
    state,
    setState,
    secState,
    style,
    onPress,
    autoFocus,
    setIsOnFocus,
    currency
}) => {
    const [invalid,setInvalid] = useState(false)
    const [validInput,setValidInput] = useState(false)
    /* const [input,setState] = useState("") */


    /* 
      This Input only works till full 6 digits
    */

    const inputRef = useRef(null)

    const inputFocus = () => {
      setValidInput(false)
      if(inputRef.current){
        if(setIsOnFocus !== undefined){
          setIsOnFocus(true)
        }
        inputRef.current.focus()
      }
    }

    const balanceInputValidation = (txt) => {
      const len = txt.length
      const validInput = /^[\d,\.]*$/.test(txt)
      const dottOrComm = txt[len - 1] === "." || txt[len - 1] === ","
      // find out if a comma was given or a dot
      // think about to save with a regex that specific char
      const punctInd = txt.indexOf(",")
      const commInd = txt.indexOf(".")

      const removePunct = (cutPoint,dott) => {
        if(dott === undefined) dott = ","

        let arr = txt.split(dott).join("").split("")
        let split = arr.slice(0,cutPoint).join("")
        const res = split + arr.slice(cutPoint).join("")
        return setState(res)
      }

      const overThreeDigits = (cutPoint,dott) => {
          if(dott === undefined) dott = "."

          let arr = txt.split(dott).join("").split("")
          let split = arr.slice(0,cutPoint).join("")
          let ponc = "."
          const res = split + ponc + arr.slice(cutPoint).join("")
          return setState(res)
      } 
      /* 
      if the input len is equal 4 wihtout a comma or dot set the flag to true


      lets split this in two

      there is 2 modes input 

      1.without punct
      2.with punct

      if punct Mode is active : make it 1,00 10,00 100,00 1,000 10,000 100,000
      if punct Mode is not active : 1 10 100 1.000 10.000 100.000 -> 100.000 10.000 1.000 100,00 10,00 1,00
      group the conditions by the len
      
      */

      if (validInput){

        const sliced = txt.split("").slice(punctInd).length

        if(len < 1) overFour = false

        if(txt.includes(",,") || (txt[0] === ",")) return
        if(txt.includes(".,")) return
        if(txt.includes(",.")) return
        if(txt.includes("..")) return
        if(len === 2 && txt === "00") return
        if(len === 2 && txt.startsWith("0") && txt[1] !== ",") return

        if(userPunct && sliced > 3){
          return
        }

        if(dottOrComm){
          indexPunct = len - 1
          userPunct = true
        }

        if(userPunct && txt[indexPunct] !== "," && txt[indexPunct] !== "."){
          userPunct = false
        }

        if(len === 3){
          overFour = false
          if(punctMode){
            return removePunct(1,txt[punctInd !== -1 ? punctInd : commInd])
          }
        }

        if(len === 4){

          if(punctMode){
            return setState(txt)
          }
          if(!punctMode && !userPunct){
            if(overFour){
              overFour = false
              return removePunct(1,txt[punctInd !== -1 ? punctInd : commInd])
            }
            
            if(txt[len - 1] === "." || txt[len - 1] === ","){
              return setState(txt)
            }

            overFour = true
            return overThreeDigits(1,txt[punctInd !== -1 ? punctInd : commInd])
          }
        }

        if(len === 5){
          if(punctMode){
            return setState(txt)
          }
          if(txt[0] === "0" || txt[len - 1] === ",") return console.log("no comma after fixed 2")
          
          
          if(!punctMode && !userPunct){
            if(txt[len - 1] === "." || txt[len - 1] === ",") return setState(txt)
              punctMode = false
              return overThreeDigits(1,txt[punctInd !== -1 ? punctInd : commInd])
          }
        }

        if(len === 6){
          if(punctMode){
            return setState(txt)
          }
          if((!punctMode && !userPunct)){

            if(txt[len - 1] === "." || txt[len - 1] === ",") return setState(txt)

            return overThreeDigits(2,txt[punctInd !== -1 ? punctInd : commInd])
          }
        }

        else if(len === 7){

          if(punctMode){
            return setState(txt)
          }

          if(!punctMode && !userPunct){
            if(txt[len - 1] === "." || txt[len - 1] === ",") return setState(txt)
              return overThreeDigits(3,txt[punctInd !== -1 ? punctInd : commInd])
          }
        } 

        // we need bigger numbers than 5 full digits limit the entry till billion
        else if(len === 8){
          if(!userPunct) return
          
          if(punctMode){
            return setState(txt)
          }

          /* if(!punctMode && !userPunct){
            if(txt[len - 1] === "." || txt[len - 1] === ",") return setState(txt)

            console.log("if 5")
            return overThreeDigits(3,txt[punctInd !== -1 ? punctInd : commInd])
          } */
        }

        return setState(txt)

      } else return
    }

    const txtValidation = () => {
      if(state.length === 0){
        return ""
      }
      return state
    }

    const placeHolderValidation = () => {
      const len = state.length
      const lastInd = len - 1

      const commaValidation = state[lastInd] === "," || state[lastInd] === "."
      const noComm = ",00"
      const withComm = "00"
      /* 
      validation for SINGLE DIGIT     
      */
      if(len === 0) return "0,00"

      else if(len === 1) return ",00"
      // 1 digits
      else if(len === 2 && commaValidation) return withComm
      // 2 digits
      else if(len === 2 && !commaValidation) return noComm
      else if(len === 3 && state[1] === ",") return "0"
      else if(len === 3 && state[1] !== "," && state.includes(",")) return "00"
      else if(len === 3 && !commaValidation) return noComm
      else if(len === 4 && state[2] === ",") return "0"
      // 3 digits
      else if(len === 4 && state[3] === ",") return withComm
      else if(len === 5 && state[3] === ",") return "0"
      else if(len === 5 && state[1] === ".") return noComm
      else if(len === 6 && state[len - 1] === ",") return withComm
      else if(len === 7 && state[len - 2] === ",") return "0"
      else if(len === 6 && state[2] == ".") return noComm
      else if(len === 7 && state[len - 1] === ",") return withComm
      else if(len === 8 && state[len - 2] === ",") return "0"
      else if(len === 7 && state[3] === ".") return noComm
      else if(len === 8 && state[len - 1] === ",") return withComm
      else if(len === 9 && state[len - 2] === ",") return "0"

    }



    /* animated */

    const backgroundVal = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          backgroundVal.value,
          [0,1],
          [Colors.primaryBgColor.white,Colors.primaryBgColor.prime]
        )
      }
    })

    const onPressedDone = () => {
      if(state.length > 0) {
        setValidInput(true)
        backgroundVal.value = withTiming(1, { duration: 250 })
      }else{
        setValidInput(false)
        backgroundVal.value = withTiming(0, { duration: 250 })
      }
    }


    useEffect(() => {
    }, [inputRef])

    useEffect(() => {
      setState("")
      onPressedDone()
    },[])
  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle,{borderRadius:10}]}>
        <TouchableOpacity onPress={() => {
          backgroundVal.value = withTiming(0, { duration: 250 })
          inputFocus()
          setState("")
        }} activeOpacity={0.9} style={[styles.txtLayout, style, {
        }]}>
          <Text placeholderTextColor={"black"} placeholder={"0,00"} style={[styles.txtFillStyle, {
            color: validInput ? Colors.primaryBgColor.white : Colors.primaryBgColor.black
          }]}>{txtValidation()}</Text>
          <Text placeholderTextColor={"black"} placeholder={"0,00"} style={[styles.txtStyle, {
            color: validInput ? Colors.primaryBgColor.white : Colors.primaryBgColor.black
          }]}>{placeHolderValidation()}</Text>
          <Text style={{fontFamily:"MainFont",fontSize:17}}>{currency}</Text>
        </TouchableOpacity>
      </Animated.View>

      <TextInput ref={inputRef}  returnKeyType="done" onBlur={() => {
        onPressedDone()
        if(setIsOnFocus){
          setIsOnFocus(false)
        }
      }} onSubmitEditing={() => {
        if(setIsOnFocus){
          setIsOnFocus(false)
        }
      }}  placeholderTextColor={"black"} style={[{
          width:220,
          borderColor: !invalid ? Colors.primaryBgColor.white : Colors.primaryBgColor.persianRed,
          borderWidth:3,
          marginBottom:15,
          opacity:0,
          zIndex:-100,
          position:"absolute",
        }]} 
        keyboardType="decimal-pad"  placeholder="0,00"
        value={state}
        clearTextOnFocus={true}
        onChangeText={(val) => {
          balanceInputValidation(val)
            }}
        autoFocus={autoFocus}
        />
        {invalid && (
            <Text style={{fontSize:14,fontFamily:"MainFont",color:Colors.primaryBgColor.persianRed}}>{secState && state > 0 ? "MAX" : "MIN"} Value is: {secState && state > 0 ? secState - 1 : 1}</Text>
        )}
        {validInput && (
          <View style={styles.markDiv}>
            <Text style={styles.label}>check</Text>
          </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    
  },
  txtStyle:{
    fontFamily:"MainFont",
    fontSize:25,
    color:Colors.primaryBgColor.black,
    opacity:0.5
  },
  txtLayout:{
    width:300,
    height:50,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"row",
    textAlign:"center"
  },
  txtFillStyle:{
    fontFamily:"MainFont",
    fontSize:25,
    color:Colors.primaryBgColor.prime,
  },
  markDiv:{
    position:"absolute",
    right:0,
    height:"100%",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10,
    width:50,

  },
  label:{
    color:"white",
    fontSize:12,
    fontFamily:"MainFont"
  }
})

export default NumberInput