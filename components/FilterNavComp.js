import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { food, shopping } from '@/constants/GenreTypes'

const FilterNavComp = ({ filterPressed, setFilterPressed }) => {


    /* 
    
        We need to animated Views !

        One is for the filter with the height 45
        showing the Filter label or the result of matchtes Found.

        The second is gonna show the filter options so on...



    */

    const [categoryList, setCategoryList] = useState([])

    const categoryPress = (label) => {
        /* holds the list of the category to filter out on the upper comp */
        setCategoryList((prev) => {
            let prevArr = prev
            if(prevArr.includes(label)) {
                const ind = prevArr.indexOf(label)
                prevArr.splice(ind,ind + 1)
                if(label === "Food"){
                    indFoodWidth.value = withSpring(0)
                    foodBg.value = withTiming(0,{ duration:250 })
                }else if(label === "Shopping"){
                    indShoppingWidth.value = withSpring(0)
                    shoppingBg.value = withTiming(0, { duration: 250 })
                }else if(label === "Drink"){
                    indDrinkWidth.value = withSpring(0)
                    drinkBg.value = withTiming(0,{ duration:250 })
                }else if(label === "Groceries"){
                    indGroceriesWidth.value = withSpring(0)
                    groceriesBg.value = withTiming(0,{ duration:250 })
                }
                return prevArr
            }
            else {
                prevArr.push(label)
                if(label === "Food"){
                    indFoodWidth.value = withSpring(9)
                    foodBg.value = withTiming(1,{ duration:250 })
                }else if(label === "Shopping"){
                    indShoppingWidth.value = withSpring(9)
                    shoppingBg.value = withTiming(1,{ duration:250 })
                }else if(label === "Drink"){
                    indDrinkWidth.value = withSpring(9)
                    drinkBg.value = withTiming(1,{ duration:250 })
                }else if(label === "Groceries"){
                    indGroceriesWidth.value = withSpring(9)
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

            optionIndex.value = 1
            optionOp.value = withTiming(1,{ duration: 500 })
        }else {

            setTimeout(() => {
                optionIndex.value = -3
            }, 250);
            optionOp.value = withTiming(0,{ duration: 250 })
        }
    },[filterPressed])


    useEffect(() => {},[])

  return (
    <View style={styles.container}>

        <Animated.View style={styles.defContainer}>
            <TouchableOpacity style={[styles.mainBtn,{borderBottomWidth: filterPressed ? 0.2 : 0}]} onPress={pressHandler}>
                <Text style={styles.label}>{!filterPressed ? "Open Filter" : "Close"}</Text>
            </TouchableOpacity>
        </Animated.View>


        <Animated.View style={[styles.optionContainer,animatedOptionContainer]}>
            <View style={{width:"100%"}}>
                <Text style={styles.catLabel}>Category</Text>
            </View>

            <View style={styles.optionDiv}>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedShoppingEl,{}]}>
                        <Animated.View style={[animatedIndShopping,{ backgroundColor:Colors.primaryBgColor.darkPurple,height:0,width:0,borderRadius:5}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("Shopping")}>
                            <Text style={styles.elementLabel}>Shopping</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedFoodEl,{}]}>
                        <Animated.View style={[animatedIndFood,{ backgroundColor:Colors.primaryBgColor.prime,height:0,width:0,borderRadius:5}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("Food")}>
                            <Text style={styles.elementLabel}>Food</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedDrinkEl,{}]}>
                        <Animated.View style={[animatedIndDrink,{ backgroundColor:Colors.primaryBgColor.black,height:0,width:0,borderRadius:5}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("Drink")}>
                            <Text style={styles.elementLabel}>Drink</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={styles.elementDiv}>
                    <Animated.View style={[styles.btn,animatedGroceriesEl,{}]}>
                        <Animated.View style={[animatedIndGroceries,{ backgroundColor:Colors.primaryBgColor.dark,height:0,width:0,borderRadius:5}]}/>
                        <TouchableOpacity  style={{width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => categoryPress("Groceries")}>
                            <Text style={styles.elementLabel}>Groceries</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

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
        width:80,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        flexDirection:"row",
        paddingHorizontal:10
    },
    mainBtn:{
        width:"100%",
        height:45,
        justifyContent:"center",
        alignItems:"center",
    }
})