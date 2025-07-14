import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Colors } from '@/constants/Colors'

import numberInputValidation from '../services/numberInputValidation.js';
import { useAnimatedStyle } from 'react-native-reanimated';
import CompareGraphSegment from './CompareGraphSegment.js';

const CompareGraph = ({ data, isVisible }) => {

    const [renderElements,setRenderElements] = useState([])


    const clrArr = [Colors.primaryBgColor.brown,Colors.primaryBgColor.darkPurple,Colors.primaryBgColor.dark,Colors.primaryBgColor.primeLight,Colors.primaryBgColor.persianRed]

    const renderData = () => {
        let elements = []
        let index = 0
        let totalAmount = 0

         for(const [key,value] of Object.entries(data)){
            totalAmount += Math.abs(value.amount)
        }
        
        for(const [key,value] of Object.entries(data)){
            const progress = Math.abs(value.amount) / totalAmount
            elements.push(
                <CompareGraphSegment clr={clrArr[index]} index={index} mainLabel={key} values={value} isVisible={isVisible} percentage={progress}/>
            )
            index++
        }
        setRenderElements(elements)
        return;
    }


    useEffect(() => {
        if(isVisible)
        {
            renderData()
            console.log(isVisible)
        }
        
    },[isVisible])
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
            <View style={styles.elemContainer}>
                {renderElements}
            </View>
      </ScrollView>
    </View>
  )
}

export default CompareGraph

const styles = StyleSheet.create({
    container:{
        height:500,
    },
    elemContainer:{
        flexDirection:"row",
        gap:10,
        alignItems:"flex-end",
        height:300
    },

})