import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import TitleInput from '@/components/TitleInput'
import NumberInput from '@/components/NumberInput'
import { Colors } from '@/constants/Colors'
import CancelRoundBtn from '@/components/CancelRoundBtn'
import RoundCheckBtn from '@/components/RoundCheckBtn'

const FixedCostsRowInput = ({ amount, setAmount, title, setTitle, setShowAdd, fn}) => {

    const [isOnFocus,setIsOnFocus] = useState(false)
    const [titleFocus,setTitleFocus] = useState(false)
  return (
    <View style={styles.container}>
        <View style={{flex:1,borderWidth:0,justifyContent:"center",gap:30}}>
            <View style={styles.div}>
                <Text style={styles.titleLabel}>Amount</Text>
                <NumberInput state={amount} setState={setAmount} secState={false} isOnFocus={isOnFocus} setIsOnFocus={setIsOnFocus} /> 
            </View>
            {!isOnFocus && (
                <View style={styles.div}>
                    <Text style={styles.titleLabel}>Title</Text>
                    <TitleInput state={title} setState={setTitle} isOnFocus={titleFocus} setIsOnFocus={setTitleFocus} />
                </View>
            )}
        </View>
        <View style={{}}/>
        {!isOnFocus && !titleFocus && (
            <View style={{flexDirection:"column",gap:10,justifyContent:"center",alignItems:"center",marginBottom:15}}>
                <RoundCheckBtn setShowAdd={setShowAdd} fn={fn} />
                <CancelRoundBtn setShowAdd={setShowAdd} />
            </View>
        )}

    </View>
  )
}

export default FixedCostsRowInput

const styles = StyleSheet.create({
    container:{
        gap:30,
        marginBottom:20
    },
    div:{
        justifyContent:"center",
        alignItems:"center",
        gap:5
    },
    titleLabel:{
        fontSize:25,
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont"
    }
})