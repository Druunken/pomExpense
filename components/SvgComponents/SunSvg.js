import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Circle, Path} from 'react-native-svg'

const SunSvg = () => {
  return (
    <Svg width={50} height={50} viewBox='0 0 100 100' >
        <Circle r={20} x={50} y={50}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 80' stroke={"black"} transform={"rotate(45, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 80' stroke={"black"} transform={"rotate(-45, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 85' stroke={"black"} transform={"rotate(90, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 85' stroke={"black"} transform={"rotate(-90, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 80' stroke={"black"} transform={"rotate(130, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 80' stroke={"black"} transform={"rotate(-130, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 80' stroke={"black"} transform={"rotate(180, 50, 50)"}/>
        <Path strokeWidth={10} strokeLinecap='round' d='M 50, 95 L 50, 80' stroke={"black"}/>
    </Svg>
  )
}

export default SunSvg

const styles = StyleSheet.create({})