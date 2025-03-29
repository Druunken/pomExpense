import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import GenreElement from './GenreElement.js'
import CondBtn from './CondBtn.tsx'
import { Colors } from '@/constants/Colors.ts'

const GenreComponent = ({ visible, setVisible, setCate, setSubType }) => {
  const inset = useSafeAreaInsets()
  return (
    <View style={[styles.container, {paddingTop:inset.top,paddingHorizontal:15, zIndex:visible ? 100 : -10,opacity: visible ? 1 : 0}]}>
      <View style={styles.layout}> 
        <View style={styles.header}>
          <Text style={styles.label}>Select one</Text>
        </View>
        <View style={styles.content}>
          <GenreElement setVisible={setVisible} setCate={setCate} setSubType={setSubType}/>
        </View>
        <View style={[styles.footer,{paddingBottom:inset.bottom}]}>
          <CondBtn label={"Go Back"} style={{width:"100%"}} onPress={() => setVisible(false)} genreTypes={true}/>
        </View>
      </View>
    </View>
  )
}

export default GenreComponent

const styles = StyleSheet.create({
  container:{
    position:"absolute",
    top:0,
    width:"100%",
    height:"100%",
    zIndex:100,
    backgroundColor:Colors.primaryBgColor.lightPrime,
    borderRadius:10,
  },
  label:{
    fontSize:30,
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.white
  },
  layout:{
    width:"100%",
    height:"100%",
    gap:20
  },
  header:{
    justifyContent:"center",
    alignItems:"center",
  },
  content:{
    width:"100%",
    flex:1,
  },
  footer:{
    width:"100%",
  }
})