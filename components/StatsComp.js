import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { months } from '../constants/Dates.js'
import { incomeActiveContext, usersBalanceContext } from "../hooks/balanceContext";
import { Colors } from '@/constants/Colors'
import { useAnimatedStyle } from 'react-native-reanimated';
import numberInputValidation from '@/services/numberInputValidation'
import SingleDonutChartComp from './SingleDonutChartComp.js'
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window")

const HEIGHT = 170

const GraphComp = ({ outputData, typeDate, setGivenWidth, prevData }) => {

  

  const {
      currency,
      value
    } = useContext(usersBalanceContext)

  const [renderItems,setRenderItems] = useState()

  const animatedContainer = useAnimatedStyle(() => {
    return {

    }
  })

    /* 



    */
    const yearRender = () => {
      if(Object.values(outputData).length > 0){
        setRenderItems(() =>{
          console.log(prevData,"ALOOO")
          const expense = Math.abs(outputData.expense);
          const income = outputData.income;

          const nonAbs = outputData.expense + income
          const total = expense + income;

          let calcPercentage = 0;
          let gapVal = 0 
          let inPlus;

          if(prevData?.balance){
          if(prevData?.balance > outputData?.balance){
            calcPercentage = ((prevData?.balance - outputData?.balance) / prevData?.balance) * 100
            gapVal = prevData?.balance - outputData?.balance
            inPlus = false
          }else{
            calcPercentage = ((outputData?.balance - prevData?.balance) / outputData?.balance) * 100
            gapVal = outputData?.balance - prevData?.balance
            inPlus = true
          } 
        }else{
          inPlus = undefined
        }
        return( 
           <View>
          <View style={[styles.graphContainer]}>
            <View style={[styles.graphDiv,{flexDirection:"row",justifyContent:"space-between",width:"100%"}]}>
              <View>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Total Expenses</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={expense} nonAbs={expense} color={Colors.primaryBgColor.persianRed} max={total} index={1}/>
              </View>
              <View style={{height:"100%",width:0.5,backgroundColor:"black"}} />
              <View>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Total Income</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={income} color={Colors.primaryBgColor.prime} max={total} index={2}/>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal:0,gap:5}}>
            <View style={[styles.graphContainer,{ }]}>
              <View style={[styles.graphDiv,{width:"100%",justifyContent:"space-between",flexDirection:"row"}]}>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                  <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Totals</Text>
                  <SingleDonutChartComp strokeWidth={10} radius={50} amount={total} nonAbs={nonAbs} color={nonAbs > 0 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray} max={numberInputValidation.convertToNumber(value)} index={3}/>
                </View>
                <View style={styles.infoDiv}>
                  <View style={{padding:10}}>
                    {/* <View style={styles.infoElement}>
                      <Text style={styles.label}>Gap: </Text>
                      <Text style={styles.label}>{numberInputValidation.converToString((Number(gapVal.toFixed(2))))}{currency}</Text>
                    </View> */}
                    <View style={styles.infoElement}>
                      <Text style={styles.label}>Total Transactions:</Text>
                      <Text style={styles.label}>{outputData.numbersOfTrans}</Text>
                    </View>
                  </View>

                  <View style={[styles.infoElement,{padding:0,flexDirection:"column",justifyContent:"center",alignItems:"flex-start",borderTopWidth:0.2,marginBottom:15,paddingHorizontal:10}]}>
                    <Text style={styles.label}>Total Balance</Text>
                    
                    <View style={styles.rDiv}>
                      <View style={{backgroundColor:inPlus ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray,padding:3,borderRadius:5}}>
                        <Text style={[styles.label,{fontSize:25,color:"white"}]}>{value}{currency}</Text>
                        { prevData !== undefined ? (
                          <Text style={[styles.label,{fontSize:12,fontFamily:"MainFont",color:Colors.primaryBgColor.black}]}>prev: {numberInputValidation.converToString((Number(prevData?.balance.toFixed(2))))}{currency}</Text>
                        ) : (
                          <Text style={[styles.label,{fontSize:12,fontFamily:"MainFont",color:Colors.primaryBgColor.black}]}>Latest Entry</Text>
                        )}
                      </View>
                      <Ionicons size={20} name={inPlus ? "arrow-up-outline" : "arrow-down-outline"}color={inPlus ? Colors.primaryBgColor.prime : Colors.primaryBgColor.persianRed} />
                      <Text style={styles.smallFont}>{calcPercentage.toFixed(0)}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* CONTAINER: Saving Goal, Fixed Cost */}
          {/* <View style={styles.graphContainer}>
            <View style={styles.graphContainer}>

              <View style={{justifyContent:"center",alignItems:"center"}}>

                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Saving Goal</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={nonAbs} nonAbs={nonAbs} goal={outputData?.income} color={Colors.primaryBgColor.darkPurple} max={outputData?.monthsSavingGoalVal} index={3}/>
              </View>

              <View style={{justifyContent:"center",alignItems:"center"}}>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Fixed Cost</Text>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >{outputData?.monthsTotalFixedCosts}</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={total}  color={Colors.primaryBgColor.dark } max={outputData?.balance} index={3}/>
              </View>
            </View>
          </View> */}
        </View>
        )
      })

      }
    }

    const monthRender = () => {
      if(Object.values(outputData).length > 0){
         setRenderItems(() =>{

      const expense = Math.abs(outputData.monthsTotalExpenses);
      const income = outputData.monthsIncomeVal;

      const nonAbs = outputData.monthsTotalExpenses + income
      const total = expense + income;

      let calcPercentage = 0;
      let gapVal = 0 
      let inPlus;


      if(prevData?.monthsTotalBalance){
        if(prevData?.monthsTotalBalance > outputData?.monthsTotalBalance){
          calcPercentage = ((prevData?.monthsTotalBalance - outputData?.monthsTotalBalance) / prevData?.monthsTotalBalance) * 100
          gapVal = prevData?.monthsTotalBalance - outputData?.monthsTotalBalance
          inPlus = false
        }else{
          calcPercentage = ((outputData?.monthsTotalBalance - prevData?.monthsTotalBalance) / outputData?.monthsTotalBalance) * 100
          gapVal = outputData?.monthsTotalBalance - prevData?.monthsTotalBalance
          inPlus = true
        } 
      }else{
        inPlus = undefined
      }

      console.log(prevData)
       return(
        <View>
          <View style={[styles.graphContainer]}>
            <View style={[styles.graphDiv,{flexDirection:"row",justifyContent:"space-between",width:"100%"}]}>
              <View>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Total Expenses</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={expense} nonAbs={expense} color={Colors.primaryBgColor.persianRed} max={total} index={1}/>
              </View>
              <View style={{height:"100%",width:0.5,backgroundColor:"black"}} />
              <View>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Total Income</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={income} color={Colors.primaryBgColor.prime} max={total} index={2}/>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal:0,gap:5}}>
            <View style={[styles.graphContainer,{ }]}>
              <View style={[styles.graphDiv,{width:"100%",justifyContent:"space-between",flexDirection:"row"}]}>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                  <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Totals</Text>
                  <SingleDonutChartComp strokeWidth={10} radius={50} amount={total} nonAbs={nonAbs} color={nonAbs > 0 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray} max={outputData?.monthsTotalBalance} index={3}/>
                </View>
                <View style={styles.infoDiv}>
                  <View style={{padding:10}}>
                    <View style={styles.infoElement}>
                      <Text style={styles.label}>Gap: </Text>
                      <Text style={styles.label}>{numberInputValidation.converToString((Number(gapVal.toFixed(2))))}{currency}</Text>
                    </View>
                    <View style={styles.infoElement}>
                      <Text style={styles.label}>Total Transactions:</Text>
                      <Text style={styles.label}>{outputData.monthsTotalTransactions}</Text>
                    </View>
                  </View>

                  <View style={[styles.infoElement,{padding:0,flexDirection:"column",justifyContent:"center",alignItems:"flex-start",borderTopWidth:0.2,marginBottom:15,paddingHorizontal:10}]}>
                    <Text style={styles.label}>Total Balance</Text>
                    
                    <View style={styles.rDiv}>
                      <View style={{backgroundColor:inPlus ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray,padding:3,borderRadius:5}}>
                        <Text style={[styles.label,{fontSize:25,color:"white"}]}>{numberInputValidation.converToString((Number(outputData?.monthsTotalBalance.toFixed(2))))}{currency}</Text>
                        { prevData.balance !== undefined ? (
                          <Text style={[styles.label,{fontSize:12,fontFamily:"MainFont",color:Colors.primaryBgColor.black}]}>prev: {numberInputValidation.converToString((Number(prevData?.monthsTotalBalance.toFixed(2))))}{currency}</Text>
                        ) : (
                          <Text style={[styles.label,{fontSize:12,fontFamily:"MainFont",color:Colors.primaryBgColor.black}]}>Last Entry</Text>
                        )}
                      </View>
                      <Ionicons size={20} name={inPlus ? "arrow-up-outline" : "arrow-down-outline"}color={inPlus ? Colors.primaryBgColor.prime : Colors.primaryBgColor.persianRed} />
                      <Text style={styles.smallFont}>{calcPercentage.toFixed(0)}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* CONTAINER: Saving Goal, Fixed Cost */}
          <View style={styles.graphContainer}>
            <View style={styles.graphContainer}>

              <View style={{justifyContent:"center",alignItems:"center"}}>

                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Saving Goal</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={nonAbs} nonAbs={nonAbs} goal={outputData?.monthsSavingGoalVal} color={Colors.primaryBgColor.darkPurple} max={outputData?.monthsSavingGoalVal} index={3}/>
              </View>

              <View style={{justifyContent:"center",alignItems:"center"}}>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Fixed Cost</Text>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >{outputData?.monthsTotalFixedCosts}</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={total}  color={Colors.primaryBgColor.dark } max={outputData?.monthsTotalBalance} index={3}/>
              </View>
            </View>
          </View>
        </View>
       )
      }) 
        }
    }

    const dayRender = () => {
      if(Object.values(outputData).length > 0){
        console.log(outputData,"BEGINS")
        setRenderItems(() =>{


          const expense = Math.abs(outputData.expense);
          const income = outputData.income;

          const nonAbs = outputData.expense + income
          const total = expense + income;

          let calcPercentage = 0;
          let gapVal = 0 
          let inPlus;


          if(prevData?.monthsTotalBalance){
            if(prevData?.monthsTotalBalance > outputData?.monthsTotalBalance){
              calcPercentage = ((prevData?.monthsTotalBalance - outputData?.monthsTotalBalance) / prevData?.monthsTotalBalance) * 100
              gapVal = prevData?.monthsTotalBalance - outputData?.monthsTotalBalance
              inPlus = false
            }else{
              calcPercentage = ((outputData?.monthsTotalBalance - prevData?.monthsTotalBalance) / outputData?.monthsTotalBalance) * 100
              gapVal = outputData?.monthsTotalBalance - prevData?.monthsTotalBalance
              inPlus = true
            } 
          }else{
            inPlus = undefined
          }

          return( 
          <View>
          <View style={[styles.graphContainer]}>
            <View style={[styles.graphDiv,{flexDirection:"row",justifyContent:"space-between",width:"100%"}]}>
              <View>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Total Expenses</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={expense} nonAbs={expense} color={Colors.primaryBgColor.persianRed} max={total} index={1}/>
              </View>
              <View style={{height:"100%",width:0.5,backgroundColor:"black"}} />
              <View>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Total Income</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={income} color={Colors.primaryBgColor.prime} max={total} index={2}/>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal:0,gap:5}}>
            <View style={[styles.graphContainer,{ }]}>
              <View style={[styles.graphDiv,{width:"100%",justifyContent:"space-between",flexDirection:"row"}]}>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                  <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Totals</Text>
                  <SingleDonutChartComp strokeWidth={10} radius={50} amount={total} nonAbs={nonAbs} color={nonAbs > 0 ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray} max={numberInputValidation.convertToNumber(value)} index={3}/>
                </View>
                <View style={styles.infoDiv}>
                  <View style={{padding:10}}>
                    {/* <View style={styles.infoElement}>
                      <Text style={styles.label}>Gap: </Text>
                      <Text style={styles.label}>{numberInputValidation.converToString((Number(gapVal.toFixed(2))))}{currency}</Text>
                    </View> */}
                    <View style={styles.infoElement}>
                      <Text style={styles.label}>Total Transactions:</Text>
                      <Text style={styles.label}>{outputData.numbersOfTrans}</Text>
                    </View>
                  </View>

                  <View style={[styles.infoElement,{padding:0,flexDirection:"column",justifyContent:"center",alignItems:"flex-start",borderTopWidth:0.2,marginBottom:15,paddingHorizontal:10}]}>
                    <Text style={styles.label}>Total Balance</Text>
                    
                    <View style={styles.rDiv}>
                      <View style={{backgroundColor:inPlus ? Colors.primaryBgColor.prime : Colors.primaryBgColor.gray,padding:3,borderRadius:5}}>
                        <Text style={[styles.label,{fontSize:25,color:"white"}]}>{value}{currency}</Text>
                        {/* <Text style={[styles.label,{fontSize:10,fontFamily:"MainFont",color:Colors.primaryBgColor.black}]}>prev: {numberInputValidation.converToString((Number(prevData?.balance.toFixed(2))))}{currency}</Text> */}
                      </View>
                      {/* <Ionicons size={20} name={inPlus ? "arrow-up-outline" : "arrow-down-outline"}color={inPlus ? Colors.primaryBgColor.prime : Colors.primaryBgColor.persianRed} />
                      <Text style={styles.smallFont}>{calcPercentage.toFixed(0)}%</Text> */}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* CONTAINER: Saving Goal, Fixed Cost */}
          {/* <View style={styles.graphContainer}>
            <View style={styles.graphContainer}>

              <View style={{justifyContent:"center",alignItems:"center"}}>

                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Saving Goal</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={nonAbs} nonAbs={nonAbs} goal={outputData?.income} color={Colors.primaryBgColor.darkPurple} max={outputData?.monthsSavingGoalVal} index={3}/>
              </View>

              <View style={{justifyContent:"center",alignItems:"center"}}>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >Fixed Cost</Text>
                <Text style={[styles.label,{ color:Colors.primaryBgColor.gray, fontFamily:"LightFont"}]} >{outputData?.monthsTotalFixedCosts}</Text>
                <SingleDonutChartComp strokeWidth={10} radius={50} amount={total}  color={Colors.primaryBgColor.dark } max={outputData?.balance} index={3}/>
              </View>
            </View>
          </View> */}
        </View>
          )
        })
      }
    }


    useEffect(() => {
      if(typeDate === "year"){
        yearRender()
      }else if(typeDate === "month"){
        monthRender()
      }else if(typeDate === "day"){
        dayRender()
      }
    },[outputData])
  return (
    <View style={styles.container} onLayout={(ev) => setGivenWidth(ev.nativeEvent.layout.width)}>
      <ScrollView contentContainerStyle={styles.layout} showsVerticalScrollIndicator >
        {renderItems}
        
        {/* Stats of the Month comp here */}
      </ScrollView>
    </View>
  )
}

