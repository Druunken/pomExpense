import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'

import ChartView from './ChartView.js'
import CompareGraph from './CompareGraph.js'

const { width } = Dimensions.get("window")

const CompareComp = ({ outputData, setGivenWidth, isVisible }) => {
  const [dimensions, setDimensions] = useState({ height: 250 })  // default height

  // Convert outputData object to array for ChartView
  const chartDataArray = outputData ? Object.values(outputData) : []


  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <View style={[styles.layout, { height: dimensions.height }]}>
        {/* <ChartView
          width={width}
          height={dimensions.height}
          data={chartDataArray}
          onSlicePress={(slice) => console.log('Slice pressed:', slice)}
        /> */}
        <CompareGraph data={outputData} isVisible={isVisible}/>
      </View>
    </View>
  )
}

export default CompareComp

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    height: 500,
  },
  layout: {
    width: width - 50,
  },
})