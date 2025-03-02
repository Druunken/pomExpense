import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CatePick = ({ setCate, setId, setPressed }) => {
    
  return (
    <ScrollView horizontal contentContainerStyle={styles.cateDiv}>
        <TouchableOpacity onPress={(el) => {
            setCate("Food")
            setId(1)
            setPressed(true)
        }} id={1} value style={[styles.cateLay, {backgroundColor: pressed && id === 1 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
            <Text style={styles.cateLabel}>Food</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={(el) => {
            setCate("Drink")
            setId(2)
            setPressed(true)
        }} id={2} style={[styles.cateLay, {backgroundColor: pressed && id === 2 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
            <Text style={styles.cateLabel}>Drink</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={(el) => {
            setCate("Education")
            setId(3)
            setPressed(true)
        }} id={3} style={[styles.cateLay, {backgroundColor: pressed && id === 3 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
            <Text style={styles.cateLabel}>Education</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={(el) => {
            setCate("Shopping")
            setId(4)
            setPressed(true)
        }} id={4} style={[styles.cateLay, {backgroundColor: pressed && id === 4 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.babyBlue}]}>
            <Text style={styles.cateLabel}>Shopping</Text>
        </TouchableOpacity>
    </ScrollView>
  )
}

export default CatePick

const styles = StyleSheet.create({})