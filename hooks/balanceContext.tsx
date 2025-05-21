import React,{createContext, FC, ReactNode, useEffect, useState} from "react";
import db from '../services/serverSide.js'
import numberInputValidation from "../services/numberInputValidation.js";

interface IncomeContextType {
    incomeActive: boolean
    setIncomeActive: React.Dispatch<React.SetStateAction<boolean>>;
    automateIncomeDay: string | null
    setAutomateIncomeDay: React.Dispatch<React.SetStateAction<string | null >>;
    savingGoalActive: boolean
    setSavingGoalActive: React.Dispatch<React.SetStateAction<boolean>>;
    currentIncome: string
    setCurrentIncome: React.Dispatch<React.SetStateAction<string>>;

}

interface BalanceContextType {
    currency: string
    setCurrency: React.Dispatch<React.SetStateAction<string>>
    firstLaunch: boolean
    setFirstLaunch: React.Dispatch<React.SetStateAction<boolean>>
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    username: string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    fixedCostAmount: string
    setFixedCostAmount: React.Dispatch<React.SetStateAction<string>>
    savingVal: string
    setSavingVal: React.Dispatch<React.SetStateAction<string>>
    markedDates : object
    setMarkedDates: React.Dispatch<React.SetStateAction<object>>
}

interface IncomeProviderProps {
    children: ReactNode
}

const defaultContextValue: IncomeContextType ={
    incomeActive: false,
    setIncomeActive: () => {},
    automateIncomeDay: null,
    setAutomateIncomeDay: () => {},
    savingGoalActive: false,
    setSavingGoalActive: () => {},
    currentIncome: "",
    setCurrentIncome: () => {}
}

const defaultBalanceContextType: BalanceContextType = {
    currency: "",
    setCurrency: () => {},
    firstLaunch: false,
    setFirstLaunch: () => {},
    value: "10",
    setValue: () => {},
    username: "",
    setUsername: () => {},
    fixedCostAmount: "",
    setFixedCostAmount: () => {},
    markedDates: {},
    setMarkedDates: () => {}, 
    savingVal: "",
    setSavingVal: () => {},

}


export const incomeActiveContext = createContext<IncomeContextType>(defaultContextValue)
export const usersBalanceContext = createContext<BalanceContextType>(defaultBalanceContextType)


export const IncomeProvider: FC<IncomeProviderProps> = ({children}) => {
    const [incomeActive,setIncomeActive] = useState<boolean>(false)
    const [currentIncome,setCurrentIncome] = useState<string>("")
    const [automateIncomeDay,setAutomateIncomeDay] = useState<string | null>(null)
    const [savingGoalActive,setSavingGoalActive] = useState<boolean>(false)

    const getValues = async() => {
        try {
            const getIncomeActive = await db.checkIncome()
            const getIncome = await db.getIncome()
            const getIncomeDay = await db.incomeDay()
            const getGoalActive = await db.checkSavingGoal()

            setIncomeActive(getIncomeActive)
            setCurrentIncome(getIncome.toString())
            setAutomateIncomeDay(getIncomeDay)
            setSavingGoalActive(getGoalActive)

        } catch (error) {
            console.error("INCOME CONTEXT")
        }        
    }

    useEffect(() => {
        getValues()
    },[])

    return(
        <incomeActiveContext.Provider value={{
            incomeActive,setIncomeActive,
            automateIncomeDay,setAutomateIncomeDay,
            savingGoalActive,setSavingGoalActive,
            currentIncome,setCurrentIncome,

        }}>
            {children}
        </incomeActiveContext.Provider>
    )
}

export const BalanceProvider: FC<IncomeProviderProps> = ({ children }) => {
    const [currency, setCurrency] = useState<string>("");
    const [firstLaunch, setFirstLaunch] = useState<boolean>(true);
    const [value, setValue] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [fixedCostAmount, setFixedCostAmount] = useState<string>("0,00");
    const [savingVal,setSavingVal] = useState<string>("0,00")
    const [markedDates,setMarkedDates] = useState<object>({})

    const setMarkingPoints = async() => {
        try {
            const allTransactions = await db.getTransactions()
            if(allTransactions.length < 1) return
            for(let i = 0; i < allTransactions?.length!; i++){
                const currDate = allTransactions[i].date
                const val = allTransactions[i].moneyValue
                setMarkedDates((prev) => {
                    let copy = prev
                    let currOperation = copy[currDate]
                    if(currOperation){
                        const sum = numberInputValidation.converToString((currOperation.amount + val))
                        const num = numberInputValidation.convertToNumber(sum)
                        currOperation.amount = num
                    }else {
                        copy[currDate] = {marked:true, selected:false, amount: val}
                    }
                    return copy
                })
            }

        } catch (error) {
            console.error("SET MARKING POINTS")
        }
    }
    const getValues = async() => {
        try {
            const getCurrency = await db.getCurrency()
            const getValue = await db.getBalance()
            const getUsername = await db.getUsername()
            const getCosts = await db.getTotalCosts()
            const getSavingVal = await db.getSavingGoal()
            setMarkingPoints()
            
            const convertStr = numberInputValidation.converToString(getValue)
            const costsStr = numberInputValidation.converToString(getCosts)
            const savingStr = numberInputValidation.converToString(getSavingVal)

            setCurrency(getCurrency)
            setValue(convertStr)
            setUsername(getUsername)
            setFixedCostAmount(costsStr)
            setSavingVal(savingStr)
        } catch (error) {
            console.error("BALANCE CONTEXT")
        }
    }

    useEffect(() => {
        getValues()
    },[])

    return (
        <usersBalanceContext.Provider value={{
            currency,
            setCurrency,
            firstLaunch,
            setFirstLaunch,
            value,
            setValue,
            username,
            setUsername,
            fixedCostAmount,
            setFixedCostAmount,
            markedDates,
            setMarkedDates,
            savingVal,
            setSavingVal
        }}>
            {children}
        </usersBalanceContext.Provider>
    );
};