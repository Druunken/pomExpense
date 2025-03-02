import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import db from '@/services/serverSide'
import { Colors } from '@/constants/Colors'

const UsernameForm = ({ setPointer, pointerSeen, setPointerSeen, setPrevUsername, prevUsername}) => {
  const [username,setUsername] = useState("")
  const isSeen = pointerSeen[7] !== 1
  return (
    <View style={styles.container}>
      <View>
        <Text style={{color:Colors.primaryBgColor.prime,fontFamily:"BoldFont",fontSize:25}}>Enter your name</Text>
      </View>
      <TextInput clearTextOnFocus placeholderTextColor={"black"} style={[styles.input, { width:300}]} placeholder="..."
          value={username}
          onChangeText={(val) => {
            if(val.length > 12) return
            setUsername(val) 
            }}
          autoFocus={isSeen}
          onBlur={() => {
            setPrevUsername(username)
            setPointer(prev => prev + 1)
            setPointerSeen((prev) => {
            const copy = prev
            copy[6] = 1
            return copy
          })
            db.updateUsername(username,true)
          }}
        />
    </View>
  )
}

export default UsernameForm

const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems:"center",
    gap:15,
    height:500
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