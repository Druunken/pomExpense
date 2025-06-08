import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

import SearchComponent from '../components/FilterComponents/SearchComponent'
import FilterAmount from '@/components/FilterComponents/FilterAmount'
import FilterBalanceType from '@/components/FilterComponents/FilterBalanceType'
import db from '@/services/serverSide'
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/constants/Colors'

const SecondNavComp = ({ navAllPressHandler, searchPressed, setSearchPressed }) => {

    const [data,setData] = useState({})
    const [noData,setNoData] = useState(false)
    const [inputSearch,setInputSearch] = useState("")
    const [amountType,setAmountType] = useState(null)
    const [balType,setBalType] = useState("")

    const filtersOp = useSharedValue(1)
    const filtersX = useSharedValue(0)
    const filtersIndex = useSharedValue(1)
    
    const animatedFilters = useAnimatedStyle(() => {
        return {
            opacity: filtersOp.value,
            zIndex: filtersIndex.value,
            transform: [{ translateX: filtersX.value }]
        }
    })

    const fetchData = async() => {
        try {

            const getData = await db.dynamicQuery(month,year,inputSearch,amountType,balType)
            if(getData.length > 0){
                setData(getData)
                setNoData(false)
            }
            else setNoData(true) 
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if(searchPressed){
            filtersOp.value = withTiming(0, { duration: 150 })
            filtersX.value = withTiming(150, { duration: 250 })
            setTimeout(() => {
                filtersIndex.value = 0
            }, 250);

        }else {
            filtersOp.value = withTiming(1, { duration: 150})
            filtersX.value = withSpring(0)
            filtersIndex.value = 1

        }
    },[searchPressed])

   return (
    <View style={styles.container}>
        <SearchComponent setPressed={setSearchPressed} pressed={searchPressed} state={inputSearch} setState={setInputSearch} />
        <Animated.View style={[animatedFilters,{ flexDirection:"row",gap:10,justifyContent:"center",alignItems:"center" }]}>
            <FilterBalanceType state={balType} setState={setBalType}/> 
            <FilterAmount state={amountType} setState={setAmountType}/>
        </Animated.View>
        <TouchableOpacity onPress={navAllPressHandler}>
            <Icon name='exit' size={25} color={Colors.primaryBgColor.newPrime}/>
        </TouchableOpacity>
    </View>
  )
}

export default SecondNavComp

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-between",
        alignItems:"center",
    }
})