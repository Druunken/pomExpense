import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import GenreElement from './GenreElement.js'
import CondBtn from './CondBtn.tsx'
import { Colors } from '@/constants/Colors.ts'

const GenreComponent = ({ visible, setVisible, setCate, setSubType, vertical = false }) => {
  const inset = useSafeAreaInsets()


  
  return (
    <View style={[styles.container, {paddingTop:inset.top,paddingHorizontal:15, zIndex:visible ? 100 : -10,opacity: visible ? 1 : 0,backgroundColor: vertical ? Colors.primaryBgColor.white : Colors.primaryBgColor.black}]}>
      <View style={styles.layout}> 
        <View style={styles.header}>
          <Text style={styles.label}>Select Type</Text>
        </View>
        <View style={styles.content}>
          <GenreElement setVisible={setVisible} setCate={setCate} setSubType={setSubType} vertical={vertical} importType='fixed cost' />
        </View>
        <View style={[styles.footer,{paddingBottom:inset.bottom,justifyContent:"center",alignItems:"center"}]}>
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
    backgroundColor:Colors.primaryBgColor.black,
    borderRadius:10,
  },
  label:{
    fontSize:30,
    fontFamily:"MainFont",
    color:Colors.primaryBgColor.gray
  },
  layout:{
    width:"100%",
    height:"100%",
    gap:20,
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
  },

})