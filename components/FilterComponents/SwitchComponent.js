import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Colors } from '@/constants/Colors'

const SwitchComponent = ({ label, width, color, steps, titles, state, setState }) => {
  const [pressed,setPressed] = useState(false)
  const [pressedCounts,setPressedCounts] = useState(0)
  const [align,setAlign] = useState("flex-start")
  const [title,setTitle] = useState("")


  const fn = () => {
    console.log("function here")
  }

  const handlePress = () => {
    const validLabel = label === "BalanceType"
    
    if(steps === 2 && pressedCounts === 0){
      setTitle(titles[1])
      setAlign("center")
      if(validLabel){
        setState("minus")
      }else setState(true)
    }else if(steps === 2 && pressedCounts === 1){
      setTitle(titles[2])
      setAlign("flex-end")
      if(validLabel) setState("plus")
      else setState(false)
    }else if(steps === 2 && pressedCounts === 2){
      setTitle(titles[0])
      setAlign("flex-start")
      if(validLabel) setState("")
      else setState(null)
    }
    return setPressedCounts((prev) => {
      if(prev !== 2){
        return prev + 1
      }else return 0

    })
  }

  useEffect(() => {
    setTitle("All")
  },[])
  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      <View style={[styles.layout, {alignItems:align}]}>
        <TouchableOpacity style={[styles.indicator, {width:width, backgroundColor:color}]} onPress={() => {
          setPressed((prev) => !prev)
          handlePress()
        }}/>
      </View>
    </View>
  )
}

export default SwitchComponent

const styles = StyleSheet.create({
    container:{
        
    },
    indicator:{
        width:25,
        height:25,
        borderRadius:13,
        backgroundColor:Colors.primaryBgColor.prime,
      },
      layout:{
        borderRadius:20,
        borderWidth:0.5,
        borderColor:"white",
        width:"100%",
        padding:5,
        alignItems:"flex-start",
      },
      label:{
        fontSize:15,
        color:Colors.primaryBgColor.babyBlue,
        fontFamily:"MainFont",
        textAlign:"center"
      }
})