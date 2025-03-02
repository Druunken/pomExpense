import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { Colors } from '@/constants/Colors'
import numberInputValidation from '@/services/numberInputValidation'
import { usersBalanceContext } from '@/hooks/balanceContext'
import { ScrollView } from 'react-native-gesture-handler'


const MAX_HEIGHT = 150

let FOOD_HEIGHT = 90
// Graph should show totalAmount of expense  calculate their percentage

const MonthGraph = ({ data, monthData, totalAmount, label, validTitle, months, expenseMode, incomeMode }) => {
    const { currency } = useContext(usersBalanceContext)

    const [foodAmount,setFoodAmount] = useState(0)
    const [drinkAmount,setDrinkAmount] = useState(0)
    const [educationAmount,setEducationAmount] = useState(0)
    const [shoppingAmount,setShoppingAmount] = useState(0)
    const [pressed,setPressed] = useState(false)
    const [noData,setNoData] = useState(false)
    const [viewId,setViewId] = useState(0)



    const validateColor = (label) => {
        switch(label){
            case "Shopping" || "Income":
                return Colors.primaryBgColor.prime
            case "Drink":
                return Colors.primaryBgColor.lightPrime

            default :
                return Colors.primaryBgColor.brown
        }
    }

    const operateData = () => {
        console.log(data.length)
        if(data.length < 1 || totalAmount === undefined) return setNoData(true)

        let obj = {}
        let counter = 1
        

        for(let i = 0; i < data.length; i++){
            const calc = MAX_HEIGHT / Math.abs(totalAmount)

            if(!Object.keys(obj).includes(data[i].type)){
                console.log("STEP 1")
                obj[data[i].type] = {amount: Math.abs(data[i].moneyValue * calc),id:counter,moneyAmount: Math.abs(data[i].moneyValue)}
              counter++
            }else {
                const amount = obj[data[i].type].amount
                const moneyAmount = obj[data[i].type].moneyAmount
                obj[data[i].type].amount = Math.abs(data[i].moneyValue) * calc + amount
                obj[data[i].type].moneyAmount = Math.abs(data[i].moneyValue) + moneyAmount
            }
        }
        counter = 0
        return dpElements(obj)
    }

    const dpElements = (obj) => {
        let elements = []

        for(const props in obj){
            const validation = viewId === obj[props].id || !pressed
            const onlyPressed = validation && pressed
            elements.push(
                /* validation ? ( */
                <View key={obj[props].id} style={[styles.cateContainer,{
                }]}>
                    <View  style={[styles.cateLay,{
                        alignItems: "center",
                        marginLeft:10,
                    }]} data-id={obj[props].id}>
                        <Text style={styles.cateLabel}>{props}</Text>
                        <TouchableOpacity style={styles.graphDiv} onPress={(el) => {
                            setPressed((prev) => !prev)
                            setViewId(obj[props].id)
                        }}>
                            <Text style={styles.absolLabel} >{currency}{numberInputValidation.converToString(obj[props].moneyAmount)}</Text>
                            <View style={[styles.graphElement,{ backgroundColor: validateColor(props),height:obj[props].amount,minHeight:4}]}/>
                        </TouchableOpacity>
                    </View>  
                    {onlyPressed && (
                        <View style={styles.amountDiv}>
                            <Text style={styles.absolCurren}>{currency}</Text>
                            <Text style={[styles.absolLabel]}>{numberInputValidation.converToString(obj[props].moneyAmount)}</Text>
                        </View>
                    )}                                 
                </View>
                /* ) : null */
            )
        }
        return elements
    }
    const dpMonths = (obj) => {
        let elements = []
        for(const props in obj){
            if(obj[props].totalExpense === undefined) break
            console.log(obj[props].totalExpense)
            const validation = viewId === obj[props].id || !pressed
            const onlyPressed = validation && pressed
            const exVal = numberInputValidation.converToString(obj[props].totalExpense.toFixed(2))
            const inVal = numberInputValidation.converToString(obj[props].totalIncome) 
            const calcEx = MAX_HEIGHT / Math.abs(totalAmount)
            const calcIn = MAX_HEIGHT / Math.abs(totalAmount)
            const exHeight = Math.abs(obj[props].totalExpense) * calcEx
            const inHeight = Math.abs(obj[props].totalIncome) * calcIn
            elements.push(
                /* validation ? ( */
                <View key={obj[props].id} style={[styles.cateContainer,{
                }]}>
                    <View  style={[styles.cateLay,{
                        alignItems: "center",
                        marginLeft:10,
                    }]} data-id={obj[props].id}>
                        <Text style={styles.cateLabel}>{props}</Text>
                        <TouchableOpacity style={styles.graphDiv} onPress={(el) => {
                            setPressed((prev) => !prev)
                            setViewId(obj[props].id)
                        }}>
                            <Text style={styles.absolLabel} >{currency}{expenseMode ? exVal : inVal}</Text>
                            <View style={[styles.graphElement,{ backgroundColor: validateColor(props),height:expenseMode ? exHeight : inHeight}]}/>
                        </TouchableOpacity>
                    </View>  
                    {onlyPressed && (
                        <View style={styles.amountDiv}>
                            <Text style={styles.absolCurren}>{currency}</Text>
                            <Text style={[styles.absolLabel]}>{expenseMode ? exVal : inVal}</Text>
                        </View>
                    )}                                 
                </View>
                /* ) : null */
            )
        }
        return elements
    }

    const validateExpenseFormat = () => {
        const absolExpense = Math.abs(totalAmount)
        const convertStr = numberInputValidation.converToString(absolExpense)
        return convertStr
    }


  return (
    <View style={styles.container}>
        
        {!noData && (
              <View style={styles.layout}>
                <Text style={styles.mainLabel}>{label}</Text>
                <View style={{flexDirection:"row",gap:3,justifyContent:"center"}}>
                <Text style={styles.amountLabel}>{currency}</Text>
                    <Text style={styles.amountLabel}>{validateExpenseFormat()}</Text>
                </View>
                <View style={styles.cateDiv}>
                    {/* <View style={styles.stepsDiv}>
                        <View style={styles.stepsElement}>
    
                        </View>
                        <View style={{height:MAX_HEIGHT,justifyContent:"space-between"}}>
                            <Text>-{validateExpenseFormat()}</Text>
                            <Text>-0</Text>
                        </View>
                    </View> */}
                    <ScrollView contentContainerStyle={[styles.scrollDiv]} horizontal showsHorizontalScrollIndicator={false}>
                        {!months && operateData()}
                        {months && dpMonths(monthData)}
                    </ScrollView>
                </View>
            </View>  
            )}
            {noData && (
                <View style={styles.layout}>
                    <Text style={styles.mainLabel}>{label}</Text>
                    <View style={{flexDirection:"row",gap:3,justifyContent:"center"}}>
                    <Text style={styles.amountLabel}>{}</Text>
                        <Text style={styles.amountLabel}>{validTitle}</Text>
                    </View>
                </View>
            )}
    </View>
  )
}

