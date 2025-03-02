import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import MonthGraph from '@/components/MonthComponents/MonthGraph'
import db from '@/services/serverSide'

const GraphComponent = ({ month, year }) => {

    const [exData,setExData] = useState({})
    const [incData,setIncData] = useState({})
    const [monthTr,setMontTr] = useState({})
    const [totalExAmount,setTotalExAmount] = useState(0)
    const [totalInAmount,setTotalInAmount] = useState(0)
    const [totalExpense,setTotalExpense] = useState(0)
    const [totalIncome,setTotalIncome] = useState(0)
    const [noData,setNoData] = useState(true)

    const monthObj = {
        "01": "Januar",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "Mai",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
    }

    const operateMonths = (data) => {
        let obj = {}
        let totalAmountEx = 0
        let totalAmountIn = 0
        for(let i = 0; i < data.length; i++){
            let expense = Math.abs(data[i].monthsTotalExpenses)
            let income = data[i].monthsIncomeVal

            if(monthObj[data[i].monthsIncomeDate]){
                if(!Object.keys(obj).includes(monthObj[data[i].monthsIncomeDate])){
                    totalAmountEx += expense
                    totalAmountIn += income
                    obj[monthObj[data[i].monthsIncomeDate]] = {
                        totalExpense: expense,
                        totalIncome: income,
                        amountEx: expense,
                        amountIn: expense
                    }
                }
            }
        }
        setTotalExAmount(totalAmountEx)
        setTotalInAmount(totalAmountIn)
        setMontTr(obj)
        
    }   

    // total expense of the month
    const fetchData = async() => {
        try {
            const getExData = await db.getMonthsTransactions(month, year, true, false)
            const getIncData = await db.getMonthsTransactions(month, year, false, true)
            const getAllMonths = await db.getAllMonths()
            const getMonthsProps = await db.getMonthProps(month, year)
            if(getExData.length < 1 || getMonthsProps[0].monthsTotalExpenses === undefined){
                setNoData(true)
                return
            }
            else{
                operateMonths(getAllMonths)
                setExData(getExData)
                setIncData(getIncData)
                setTotalExpense(Number(getMonthsProps[0].monthsTotalExpenses.toFixed(2)))
                setTotalIncome(getMonthsProps[0].monthsIncomeVal)
                setNoData(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    },[month,year])

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {!noData && (
        <>
            <MonthGraph data={exData} months={false} totalAmount={totalExpense} label={"Total Expense"} validTitle={"No Expenses"} />
            <MonthGraph data={incData} months={false} totalAmount={totalIncome} label={"Total Income"} validTitle={"No Income"} />
            <MonthGraph monthData={monthTr} months={true} expenseMode={true} incomeMode={false} totalAmount={totalExAmount} label={"Months Expenses"} validTitle={"No Previous Months detected"} />
            <MonthGraph monthData={monthTr} months={true} expenseMode={false} incomeMode={true} totalAmount={totalInAmount} label={"Months Income "} validTitle={"No Previous Months detected"} />
        </>
      )}
      {noData && (
        <Text style={styles.labelValid}>No Data</Text>
      )}
      
    </ScrollView>
  )
}

export default GraphComponent

const styles = StyleSheet.create({
    container:{
        borderRadius:20,
        height:1400
    },
    headerLabel:{
        fontSize:25,
        color:Colors.primaryBgColor.prime,
        fontFamily:"MainFont",
        textAlign:"center"
    },
    labelValid:{
        fontFamily:"MainFont",
        fontSize:30,
        color:Colors.primaryBgColor.white,
        textAlign:"center",

    },
})