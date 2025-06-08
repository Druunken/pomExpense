import { Colors } from '@/constants/Colors'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const TransactionDataComponent = ({ typeDate }) => {


    /* 
    
    We need Week, Month and Year

    they all have the same properties like:

        Expense,
        Income,
        Total,
        Numbers of Transactions,
        Total Savings

    We will use if condition to terminate the task

    */

    useEffect(() => {
        if(typeDate === "week"){
            console.log("week")
        }else if(typeDate === "month"){
            console.log("month")
        }else if(typeDate === "year"){
            console.log("year")
        }

    },[typeDate])

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{typeDate === "week" ? "Week component" : typeDate === "month" ? "Month component" : "Year component"}</Text>
    </View>
  )
}

export default TransactionDataComponent

const styles = StyleSheet.create({
  container:{
    width:"100%",
    marginTop:5,
    alignItems:"center",
    flex:1,
    padding:20,
    
  },
  label:{
    color: Colors.primaryBgColor.prime,
    fontSize:25,
    fontFamily:"MainFont"
  }
})