export default MonthGraph

const styles = StyleSheet.create({
    container:{
        width:"100%",
        marginTop:15,
        
    },
    cateContainer:{
        flexDirection:"row",
    },
    validLabel:{
        fontSize:30,
        textAlign:"center",

    },
    amountDiv:{
        position:"absolute",
        top:0,
        width:100,
        height:40,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        borderRadius:9,
        backgroundColor:Colors.primaryBgColor.prime,
        flexDirection:"row"
    },  
    absolLabel:{
        fontSize:12,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.gray,
        textAlign:"center"
    },
    absolCurren:{
        fontSize:8,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.gray,
    },
    layout:{
        backgroundColor:Colors.primaryBgColor.lightGray,
        borderRadius:20,
        paddingVertical:10,
    },
    scrollDiv:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        minWidth:400
    },
    stepsDiv:{
        alignItems:"flex-end",
        height:180,
        maxHeight:180,
        flexDirection:"row",
        justifyContent:"flex-end",
        width:80
    },
    stepsElement:{
        height:MAX_HEIGHT,
        maxHeight:MAX_HEIGHT,
        borderWidth:1
    },
    mainLabel:{
        fontSize:25,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black,
        textAlign:"center"
    },
    cateLabel:{
        fontSize:15,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black,
    },
    amountLabel:{
        fontSize:25,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.gray,
        textAlign:"center"
    },
    cateDiv:{
        flexDirection:"row",
        gap:10,
        width:"100%",
        alignItems:"center",
    },
    cateLay:{
        justifyContent:"center",
        alignItems:"center",
        minWidth:80,
        maxHeight:180
    },
    graphDiv:{
        width:70,
        height:MAX_HEIGHT,
        justifyContent:"flex-end",
        maxHeight:MAX_HEIGHT,
        borderRadius:10,
        marginTop:14,
    },
    graphElement:{
        height:30,
        backgroundColor:Colors.primaryBgColor.brown,
        borderRadius:20,
        borderBottomRightRadius:8,
        borderBottomLeftRadius:8
    }
})