import { View, StyleSheet, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { usersBalanceContext } from "@/hooks/balanceContext";
import TransactionElement from './TransactionElement';
import db from '@/services/serverSide'
import FilterBalanceType from '@/components/FilterComponents/FilterBalanceType'
import SearchComponent from '@/components/FilterComponents/SearchComponent'
import FilterAmount from '@/components/FilterComponents/FilterAmount'

interface Transaction{
    value: string;
    moneyValue: number;
    balanceType: "minus" | "plus";

}

interface DataProps{
    data: Transaction[];
    currency: string
}   

const TransactionsComponent:React.FC<DataProps> = ({ month, year }) => {

    const [data,setData] = useState({})
    const [noData,setNoData] = useState(false)
    const [searchPressed,setSearchPressed] = useState(false)
    const [inputSearch,setInputSearch] = useState("")
    const [amountType,setAmountType] = useState(null)
    const [balType,setBalType] = useState("")

    const { currency } = useContext(usersBalanceContext)

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
        fetchData()
    },[month, year, inputSearch, amountType, balType])

  return (
    <View style={styles.container}>
        <View style={styles.filterDiv}>
                <SearchComponent setPressed={setSearchPressed} pressed={searchPressed} state={inputSearch} setState={setInputSearch} />
            <View style={{display:searchPressed ? "none" : "flex"}}>
                <FilterAmount state={amountType} setState={setAmountType}/>
            </View>
            <View style={{display:searchPressed ? "none" : "flex"}}>
                <FilterBalanceType state={balType} setState={setBalType}/>    
            </View>                        
        </View>
        {!noData && (
            <TransactionElement darkmode={true} dayView={true} givinData={data} currency={currency}/>
        )}
        {noData  && (
            <Text style={styles.noDataLabel}>No Transactions this Month</Text>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        gap:10,
        alignItems:"center",
    },
    label:{
        fontSize:22,
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.lightGray,
    },
    filterDiv:{
        flexDirection:"row",
        alignItems:"center",
        width:"100%",
        justifyContent:"space-between",
        gap:10,
    },
    transactionsOverlay:{
        width:"100%",
        height:65,
        justifyContent:"space-between",
        padding:5,
        flexDirection:"row",
        alignItems:"center",
        borderBottomWidth:0.2,
        borderColor:Colors.primaryBgColor.gray
    },
    noDataLabel:{
        fontFamily:"MainFont",
        fontSize:25,
        color:Colors.primaryBgColor.prime,
        textAlign:"center",
    },
})

export default TransactionsComponent