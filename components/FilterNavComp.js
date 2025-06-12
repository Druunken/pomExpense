import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import DatePickComp from '../components/DatePickComp.js'
import { months, years, days } from '../constants/Dates.js'

const FilterNavComp = ({ filterPressed, setFilterPressed, setCategoryList , categoryList, filteredData, selectedYear, selectedMonth, setSelectedMonth, setSelectedYear, setSelectedDay }) => {


    /* 
    
        We need to animated Views !

        One is for the filter with the height 45
        showing the Filter label or the result of matchtes Found.

        The second is gonna show the filter options so on...



    */

    const [defTextState,setDefTextState] = useState("Press for Filters")
    const [resTextState,setResTextState] = useState("Matches Found")
    const [useTextState,setUseTextState] = useState("Filters Used")

    const categoryPress = (label) => {
        /* holds the list of the category to filter out on the upper comp */

        setCategoryList((prev) => {
            let prevArr = [...prev]
            if(prevArr.includes(label)) {
                const ind = prevArr.indexOf(label)
                prevArr.splice(ind,ind + 1)
                if(label === "food"){
                    indFoodWidth.value = withSpring(0)
                    foodBg.value = withTiming(0,{ duration:250 })
                }else if(label === "shopping"){
                    indShoppingWidth.value = withSpring(0)
                    shoppingBg.value = withTiming(0, { duration: 250 })
                }else if(label === "drink"){
                    indDrinkWidth.value = withSpring(0)
                    drinkBg.value = withTiming(0,{ duration:250 })
                }else if(label === "grocerie"){
                    indGroceriesWidth.value = withSpring(0)
                    groceriesBg.value = withTiming(0,{ duration:250 })
                }
                return prevArr
            }
            else {
                prevArr.push(label)
                if(label === "food"){
                    indFoodWidth.value = withSpring(12)
                    foodBg.value = withTiming(1,{ duration:250 })
                }else if(label === "shopping"){
                    indShoppingWidth.value = withSpring(12)
                    shoppingBg.value = withTiming(1,{ duration:250 })
                }else if(label === "drink"){
                    indDrinkWidth.value = withSpring(12)
                    drinkBg.value = withTiming(1,{ duration:250 })
                }else if(label === "grocerie"){
                    indGroceriesWidth.value = withSpring(12)
                    groceriesBg.value = withTiming(1,{ duration:250 })
                }
                return prevArr
            }
        })

    }

    const indShoppingWidth = useSharedValue(0)
    const indFoodWidth = useSharedValue(0)
    const indDrinkWidth = useSharedValue(0)
    const indGroceriesWidth = useSharedValue(0)

    const optionOp = useSharedValue(0)
    const optionIndex = useSharedValue(0)

    const shoppingBg = useSharedValue(0)
    const foodBg = useSharedValue(0)
    const drinkBg = useSharedValue(0)
    const groceriesBg = useSharedValue(0)

    const defTextOp = useSharedValue(0)
    const defTextX = useSharedValue(0)
    const defTextInd = useSharedValue(0)

    const resTextOp = useSharedValue()
    const resTextX = useSharedValue(0)
    const resTextINd = useSharedValue(-1)

    const useTextOp = useSharedValue(0)
    const useTextX = useSharedValue(0)
    const useTextInd = useSharedValue(-1)

    const animatedDefText = useAnimatedStyle(() => {
        return {
            opacity:defTextOp.value,
            zIndex: defTextInd.value,
            transform: [{ translateX: defTextX.value}]
        }
    })
    const animatedResText = useAnimatedStyle(() => {
        return {
            opacity: resTextOp.value,
            zIndex: resTextINd.value,
            transform: [{ translateX: resTextX.value }]
        }
    })
    const animatedUseText = useAnimatedStyle(() => {
        return{
            opacity: useTextOp.value,
            zIndex: useTextInd.value,
            transform: [{ translateX: useTextX.value }]
        }
    })

    const animatedFoodEl = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            foodBg.value,
            [0,1],
            [Colors.primaryBgColor.gray,Colors.primaryBgColor.babyBlue]
        )
        return{
            backgroundColor
        }
    })
    const animatedDrinkEl = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            drinkBg.value,
            [0,1],
            [Colors.primaryBgColor.gray,Colors.primaryBgColor.babyBlue]
        )
        return{
            backgroundColor
        }
    })
    const animatedGroceriesEl = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            groceriesBg.value,
            [0,1],
            [Colors.primaryBgColor.gray,Colors.primaryBgColor.babyBlue]
        )
        return{
            backgroundColor
        }
    })

    const animatedShoppingEl = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            shoppingBg.value,
            [0,1],
            [Colors.primaryBgColor.gray,Colors.primaryBgColor.babyBlue]
        )
        return{
            backgroundColor
        }
    })



    const animatedOptionContainer = useAnimatedStyle(() => {
        return{
            opacity: optionOp.value,
            zIndex: optionIndex.value,
        }
    })

    const animatedIndShopping = useAnimatedStyle(() => {
        return {
            width:indShoppingWidth.value,
            height:indShoppingWidth.value
        }
    })
    const animatedIndFood = useAnimatedStyle(() => {
        return {
            width:indFoodWidth.value,
            height:indFoodWidth.value
        }
    })
    const animatedIndDrink = useAnimatedStyle(() => {
        return {
            width:indDrinkWidth.value,
            height:indDrinkWidth.value
        }
    })
    const animatedIndGroceries = useAnimatedStyle(() => {
        return {
            width:indGroceriesWidth.value,
            height:indGroceriesWidth.value
        }
    })


    const pressHandler = () => {
        setFilterPressed((prev) => !prev)
    }

    useEffect(() => {

        if(filterPressed) {

            optionIndex.value = 3
            optionOp.value = withTiming(1,{ duration: 500 })
            defTextOp.value = withTiming(0,{duration:150 })
            setTimeout(() => {
                defTextOp.value = withTiming(1,{duration:150 })
                setDefTextState("Close")
            }, 150);
        }else {

            setTimeout(() => {
                optionIndex.value = -3
            }, 250);
            optionOp.value = withTiming(0,{ duration: 250 })

            defTextOp.value = withTiming(0,{duration:150 })
            setTimeout(() => {
                defTextOp.value = withTiming(1,{duration:150 })
                setDefTextState("Open Filters")
            }, 150);
        }
    },[filterPressed])

    const validateFilterRes = () => {
        if(Array.isArray(filteredData)){
            resTextINd.value = 1
            resTextOp.value = withTiming(0,{ duration:250 })
            setTimeout(() => {
                resTextOp.value = withTiming(1,{ duration:250 })
            }, 250)
            resTextX.value = withSpring(100)
            setResTextState(`Total found: ${filteredData.length}`)
        }else{
            setTimeout(() => {
                resTextINd.value = -3
            }, 250);
            resTextOp.value = withTiming(0,{ duration:150 })
            setTimeout(() => {
                resTextOp.value = withTiming(1,{ duration:150 })
            }, 150)
            setResTextState("No Matches")
        }
    }

    useEffect(() => {
        validateFilterRes()
    },[filteredData])

    useEffect(() => {
        defTextInd.value = 1
        defTextOp.value = withTiming(1,{ duration: 250 })
    },[])

    useEffect(() => {
        if(categoryList.length > 0){
            setUseTextState(`Total Filters: ${categoryList.length}`)
            useTextOp.value = withTiming(1,{ duration:250 })
            useTextInd.value = 1
            useTextX.value = withSpring(-100)
        }else if(useTextOp.value > 0){
            useTextOp.value = withTiming(0,{ duration:250 })
            setTimeout(() => {
                useTextInd.value = -3
            }, 250);
            useTextX.value = withSpring(0)
        }
    },[categoryList])

  return (
    <View style={styles.container}>

        <Animated.View style={styles.defContainer}>
            <TouchableOpacity style={[styles.mainBtn,{borderBottomWidth: filterPressed ? 0.2 : 0}]} onPress={pressHandler}>
                <Animated.Text style={[styles.label,styles.dynamicText, animatedUseText,{ fontSize:10}]}>{useTextState}</Animated.Text>
                <Animated.Text style={[styles.label,styles.dynamicText, animatedDefText]}>{defTextState}</Animated.Text>
                <Animated.Text style={[styles.label,styles.dynamicText, animatedResText,{ fontSize:10}]}>{resTextState}</Animated.Text>
            </TouchableOpacity>
        </Animated.View>


        <Animated.View style={[styles.optionContainer,animatedOptionContainer]}>
            <View style={{width:"100%"}}>
                <Text style={styles.catLabel}>Category</Text>
            </View>

            <View style={styles.optionDiv}>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedShoppingEl,{}]}>
                        <Animated.View style={[animatedIndShopping,{ backgroundColor:Colors.primaryBgColor.darkPurple,height:0,width:0,borderRadius:8}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("shopping")}>
                            <Text style={styles.elementLabel}>Shopping</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedFoodEl,{}]}>
                        <Animated.View style={[animatedIndFood,{ backgroundColor:Colors.primaryBgColor.prime,height:0,width:0,borderRadius:8}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("food")}>
                            <Text style={styles.elementLabel}>Food</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedDrinkEl,{}]}>
                        <Animated.View style={[animatedIndDrink,{ backgroundColor:Colors.primaryBgColor.black,height:0,width:0,borderRadius:8}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("drink")}>
                            <Text style={styles.elementLabel}>Drink</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedGroceriesEl,{}]}>
                        <Animated.View style={[animatedIndGroceries,{ backgroundColor:Colors.primaryBgColor.dark,height:0,width:0,borderRadius:8}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("grocerie")}>
                            <Text style={styles.elementLabel}>Groceries</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>


            </View>
            <View style={{width:"100%",marginTop:15}}>
                <Text style={styles.catLabel}>Date</Text>
            </View>

            <View style={styles.dateContainer}>
                <DatePickComp day={true} data={days} setState={setSelectedDay}/>
                <DatePickComp month={true} data={months} setState={setSelectedMonth}/>
                <DatePickComp year={true} data={years} setState={setSelectedYear}/>
                
            </View>
        </Animated.View>
    </View>
  )
}

export default FilterNavComp

const styles = StyleSheet.create({
    container:{
        width:"100%",
        gap:10,
    },
    dateContainer:{
        flexDirection:"row",
        gap:20
    },
    dynamicText:{
        position:"absolute"
    },
    defContainer:{
        justifyContent:"center",
        alignItems:"center",
        width:"100%"
    },
    catLabel:{
        fontSize:25,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.white
    },
    elementLabel:{
        fontFamily:"MainLight",
        fontSize:12,
        color:Colors.primaryBgColor.black
    },
    optionDiv:{
        flexDirection:"row",
        gap:8,
        marginTop:5,
        flexWrap:"wrap",
        alignItems:"center",
    },
    optionContainer:{
        height:450 - 55,
        paddingHorizontal:20,
        alignItems:"center"
    },
    label:{
        fontSize:15,
        fontFamily:"MainFont",
    },
    btn:{
        backgroundColor:Colors.primaryBgColor.gray,
        padding:5,
        width:90,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        flexDirection:"row",
        paddingHorizontal:10,
        height:35
    },
    mainBtn:{
        width:"100%",
        height:45,
        justifyContent:"center",
        alignItems:"center",
    }
})