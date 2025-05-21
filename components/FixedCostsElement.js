import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect,useState } from 'react'
import { Colors } from '@/constants/Colors'
import db from '@/services/serverSide'

const FixedCostsElement = () => {

  const [data,setData] = useState({})

  const Element = ({title,moneyValue,}) => {
    return(
      <View style={styles.elementDiv}>
        <View style={styles.elementLayout}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.label}>Description</Text>
        </View>
        <View style={[styles.elementLayout,{flexDirection:"row",alignItems:"center"}]}>
          <Text style={[styles.lightLabel,{width:50}]}>01</Text>
          <Text style={[styles.lightLabel,{width:50}]}>{moneyValue}$</Text> 
        </View>
      </View>
    )
  }

  const getData = async() => {
    try {
      const data = await db.getAllCosts()
      setData(data)
    } catch (error) {
      console.error(error,"error while getting fixed costs data")
    }
  }

  useEffect(() => {
    getData()
  },[])

  useEffect(() => {

  },[data])

  return (
    <View style={styles.container}>
      <View style={[styles.elementDiv,{borderBottomWidth:3}]}>
        <View style={[styles.elementLayout, {justifyContent:"flex-end"}]}>
          <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black}]}>Task</Text>
        </View>
        <View style={[styles.elementLayout,{flexDirection:"row",alignItems:"flex-end", }]}>
          <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black, width:50}]}>Day</Text>
          <Text style={[styles.lightLabel,{color:Colors.primaryBgColor.black}]}>TOTAL</Text>
        </View>
      </View>
      <FlatList scrollEventThrottle={16} contentContainerStyle={styles.costsContainer} data={data} renderItem={({item}) => <Element title={item.value} moneyValue={item.moneyValue} />}/>
    </View>
  )
}

export default FixedCostsElement

const styles = StyleSheet.create({
    container:{
      gap:15,
      minHeight:350,
      borderRadius:20,
      maxHeight:480,
    },
    costsContainer:{

    },
    elementDiv:{
      flexDirection:"row",
      justifyContent:"space-between",
      width:"100%",
      height:80,
      borderBottomWidth:0.2,
      alignItems:"center"
    },
    elementLayout:{
      gap:10,
      justifyContent:"center",
      height:50
    },
    label:{
      fontFamily:"MainLight",
      fontSize:13,
      color:Colors.primaryBgColor.gray,
    },
    lightLabel:{
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.gray,
        fontSize:20,
    },
    title:{
      fontFamily:"MainFont",
      color:Colors.primaryBgColor.black,
      fontSize:20,
    },
    
})