import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { incomeActiveContext } from '@/hooks/balanceContext'
import { Colors } from '@/constants/Colors'


import db from '../services/serverSide.js'


const CalendarPick = ({day,setDay}) => {

    const [daysObject,setDaysObject] = useState<Record<string,string>>({})
    const [pressed,setPressed] = useState(false)
    const scrollViewRef = useRef(null)

    const generateDaysObject = () => {
        let res:Record<string,string> = {}
        for(let i = 1; i <= 30; i++){
          if(i < 10){
            res[i] = `0${i}`
          } else if(i >= 10){
            res[i] = `${i}`
          }
           
        }
        return setDaysObject(res);
      } 
    
      const displayDays = () => {
        let elements = []
    
        for(let key in daysObject){
          elements.push(
            <TouchableOpacity style={[styles.btn,{
              backgroundColor: daysObject[key] === day ? Colors.primaryBgColor.prime : "transparent"
            }]} key={key}  onPress={() => {
              setDay(daysObject[key])
              setPressed(true)
            }}>
              <Text style={{fontSize:25,fontFamily:"MainFont", color:"white"}}>{key}</Text>
            </TouchableOpacity>
          )
        }
        return elements
      }

      useEffect(() => {
        generateDaysObject()
      },[])

      useEffect(() => {
        if(Object.keys(daysObject).length > 0){
          const dayIndex = Object.values(daysObject).indexOf(day)
          if(dayIndex !== -1 && scrollViewRef.current){
            setTimeout(() => {
              scrollViewRef.current.scrollTo({
                x: dayIndex * 53,
                animated: true,
              })
            },50)
            
          }
        }
      },[daysObject,day])

  return (
    <View style={styles.mainContainer}> 
      <Text style={styles.label}>Select Automation day</Text>
      <View style={styles.scrollDiv}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container} horizontal showsHorizontalScrollIndicator  >
          {displayDays()}
        </ScrollView>
      </View>
    </View>
  )
}

export default CalendarPick

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    gap:13,
    height:50,
    alignItems:"center",
    borderRadius:10,
    paddingHorizontal:10,
  },
  scrollDiv:{
    borderWidth:0,
    borderColor:"white",
    borderRadius:10,
    backgroundColor: Colors.primaryBgColor.lightPrime,
    width:300
  },
  mainContainer:{
    width:300,
    justifyContent:"center",
  },
  label:{
    fontSize:17,
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.prime,
    textAlign:"center"
  },
  btn:{
    borderRadius:10,
    width:40,
    height:40,
    justifyContent:"center",
    alignItems:"center",
  }
})