export default GraphComp

const styles = StyleSheet.create({
    container:{
        width:width,
        alignItems:"center",
    },
    infoElement:{
      flexDirection:"row",
      gap:5
    },
    graphContainer:{
      width:"100%",
      flexDirection:"row",
      justifyContent:"space-around",
      marginBottom:10,
      height:HEIGHT,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    infoDiv:{
      height:HEIGHT,
      width:"100%",
      justifyContent:"space-between"
    },
    label:{
      fontSize:12,
      fontFamily:"MainFont",
    },
    layout:{
      width:width - 50,
      alignItems:"center",
      justifyContent:"center",
    },
    mainLabel:{
      fontSize:20,
      fontFamily:"MainFont",
      color:Colors.primaryBgColor.black
    },
    resLabel:{
     fontSize:23,
      fontFamily:"MainFont",
      color:"black",
      color:Colors.primaryBgColor.prime
    },
    elementDiv:{
      flexDirection:"row",
      width:"100%",
      justifyContent:"space-between",
      paddingHorizontal:25,
      alignItems:"center"
    },
    graphDiv:{
      justifyContent:"center",
      alignItems:"center",
      borderWidth:1,
      paddingHorizontal:20,
      paddingVertical:20,
      borderRadius:6,
      backgroundColor:Colors.primaryBgColor.lightGray,
      borderColor:Colors.primaryBgColor.gray,
    },
    linearDiv:{
      flexDirection:"row",
       gap: 10,
       padding:10,
       alignItems:"center",
       borderBottomWidth:0.3,
    },
    smallFont:{
      fontSize:11,
      fontFamily:"MainFont",
      color:Colors.primaryBgColor.gray
    },
    rDiv:{
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    }
})