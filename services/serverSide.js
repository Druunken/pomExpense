import * as SQLite from 'expo-sqlite'
import { Alert } from 'react-native'

import currencyFile from '../services/currencies.js'
import { router } from 'expo-router';

const db = SQLite.openDatabaseSync("balance.db")


const createCurrentDate = async() => {
  const date = new Date
  const currDay = date.toISOString().split("T")[0]
  console.log(currDay)
  const arr = currDay.split("-")
  const day = arr[2]
  const month = arr[1] // arr[1]
  const year = "2026" // arr[0]
  const fullDate = `${year}-${month}-${day}`
  return [day,month,year,fullDate]
}

const alertMsg = (title,label) => {
  Alert.alert(
    `${title}`,
    `${label}`,
    [
      {text:"Ok",style:"default"}
    ]
  )
}
const chooseOptions = (title,label) =>{
  return new Promise((resolve) => {
    Alert.alert(
      `${title}`,
      `${label}`,
      [
        {text:"Convert currency",style:"destructive", onPress:() =>{
          resolve("convert")
          router.push("/(main)/home")
        }},
        {text:"Change only currency",style:"default", onPress:() =>{
          resolve("keep")
          router.push("/(main)/home")
        }},
        {text:"Cancel",style:"cancel",onPress:() =>{
          resolve("cancel")
        }}
      ]
    )
  })
}



const setCurrencyConverter = (currency,currencCurrency) => {
  
  switch(currencCurrency){
    case "€":
      currencCurrency = currencyFile.euro;
      break;
    case "$":
      currencCurrency = currencyFile.dollar;
      break;
    case "¥":
      currencCurrency = currencyFile.yen;
      break;
    case "₩":
      currencCurrency = currencyFile.koreanWon;
      break;
  }
  console.log(currencCurrency)

  switch(currency){
    case "€":
      return currencCurrency.euro;
    case "$":
      return currencCurrency.dollar;
    case "¥":
      return currencCurrency.yen;
    case "₩":
      return currencCurrency.koreanWon;
  }
  console.log(currency)

}


// convertion are not correct it will loose some cents

const convertCurrency = async(currency,currencCurrency) => {
  try {
    const currDate = await createCurrentDate()
    const currDay = currDate[0]
    const currMonth = currDate[1]
    const currYear = currDate[2]

    const data = await db.getAllAsync(
      'SELECT * FROM balance'
    )
    const totalBalance = db.getAllAsync(
      'SELECT * FROM totalBalance '
    )

    /* const monthProps = await db.getFirstAsync(
      `
      SELECT monthsTotalBalance, monthsIncomeVal, monthsSavingGoalVal, monthsTotalExpenses FROM monthsProps
      WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
      `,[currMonth,currYear]
    ) */
    
    

    const userChoice = await chooseOptions("Change Currency","Choose an option")

    if(userChoice === "convert"){
      const getConverter = setCurrencyConverter(currency,currencCurrency)

      const updateMonthProps = await db.runAsync(
        `
        UPDATE monthsProps
        SET 
        monthsTotalBalance = monthsTotalBalance * ?, 
        monthsIncomeVal = monthsIncomeVal * ?, 
        monthsSavingGoalVal = monthsSavingGoalVal * ?, 
        monthsTotalExpenses = monthsTotalExpenses * ?
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[getConverter,getConverter,getConverter,getConverter,currMonth,currYear]
      )

      if(updateMonthProps.changes > 0) console.log("Updated MonthsProps SUCCESFULLY!")


      for(let i = 0; i < data.length; i++){
        let currIndex = (data[i].moneyValue * getConverter)
        const updateValue = await db.runAsync(
          `UPDATE balance SET moneyValue = ? WHERE id = ?`,[currIndex,data[i].id]
        )
        /* console.log("changes:",updateValue.changes)
        console.log(data[i].id)
        console.log(currIndex) */
      }
      // update totalBalance value
      const balanceData = await totalBalance
      const convertTotalBalance = await balanceData[0].value * getConverter

      console.log(convertTotalBalance)
      const valueUpdate = await db.runAsync(
        'UPDATE totalBalance SET value = ? ', [convertTotalBalance]
      )

      const currencyUpdate = await db.runAsync(
        'UPDATE totalBalance SET currency = ?', [currency]
      )

      if(valueUpdate.changes > 0 && currencyUpdate.changes > 0){
        alertMsg('Currency Update','Succesfull Converted!')
      } else{
        alertMsg('Error','Something went wrong')
      }

    } else if(userChoice === "keep"){
      const update = await db.runAsync(
        'UPDATE totalBalance SET currency = ?', [currency]
      )
      if(update.changes > 0){
        alertMsg('Currency Update','Succesfull!')
      } else{
        alertMsg('Error','Something went wrong')
      }
    }
    return data
  } catch (error) {
    console.error(error)
  }
}

const newOpening = async() => {
  try {

    const createBalance = await db.runAsync(
      `
      CREATE TABLE IF NOT EXISTS balance (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL, moneyValue INTEGER, type TEXT NOT NULL, subType TEXT, balanceType TEXT NOT NULL, date TEXT, year TEXT, month TEXT, day TEXT, automationType TEXT);`
    )
    const checkBalance = await db.getFirstAsync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="balance"'
    )
    if(checkBalance.name) console.log("Table balance exists!")
    else console.log("Table balance doesn't exists")

    const createFixedCosts = await db.runAsync(
      ` 
      CREATE TABLE IF NOT EXISTS fixedCosts (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT, moneyValue INTEGER, type TEXT);`
    )

    const checkCosts = await db.getFirstAsync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="fixedCosts"'
    )

    if(checkCosts.name) console.log("Table fixedCosts exists!")
    else console.log("Table fixedCosts doesn't exists")

    const createMonths = await db.runAsync(
      `
      CREATE TABLE IF NOT EXISTS monthsProps(
      id INTEGER PRIMARY KEY,
      monthsIncomeVal INTEGER, 
      monthsSavingGoalVal INTEGER, 
      monthsSavingGoalPassed BOOLEAN,  
      monthsSavingGoalWasActive BOOLEAN,
      yearsSavingGoalDate TEXT,
      monthsSavingGoalDate TEXT,
      monthsIncomeDate TEXT,
      yearsIncomeDate TEXT,
      monthsTotalExpenses INTEGER,
      monthsTotalTransactions INTEGER,
      monthsTotalBalance INTEGER,
      monthsIncomeAutomateProcessed BOOLEAN,
      monthsStaticIncomeVal INTEGER,
      monthProcessed BOOLEAN,
      monthsTotalFixedCosts INTEGER,
      monthsFixedCostsActive BOOLEAN
      )`
    )

    const checkMonths = await db.getFirstAsync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="monthsProps"'
    )

    if(checkMonths.name) console.log("Table monthsProps exists!")
    else console.log("Table monthsProps doesn't exists")

    const createTotalBalance = await db.runAsync(
      `
      CREATE TABLE IF NOT EXISTS totalBalance (id INTEGER PRIMARY KEY, value INTEGER, firstLaunch BOOLEAN, currency TEXT, username TEXT, incomeVal INTEGER, savingGoalVal INTEGER, savingGoalActive BOOLEAN, automateIncomeDay TEXT, automateIncomeActive BOOLEAN, totalFixedCosts INTEGER, fixedCostsActive BOOLEAN);`
    )

    const checkTotalBalance = await db.getFirstAsync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="totalBalance"'
    )

    if(checkTotalBalance.name){
      console.log("Table totalBalance exists!")
      const checkRow = await db.getAllAsync(
        'SELECT * FROM totalBalance'
      )

      if(checkRow.length < 1){
        const insertColumnBalance = await db.runAsync(
          'INSERT INTO totalBalance(value, firstLaunch, incomeVal, savingGoalVal, savingGoalActive, automateIncomeDay, automateIncomeActive, totalFixedCosts, fixedCostsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [0,true,0,0,false,null,null,false,0,false]
        )
        if(insertColumnBalance.changes > 0) console.log("Insert Row into totalBalance")
        else console.log("Failed to insert into totalBalance")
      }
      else console.log("A row already exists in totalBalance")
    }
    else console.log("Table totalBalance doesn't exists")

    const getAllTables = await db.getAllAsync(
      'SELECT name FROM sqlite_master WHERE type="table"'
    )
    if(getAllTables.length === 5) return true
    else return false

  } catch (error) {
    console.error(error,"CREATE FN")
  }
}

const deleteTable = async() => {
    try {

      
      
      
      const rmTotalBalance = await db.runAsync('DROP TABLE IF EXISTS totalBalance')
      const rmTransactions = await db.runAsync('DROP TABLE IF EXISTS balance')
      const rmMonthsProps = await db.runAsync('DROP TABLE IF EXISTS monthsProps')
      const rmFixedCosts = await db.runAsync('DROP TABLE IF EXISTS fixedCosts')

      const getAllTables = await db.getAllAsync(
        'SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"'
      );
  
      if (getAllTables.length === 0) {
        console.log("DROPPED ALL TABLES");
        return true;
      } else {
        console.log("FAILED TO DROP TABLES", getAllTables);
        return false;
      }

    } catch (error) {
      console.error("ERROR","DELETE FN",error)
    }
  }

  /* const createTable = async() => {
    try {
 
      console.log(connection)
      await db.execAsync('PRAGMA journal_mode = WAL');
      const create = await db.runAsync(
        `
        CREATE TABLE IF NOT EXISTS balance (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL, moneyValue INTEGER, type TEXT NOT NULL, balanceType TEXT NOT NULL, date TEXT, year TEXT, month TEXT, day TEXT, automationType TEXT);`
      )
      
      if(create.changes > 0) console.log("Succesfully created table 'balance'")
      else console.log("failed to create table 'balance'")

      const createFixedCosts = await db.runAsync(
        `
        CREATE TABLE IF NOT EXISTS fixedCosts (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT, moneyValue INTEGER, type TEXT);`
      )

      if(createFixedCosts.changes > 0) console.log("Created Table 'fixedCosts'")
      else console.log("Failed to create table 'fixedCosts'")

      const createMonthsProps = await db.runAsync(
        `
        CREATE TABLE IF NOT EXISTS monthsProps(
        id INTEGER PRIMARY KEY,
        monthsIncomeVal INTEGER, 
        monthsSavingGoalVal INTEGER, 
        monthsSavingGoalPassed BOOLEAN,  
        monthsSavingGoalWasActive BOOLEAN,
        yearsSavingGoalDate TEXT,
        monthsSavingGoalDate TEXT,
        monthsIncomeDate TEXT,
        yearsIncomeDate TEXT,
        monthsTotalExpenses INTEGER,
        monthsTotalTransactions INTEGER,
        monthsTotalBalance INTEGER,
        monthsIncomeAutomateProcessed BOOLEAN,
        monthsStaticIncomeVal INTEGER,
        monthProcessed BOOLEAN,
        monthsTotalFixedCosts INTEGER,
        monthsFixedCostsActive BOOLEAN
        )`
      )
      if(createMonthsProps.changes > 0) console.log("Succesfully created table 'monthsProps'")
      else console.log("Failed to create table 'monthsProps'")
      

      const createBalance = await db.runAsync(
        `
        CREATE TABLE IF NOT EXISTS totalBalance (id INTEGER PRIMARY KEY, value INTEGER, firstLaunch BOOLEAN, currency TEXT, username TEXT, incomeVal INTEGER, savingGoalVal INTEGER, savingGoalActive BOOLEAN, automateIncomeDay TEXT, automateIncomeActive BOOLEAN, totalFixedCosts INTEGER, fixedCostsActive BOOLEAN);`
      )

      if(createBalance.changes > 0){

        const insertColumnBalance = await db.runAsync(
          'INSERT INTO totalBalance(value, firstLaunch, incomeVal, savingGoalVal, savingGoalActive, automateIncomeDay, automateIncomeActive, totalFixedCosts, fixedCostsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [0,true,0,0,false,null,null,false,0,false]
        )
  
        if(insertColumnBalance.changes > 0) console.log("Succesfully inserted value to 'totalbalance'")
        else console.log("Failed to create column into table 'totalBalance'")
        console.log("Succesfully created table 'totalBalance'")
      }
      else console.log("Failed to create table 'totalBalance'")

      return createFixedCosts.lastInsertRowId
      
    } catch (error) {
      console.error(error)
    }
    
  } */

  // Test code
  const updateMonthsIncomeVal = async(moneyVal) => {
    try {
      const currDate = await createCurrentDate()
      const currDay = currDate[0]
      const currMonth = currDate[1]
      const currYear = currDate[2]



      const updateMonthProps = await db.runAsync(
        'UPDATE monthsProps SET monthsIncomeVal = ? WHERE monthsIncomeDate = ? AND yearsIncomeDate = ? ',[moneyVal,currMonth,currDay]
      )
      const updateMainTable = await db.runAsync(
        'UPDATE totalBalance SET incomeVal = ?',[moneyVal]
      )
      if(updateMonthProps.changes > 0) console.log("Succesfully updated monthsProps current month:",moneyVal)
      if(updateMainTable.changes > 0) console.log('Succesfully updated totalBalance:',moneyVal)
      else console.log("failed INSERTION")
    } catch (error) {
      console.error(error,"updateMonthsIncomeVal") 
      
    }
  }

  const removeMonthsProps = async() => {
    try {
      const connetion = await SQLite.openDatabaseAsync('balance.db')
      const rmData = await connetion.runAsync('DROP TABLE IF EXISTS monthsProps')
      if(rmData.changes > 0) console.log('dropped monthProps talbe succesfully')
    } catch (error) {
      console.error(error)
    }
  }

  /* const createMonthsProps = async() => {
    try {


      const createTable = await db.execAsync(
        `PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS monthsProps(
        id INTEGER PRIMARY KEY,
        monthsIncomeVal INTEGER, 
        monthsSavingGoalVal INTEGER, 
        monthsSavingGoalPassed BOOLEAN,  
        monthsSavingGoalWasActive BOOLEAN,
        yearsSavingGoalDate TEXT,
        monthsSavingGoalDate TEXT,
        monthsIncomeDate TEXT,
        yearsIncomeDate TEXT,
        monthsTotalExpenses INTEGER,
        monthsTotalTransactions INTEGER,
        monthsTotalBalance INTEGER,
        monthsIncomeAutomateProcessed BOOLEAN
        )`
      )
      console.log("Maintained table monthsProps")
    } catch (error) {
      console.error(error,"createMonthsProps")
    }
  } */

  const getMonthsTransactions = async(month,year,getOnlyEx,getOnlyInc) => {
    try {

      const debugD = await db.getAllAsync('SELECT * FROM balance')
      const data = await db.getAllAsync(
        'SELECT * FROM balance WHERE month = ? AND year = ?',[month,year]
      )
      if(getOnlyEx){
        const exOnly = await db.getAllAsync(
          'SELECT * FROM balance WHERE month = ? AND year = ? AND balanceType = "minus"',[month,year]
        )
        return exOnly
      }

      if(getOnlyInc){
        const incOnly = await db.getAllAsync(
          'SELECT * FROM balance WHERE month = ? AND year = ? AND balanceType = "plus"',[month,year]
        )
        return incOnly
      }
      return data
    } catch (error) {
      console.error(error,"getMonthsTransactions")
    }
  }
  // this should set on a fresh start of the app
  const createDefaultMonthsProps = async() => {
    try {
      const currDate = await createCurrentDate()
      const currMonth = currDate[1]
      const currYear = currDate[2]



      const alreadyExists = await db.getAllAsync('SELECT * FROM monthsProps')
      
      // ensure it will create only one current month Prop column
      if(alreadyExists.length < 1){
        const setMonth = await db.runAsync(
          `INSERT INTO monthsProps(
          monthsIncomeDate, yearsIncomeDate, monthsIncomeVal, monthsSavingGoalVal,monthsTotalTransactions,monthsTotalExpenses, monthsIncomeAutomateProcessed, monthsTotalBalance, monthsStaticIncomeVal,monthProcessed 
          ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,[currMonth,currYear,0,0,0,0,false,0,0,false]
        )

        if(setMonth.changes > 0) console.log(`\nSuccesfully Updated CurrentMonthProp\nMonth: ${currMonth}\nYear: ${currYear}`)
      } else console.log("a current month column already exists!")

    } catch (error) {
      console.error(error)
    }
  }

  const InitialiseMonthsProps = async() => {
    try {
      const currDate = await createCurrentDate()
      let currDay = currDate[0]
      const currMonth = currDate[1]
      const currYear = currDate[2]




      // check if current month column exists
      const currMonthExists = await db.getAllAsync(
        `
        SELECT * FROM monthsProps
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[currMonth,currYear]
      )

      // check if there is no column for current Month
      if(currMonthExists.length < 1){
        // check for previous month if it's already processed and exclude the current Month we are currently in
        const notProcessedMonth = await db.getAllAsync(
          'SELECT * FROM monthsProps WHERE monthProcessed = FALSE AND NOT (monthsIncomeDate = ? AND yearsIncomeDate = ?)',[currMonth,currYear]
        ) 
    
        if(notProcessedMonth.length > 0){

          console.log("HERE 1")
          /* 
          it can only exist one month with monthProcessed false so that means we have to fetch this month and get the values and increment in a loop the month till we reached the current month
          meanwhile collect all incomes of each month, of the end the loop deposit the value to the main Balance and process saving goal
          check the if the saving goal in the unprocessed month was active if so compare the values incomeVal - savingGoal >= totalExpenses if true ? achieved else : not achieved
          
          final set the processedMonth to true
          */

          //get data of table "totalBalance"
          const tableTotalBalance = await db.getFirstAsync('SELECT value, incomeVal, savingGoalVal, automateIncomeActive, automateIncomeDay, totalFixedCosts, fixedCostsActive FROM totalBalance')
          const valuesOfUnProcessed = await db.getFirstAsync('SELECT * FROM monthsProps WHERE monthProcessed = FALSE AND NOT (monthsIncomeDate = ? AND yearsIncomeDate = ?)',[currMonth,currYear])
          const costsColumns = await db.getAllAsync('SELECT * FROM fixedCosts')
          
          const incomeMain = tableTotalBalance.incomeVal
          const savingVal = tableTotalBalance.savingGoalVal
          const totalBalanceMain = tableTotalBalance.value
          const incomeDay = tableTotalBalance.automateIncomeDay

          const costsVal = tableTotalBalance.totalFixedCosts
          const costsActive = tableTotalBalance.fixedCostsActive

          console.log("DEBUG",costsColumns)
          console.log("DEBUG",costsVal)
          console.log("DEBUG",costsActive)

          // data of date of last unprocessed month
          const lastMonth = valuesOfUnProcessed.monthsIncomeDate
          const lastYear = valuesOfUnProcessed.yearsIncomeDate
          const lastBalance = valuesOfUnProcessed.monthsTotalBalance
          const staticIncome = valuesOfUnProcessed.monthsStaticIncomeVal
          const incomeWasProcessed = valuesOfUnProcessed.monthsIncomeAutomateProcessed

          // create a constance of lastMonth and lastYear to make them numbers
          /* NOT A NUMBER */
          let numMonth = Number(lastMonth)
          let numYear = Number(lastYear)

          let currNumMonth = Number(currMonth)
          let currNumYear = Number(currYear) 

          // static values to track state of loop 
          let flag = true
          let count = 0
          let balanceCounts = 0
          while(flag){
            //update the unprocessed Month at the first run
            const addTransaction = incomeWasProcessed < 1 ? 1 : 0
            if(count === 0){
              console.log("\nStage 1\nLatest Active date",numMonth,numYear)
              
              const goalAchieved = (valuesOfUnProcessed.monthsIncomeVal - valuesOfUnProcessed.monthsSavingGoalVal) >= valuesOfUnProcessed.monthsTotalExpenses

              const updateUnprocessedMonth = await db.runAsync(
                `
                UPDATE monthsProps 
                SET 
                monthsTotalBalance = monthsTotalBalance + ?,
                monthsIncomeVal = monthsIncomeVal + ?,
                monthsSavingGoalPassed = ?,
                monthProcessed = TRUE,
                monthsIncomeAutomateProcessed = TRUE,
                monthsTotalTransactions = monthsTotalTransactions + ?
                WHERE monthProcessed = FALSE
                `,[
                  incomeWasProcessed < 1 ? incomeMain : 0,
                  incomeWasProcessed < 1 ? incomeMain : 0,
                  goalAchieved === undefined ? false : goalAchieved,
                  addTransaction
                  ]
              )
              if(incomeWasProcessed < 1){              
                const literal = `0${numMonth}`
                const insertColumn = await db.runAsync(
                  'INSERT INTO balance(value, moneyValue, type, balanceType, date, year, month, day, automationType) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',["Income Automation",incomeMain,"Income","plus",`${numYear}-${numMonth < 10 ? literal : numMonth}-${incomeDay}`,numYear,numMonth < 10 ? literal : numMonth.toString(),incomeDay,"income"]
                )

                if(insertColumn.changes > 0) console.log("New balance column added")
                else console.log("Failed INSERT new column")
              }  
              if(updateUnprocessedMonth.changes > 0){
                console.log('Sucessfully processed Month',numMonth,numYear)
                if(incomeWasProcessed < 1)  balanceCounts++
              } 
              else console.log('Failed to process Month')

              count++

              if(numMonth === 12){
                numMonth = 1
                numYear++
              }else{
                numMonth++
              }
            } 

            // create the months in between the current Month
            // numMOnth: month 12 year 2025
            // currNumMonth: month 12 year 2025
            // numYear === currNumYear
            if((numMonth !== currNumMonth || numYear !== currNumYear) && count != 0){
              console.log(numMonth + " and " + currNumMonth)
              const costsLen = costsColumns.length
              const validCosts = costsActive > 0 ? costsVal : 0
              const validationCostsTransaction = costsActive ? costsLen : 0
              const literal = `0${numMonth}`

              if(costsActive > 0){
                for(let i = 0; i < costsLen; i++){
                  const insertCostsColumn = await db.runAsync(
                    `
                    INSERT INTO balance(value, moneyValue, type, balanceType, date, year, month, day, automationType) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,[costsColumns[i].value,-costsColumns[i].moneyValue,costsColumns[i].type,"minus",`${numYear}-${numMonth < 10 ? literal : numMonth}-${"01"}`,numYear,numMonth < 10 ? literal : numMonth.toString(),"01","expense"]
                  )
                  if(insertCostsColumn.changes > 0) console.log("Inserted FC line:",i+1)
                  else console.log("Failed to insert FC")
                }
  
                const updateBalance = await db.runAsync(
                  'UPDATE totalBalance SET value = value - ?',[costsVal]
                )
                if(updateBalance.changes > 0) console.log("Updated balance",costsVal)
                else console.log("Failed to update balance",costsVal)
              }

              const createMonth = await db.runAsync(
                `INSERT INTO monthsProps(
                monthsIncomeDate, yearsIncomeDate, monthsIncomeVal, monthsSavingGoalVal,monthsTotalTransactions,monthsTotalExpenses, monthsIncomeAutomateProcessed, monthsTotalBalance, monthsStaticIncomeVal, monthProcessed 
                ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,[numMonth < 10 ? `0${numMonth}`: numMonth,numYear.toString(),incomeMain,savingVal,1 + validationCostsTransaction,costsVal,true,lastBalance + (incomeMain * (balanceCounts + 1) + validCosts),staticIncome,true]
              )

              const insertColumn = await db.runAsync(
                'INSERT INTO balance(value, moneyValue, type, balanceType, date, year, month, day, automationType) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',["Income Automation",incomeMain,"Income","plus",`${numYear}-${numMonth < 10 ? literal : numMonth}-${incomeDay}`,numYear,numMonth < 10 ? literal : numMonth.toString(),incomeDay,"income"]
              )
              if(insertColumn.changes > 0) console.log("New balance column added")
              else console.log("Failed INSERT new column")

              if(createMonth.changes > 0){
                console.log(`Sucessfully created Month: ${numMonth} Year: ${numYear}`)
                balanceCounts++
              }
              else console.log("Failed to created Month") 

              if(numMonth === 12){
                numMonth = 1
                numYear++
              }else{
                numMonth++
              }
              count++
              // lastly create the current Month and exit loop
            }else if(numMonth === currNumMonth && currNumYear === numYear){
              console.log("stage 3")
              const literal = `0${numMonth}`
              const costsLen = costsColumns.length
              // check if income was deposit in the unprocessed month
              // if yes then minus the counter
              // if no then plus the counter
              const operateIncomeDay = currDay === incomeDay || currDay > incomeDay 
              const incomeCheck = operateIncomeDay ? incomeMain : 0
              const validation = operateIncomeDay ? 1 : 0
              const validationCostsTransaction = costsActive ? costsLen : 0
              const validCosts = costsActive > 0 ? costsVal : 0

              const updateColumnBal = totalBalanceMain + (incomeMain * (balanceCounts + validation)) + validCosts

              console.log("DEBUG",currDay)
              console.log("DEBUG",incomeDay)
              console.log("DEBUG",operateIncomeDay)
              console.log("DEBUG",incomeCheck)

              if(costsActive > 0){
                for(let i = 0; i < costsLen; i++){
                  const insertCostsColumn = await db.runAsync(
                    `
                    INSERT INTO balance(value, moneyValue, type, balanceType, date, year, month, day, automationType) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,[costsColumns[i].value,-costsColumns[i].moneyValue,costsColumns[i].type,"minus",`${numYear}-${numMonth < 10 ? literal : numMonth}-${"01"}`,numYear,numMonth < 10 ? literal : numMonth.toString(),"01","expense"]
                  )
                  if(insertCostsColumn.changes > 0) console.log("Inserted FC line:",i+1)
                  else console.log("Failed to insert FC")
                }
                const updateBalance = await db.runAsync(
                  'UPDATE totalBalance SET value = value - ?',[costsVal]
                )
                if(updateBalance.changes > 0) console.log("Updated balance",costsVal)
                else console.log("Failed to update balance",costsVal)
              }

              const createMonth = await db.runAsync(
                `INSERT INTO monthsProps(
                monthsIncomeDate, yearsIncomeDate, monthsIncomeVal, monthsSavingGoalVal,monthsTotalTransactions,monthsTotalExpenses, monthsIncomeAutomateProcessed, monthsTotalBalance, monthsStaticIncomeVal, monthProcessed 
                ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `,[currNumMonth < 10 ? `0${currNumMonth}` : currNumMonth,currNumYear.toString(),incomeCheck,savingVal,validation + validationCostsTransaction,costsVal,operateIncomeDay,updateColumnBal,staticIncome,false]
              )

              if(incomeCheck){
                const literal = `0${numMonth}`
                const insertColumn = await db.runAsync(
                  'INSERT INTO balance(value, moneyValue, type, balanceType, date, year, month, day, automationType) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',["Income Automation",incomeMain,"Income","plus",`${numYear}-${numMonth < 10 ? literal : numMonth}-${incomeDay}`,numYear,numMonth < 10 ? literal : numMonth.toString(),incomeDay,"income"]
                )
                if(insertColumn.changes > 0) console.log("New balance column added")
                else console.log("Failed INSERT new column")
              }

              if(createMonth.changes > 0) console.log("Succesfully created Current Month")
              else console.log("Failed to create Current month")

              const updateMainBalance = await db.runAsync(
                'UPDATE totalBalance SET value = ?',[updateColumnBal]
              )

              if(updateMainBalance.changes > 0) console.log("Sucessfully updated Main Balance", totalBalanceMain + (incomeMain * count))

              flag = false
            }

          }


        }

      }else if(currMonthExists.length > 0){
        // maybe implement here the income automation functionality
        console.log('Current Month already Exists...\nChecking IncomeActive and SavingGoal...')


        const tableTotalBalance = await db.getFirstAsync('SELECT * FROM totalBalance')
        const autoIncomeMonth = await db.getFirstAsync('SELECT * FROM monthsProps WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[currMonth,currYear])

        const incomeMain = tableTotalBalance.incomeVal
        const savingVal = tableTotalBalance.savingGoalVal
        const totalBalanceMain = tableTotalBalance.value
        const incomeDay = Number(tableTotalBalance.automateIncomeDay)
        const automateIncome = tableTotalBalance.automateIncomeActive 

        let numberCurrDay = Number(currDay)

        // check if the current month has to be processed
        if(incomeDay === numberCurrDay || incomeDay < numberCurrDay && autoIncomeMonth.monthsIncomeAutomateProcessed < 1 && automateIncome > 0){
          console.log("IT'S INCOME DAY!!!")
          const goalAchieved = (incomeMain - savingVal) >= autoIncomeMonth.monthsTotalExpenses

          // Update balance
          const updateBalance = await db.runAsync(
            'UPDATE totalBalance SET value = value + ?',[incomeMain]
          )

          if(updateBalance.changes > 0) console.log('Sucessfully Updated totalBalance "incomeDay"')
          else console.log("Failed to update totalBalance 'incomeDay'")
        
          // Update Saving Goal
          if(autoIncomeMonth.monthsSavingGoalWasActive > 0){
            const updateSavingGoal = await db.runAsync(
              'UPDATE monthsProps SET monthsSavingGoalPassed = ? WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[goalAchieved,currMonth,currYear]
            )

            if(updateSavingGoal.changes > 0) console.log("Saving Goal process is:",goalAchieved)
            else console.log("Failed to Update saving Goal")
          }

          // Update monthsIncomeAutomateProcessed AND incomeVal
          const updateMonthsAutomation = await db.runAsync(
            'UPDATE monthsProps SET monthsIncomeAutomateProcessed = TRUE, monthsTotalBalance = monthsTotalBalance + ?, monthsIncomeVal = monthsIncomeVal + ? WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[incomeMain,incomeMain,currMonth,currYear]
          )
          
          if(updateMonthsAutomation.changes > 0) console.log("Sucessfully updated incomeAutomation 'monthsIncomeAutomateProcessed'")
          else console.log("Failed to update monthsProps 'monthsIncomeAutomateProcessed'") 

        }else{
          console.log("Income Processed")
          console.log("All is set and ready!")
        }
      }
    } catch (error) {
      console.error(error,"setter")
    }
}

const getSpecificMonthsBalance = async(month,year) => {
  try {
    const balanceData = await db.getFirstAsync(
      'SELECT monthsTotalBalance FROM monthsProps WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[month,year]
    )
    console.log(balanceData)
    return await balanceData
  } catch (error) {
    console.error(error)
  }
}

const createSavingGoal = async(val) => {
  try {
    const date = await createCurrentDate()
    const month = date[1]
    const year = date[2]
    const setData = await db.runAsync(
      'UPDATE totalBalance SET savingGoalVal = ?, savingGoalActive = TRUE', [val]
    )
    
    const updateData = await db.runAsync(
      'UPDATE monthsProps SET monthsSavingGoalDate = ?, yearsSavingGoalDate = ?, monthsSavingGoalVal = ?, monthsSavingGoalWasActive = TRUE',[month,year,val]
    )

    if(setData.changes > 0) console.log(`\nCreated a Saving Goal: ${val} \nUpdated saving Goal: ${true} `)
    if(updateData.changes > 0) console.log(`\nSuccesfully Updated Saving Goal Date\nMonth: ${month}\nYear: ${year} `)
  } catch (error) {
    console.error(error)
  }
}

const getMonthProps = async(month,year) => {
  try {
    if(month === undefined && year === undefined){
      const currentDate = await createCurrentDate()
      month = currentDate[1]
      year = currentDate[2]
    }

    const data = await db.getAllAsync(
      `
      SELECT * FROM monthsProps
      WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?`,[month,year]
    )
    return data
  } catch (error) {
    console.error(error,"monthPropsData")
  }
}

const deactiveSavingGoal = async() => {
  try {
    const updateTotalbalance = await db.runAsync(
      `UPDATE totalBalance SET savingGoalActive = FALSE`
    )
    const updateMonthProps = await db.runAsync(
      `UPDATE monthsProps SET monthsSavingGoalWasActive = FALSE`
    )

    if(updateTotalbalance.changes > 0) console.log('savingGoalActive: FALSE')
    if(updateMonthProps.changes > 0) console.log('monthsSavingGoalWasActive: FALSE')
    
  } catch (error) {
    console.error(error)
  }
}

const updateMonthsBalance = async(val) => {
  try {
    const currDate = await createCurrentDate()
    const month = currDate[1]
    const year = currDate[2]

    const setData = await db.runAsync(
      `
      UPDATE monthsProps
      SET monthsTotalBalance = ?
      WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
      `,[val,month,year]
    )
    
    if(setData.changes > 0) console.log('Updated MonthsBalance',year,month,val)
    else console.log("Failed to Update MonthsBalance")
    
  } catch (error) {
    console.error(error,"updateMonthsBalance")
  }
}

const updateMonthsProperties = async(month,year) => {
  try {

    const updateMonthsProps = await db.runAsync(
      `
      UPDATE monthsProps
      SET monthsIncomeAutomateProcessed = TRUE,
      monthsSavingGoalPassed = CASE
        WHEN monthsSavingGoalWasActive = TRUE THEN (monthsSavingGoalVal >= monthsTotalExpenses)
        ELSE FALSE
        END
      WHERE monthsSavingGoalDate = ? AND yearsSavingGoalDate = ?
      `,[month,year]
    )

    const depositIncome = await db.runAsync(
      'UPDATE totalBalance SET value = value + incomeVal',
    )

    if(depositIncome.changes > 0) console.log('Succesfully updated totalBalance')
    else console.log('Failed to Update totalBalance')

    if(updateMonthsProps.changes > 0) console.log('Succesfully updated monthsProps!!!')
    else console.log("Something off buddy")
  } catch (error) {
    console.error(error,"updateMonthsProperties")
  }
}

const getCurrentMonthsProps = async(msg,month,year) => {
  try {
    const monthData = await db.getFirstAsync(
      'SELECT * FROM monthsProps WHERE monthsIncomeDate = ? AND yearsIncomeDate = ? ',[month,year]
    )
    return console.log(msg,monthData)
  } catch (error) {
    console.error(error,"getCurrentMonthsProps")
  }
}

// REMOVE THIS LOGIC IS IN InitialiseMonthsProps

/* const checkAutomateIncomeDay = async() => {
  try {
    const currDate = await createCurrentDate()
    const day = currDate[0]
    const month = currDate[1]
    const year = currDate[2]

    const automateActive = await db.getFirstAsync(
      `
      SELECT automateIncomeActive FROM totalBalance
      `
    )
    // if automation active then check if its processed or not
    if(automateActive.automateIncomeActive > 0){
      const checkProcess = await db.getFirstAsync(
        `
        SELECT monthsIncomeAutomateProcessed FROM monthsProps
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[month,year]
      )
      // if its processed the return a simple log
      if(checkProcess.monthsIncomeAutomateProcessed > 0){
        
        await getCurrentMonthsProps('\nIncome already Processed.\n',month,year)
      }

      // if its null that means that month doesn't had an active Income so that means we have to check the last added properties
      else if(checkProcess.monthsIncomeAutomateProcessed === null || undefined) return console.log('No automation this month',month)

      // if false check if the current day match with the automateIncomeDay 
      else {
        const checkAutmateDay = await db.getFirstAsync('SELECT automateIncomeDay FROM totalBalance')
        const checkAutomateMonth = await db.getFirstAsync('SELECT monthsIncomeDate, yearsIncomeDate FROM monthsProps')

        // if they equal that means we have to add up to balance the incomeVal and update each properties below
        if(Number(checkAutmateDay.automateIncomeDay) === Number(day)){
          await updateMonthsProperties(month,year)
          console.log(`Updated if statement Num.1`)
          // if automate day is bigger than logged in day and logged in month is equal the current month than we have to deposit and
          // update each properties
        }else if(Number(checkAutmateDay.automateIncomeDay) > Number(day) && Number(month) === Number(checkAutomateMonth.monthsIncomeDate)){
          await updateMonthsProperties(checkAutomateMonth.monthsIncomeDate,checkAutomateMonth.yearsIncomeDate)
          console.log(`Updated if statement Num.2`)
          // if automate day is smaller and the current Month is bigger than the automateMonth then deposit and update each properties
        }else if(Number(checkAutmateDay.automateIncomeDay) < Number(day) && Number(month) > Number(checkAutomateMonth.monthsIncomeDate)){
          await updateMonthsProperties(checkAutomateMonth.monthsIncomeDate,checkAutomateMonth.yearsIncomeDate)
          console.log(`Updated if statement Num.3`)
        }else if(Number(checkAutmateDay.automateIncomeDay) != Number(day)){
          await getCurrentMonthsProps(`\nAutomate income day: ${checkAutmateDay.automateIncomeDay}\nCurrent day: ${day}`,month,year)
        }
    }
    }else{
      console.log('Automate Income: Not active')
    }
  } catch (error) {
    console.error(error)
  }
} */

// can be removed
const createIncomeAutomation = async(day) => {
  try {

    const currDate = await createCurrentDate()
    const currDay = currDate[0]
    const currMonth = currDate[1]
    const currYear = currDate[2]

    let flag = false
    if(currDay === day){
      flag = true
    }
    const setData = await db.runAsync(
      'UPDATE totalBalance SET automateIncomeDay = ?, automateIncomeActive = ?',[day, true]
    )
    const updateMonthPropDate = await db.runAsync(
      'UPDATE monthsProps SET monthsIncomeDate = ?, yearsIncomeDate = ?, monthsSavingGoalWasActive = ?, monthsIncomeAutomateProcessed = ? ',[currMonth,currYear,true,true]
    )
    if(setData.changes > 0) console.log(`\nCreated an IncomeAutomation : ${true} \nAutomation Income day: ${day}`)
    if(updateMonthPropDate.changes > 0) console.log(`\nSuccesfully Updated income Month and year\nMonth: ${currMonth}\nYear: ${currYear}`)
  } catch (error) {
    console.error(error,"createIncomeAutomation")
  }
}

const getAllData = async(setData,setCurrency,setUsername,setLoadingDone) => {
  try {

    const data = await db.getAllAsync('SELECT * FROM balance')
    const balance = await db.getAllAsync('SELECT * FROM totalBalance')

    if(!data) return console.log("Error fetching data")
    
    console.log("Succesfully retrieved all data from Table")
    if(setData) setData(data)
    if(setCurrency) setCurrency(balance[0].currency)
    if(setUsername) setUsername(balance[0].username)
    if(setLoadingDone) setLoadingDone(true)
    
    return balance
  } catch (error) {
    console.error(error,"getAllData") 
  }
}

const getTransactions = async() => {
  try {
    const data = await db.getAllAsync('SELECT * FROM balance ORDER BY id DESC LIMIT 20')
    return data;
  } catch (error) {
    console.error(error)
  }
}

//fetch only the day with the selected string ex.'2024-10-19'
const getMoneyDay = async(date) => {
  try {
    const selectDayData = await db.getAllAsync(
      'SELECT * FROM balance WHERE date = ?', [date]
    )
    let res = 0;
    for(let i = 0; i < selectDayData.length; i++){
      if(selectDayData[i].balanceType === "minus")  res -= selectDayData[i].moneyValue
      else res += selectDayData[i].moneyValue
    }
    console.log(res)
  } catch (error) {
    console.error(error,"getMoneyDay")
  }
}

const usersFirstLaunch = async() => {
  try {
    const valid = await db.getFirstAsync(
      'SELECT firstLaunch FROM totalBalance'
    )
    return valid.firstLaunch
  } catch (error) {
    console.error(error,"usersFirstLaunch")
  }
} 

const updateUserVisited = async(cond) => {
  try {
    const update = await db.runAsync(
      'UPDATE totalBalance SET firstLaunch = ?', [cond]
    )

    console.log(`First launch: ${cond}`)
  } catch (error) {
    console.error(error,"updateUserVisited")
  }
}

const positiveBalance = async(moneyAmount,freshAcc) => {
  try {
    /* let formattedAmount = moneyAmount.toString().replace(",", "."); */

    const currDate = await createCurrentDate()
    const month = currDate[1]
    const year = currDate[2]
    const fixedAmount = Number(moneyAmount.toFixed(2))


    if(!freshAcc || freshAcc === undefined){
      const balanceChange = await db.runAsync('UPDATE totalBalance SET value =  value + ?', [fixedAmount])

      const selectMonth = await db.getFirstAsync(
        'SELECT * FROM monthsProps'
      )
      const updateMonthsProps = await db.runAsync(
        `
        UPDATE monthsProps 
        SET
        monthsTotalTransactions = monthsTotalTransactions + 1,
        monthsTotalBalance = monthsTotalBalance + ?,
        monthsIncomeVal = monthsIncomeVal + ?
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[fixedAmount,fixedAmount,month,year]
      )

      if(balanceChange.changes > 0) console.log(`New positive balance at totalBalance: ${fixedAmount}`)
      else console.log("Failed to Update Balance: positiveBalance,balanceChange")

      if(updateMonthsProps.changes > 0) console.log(`New positive balance at monthProps: ${fixedAmount}`)
      else console.log("Failed to Update Balance: positiveBalance,updateMonthsProps")
    }else if(freshAcc){
      const balanceChange = await db.runAsync('UPDATE totalBalance SET value =  ?', [fixedAmount])

      const selectMonth = await db.getFirstAsync(
        'SELECT * FROM monthsProps'
      )
      const updateMonthsProps = await db.runAsync(
        `
        UPDATE monthsProps 
        SET
        monthsTotalBalance = ?,
        monthsIncomeVal = 0
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[fixedAmount,month,year]
      )

      if(balanceChange.changes > 0) console.log(`New positive balance at totalBalance: ${fixedAmount}`)
      else console.log("Failed to Update Balance: positiveBalance,balanceChange")

      if(updateMonthsProps.changes > 0) console.log(`New positive balance at monthProps: ${fixedAmount}`)
      else console.log("Failed to Update Balance: positiveBalance,updateMonthsProps")
    }

    
  } catch (error) {
    console.error(error,"positiveBalance")
  }
}
const negativeBalance = async(moneyAmount) => {
  try {
    /* let formattedAmount = moneyAmount.toString().replace(",", "."); */

    const currDate = await createCurrentDate()
    const month = currDate[1]
    const year = currDate[2]
    const fixedAmount = Number(moneyAmount.toFixed(2))

    const balanceChange = await db.runAsync('UPDATE totalBalance SET value =  value + ?', [fixedAmount])
    const updateMonthsProps = await db.runAsync(
      `
      UPDATE monthsProps 
      SET monthsTotalExpenses = monthsTotalExpenses + ?, 
      monthsTotalTransactions = monthsTotalTransactions + 1,
      monthsTotalBalance = monthsTotalBalance + ? 
      WHERE monthsIncomeDate = ? and yearsIncomeDate = ?
      `,[fixedAmount,fixedAmount,month,year]
    )
    
    if(balanceChange.changes > 0) console.log(`New positive balance at totalBalance: ${fixedAmount}`)
    else console.log("Failed to Update Balance: positiveBalance,balanceChange")

    if(updateMonthsProps.changes > 0) console.log(`New positive balance at monthProps: ${fixedAmount}`)
      else console.log("Failed to Update Balance: positiveBalance,updateMonthsProps")
  } catch (error) {
    console.error(error,"negativeBalance")
  }
}

const getSingleEntry = async(id) => {
  try {
    const getEntry = await db.getFirstAsync('SELECT * FROM balance WHERE id = ?',[id])
    
    return getEntry
  } catch (error) {
    console.error(error,"getSingleEntry")
  }
}

const updateCurrency = async(el,cond) => {
  try {
    console.log(el)
    const update = await db.runAsync(
      'UPDATE totalBalance SET currency = ?', [el]
    )
    if(cond) return
    if(update && update.changes > 0){
      alertMsg("Currency Update","Succesfull updated.")
    }
  } catch (error) {
    console.error(error,"updateCurrency")
    alertMsg('Error',"Something Failed")
  }
}
const updateUsername = async(el,cond) => {
  try {
    const update = await db.runAsync(
      'UPDATE totalBalance SET username = ?', [el]
    )
    if(cond) return
    if(update && update.changes > 0){
      alertMsg("Username Update","Succesfull updated.")
    }
  } catch (error) {
    console.error(error,"updateUsername")
    alertMsg('Error',"Something Failed")
  }
}

const updateBalance = async(id,value,moneyValue,type) => {
  try {
    const connetion = await SQLite.openDatabaseAsync('balance.db')
    await connetion.runAsync(`UPDATE balance SET value = ?, moneyValue = ?, type = ? WHERE id = ?`,[value,moneyValue,type,id])
  } catch (error) {
    console.error(error,"updateBalance")
  }
}



const getBalance = async() => {
  try {
    const balance = await db.getFirstAsync('SELECT value FROM totalBalance')

    
    return balance.value
  } catch (error) {
    console.error(error,"get Balance")
  }
}

const saveData = async(value,moneyValue,type,subType,balanceType,automationType) => {
  try {

    const date = await createCurrentDate()
    const year = date[2]
    const month = date[1]
    const day = date[0]
    const fullDate = `${year}-${month}-${day}`

    const fixedAmount = Number(moneyValue.toFixed(2))

    const data = await db.runAsync('INSERT INTO balance(value, moneyValue, type, subType, balanceType, date, year, month, day, automationType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[value,fixedAmount,type,subType,balanceType,fullDate,year,month,day,automationType])

    if(data.changes > 0){
      console.log(`\nvalue: ${value}\nmoneyValue: ${fixedAmount}\ntype: ${type}\nbalanceType: ${balanceType}\ndate: ${fullDate}\nyear: ${year}\nmonth: ${month}\nday: ${day}`)
    }else{
      console.log('Failed to Save data')
    }

    console.log("Succesfully inserted data into Table...")
  } catch (error) {
    console.error(error,"Insertion Error")
  }
}

const createIncome = async(val,day) => {
  try {
    const currDate = await createCurrentDate()
    const currDay = currDate[0]
    const currMonth = currDate[1]
    const currYear = currDate[2]

    const validationIncomeDay = Number(day) <= Number(currDay)


    const setData = await db.runAsync(
      'UPDATE totalBalance SET incomeVal = ?, automateIncomeDay = ?, automateIncomeActive = ?',[val,day,true]
    )
    const updateMonthProps = await db.runAsync(
      'UPDATE monthsProps SET monthsStaticIncomeVal = ?, monthsIncomeAutomateProcessed = ? WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[
        val,
        validationIncomeDay,
        currMonth,
        currYear
      ]
    )
    if(setData.changes > 0) console.log("Created an Income",val)
    else console.log("Failed to create income 'totalBalance'")

    if(updateMonthProps.changes > 0) console.log("Updated monthsStaticIncomeVal")
    else console.log("Failed to Update monthsStaticIncomeVal")
  } catch (error) {
    console.error(error,"create Income")
  }
}

const checkCurrentDayAutomation = async(day) => {
  try { 
    const automateDay = await db.runAsync(
      'SELECT automateIncomeDay FROM totalBalance'
    )

    return automateDay.automateDay
  } catch (error) {
    console.error(error,"checkCurrentDayAutomation")
  }
}

const disableIncomeAutomation = async() => {
  try { 
    const automateDay = await db.runAsync(
      'UPDATE totalBalance SET automateIncomeActive = ?',[false]
    )

    if(automateDay.changes > 0) console.log(`Disabled Income Automation`) 
  } catch (error) {
    console.log(error,"disableIncomeAutomation")
  }
}


const removeSavingGoal = async() => {
  try {
    const rmData = await db.runAsync(
      'UPDATE savingGoalVal = 0, savingGoalActive = FALSE'
    )
    if(rmData.changes > 0) return console.log('Turned off SavingGoal method')
  } catch (error) {
    console.error(error,"removeSavingGoal") 
  }
}

const updateTransaction = async(value,moneyValue,type,prevMoneyValue,expenseMode,editId) => {
  try {
    const currentDate = await createCurrentDate()
    const month = currentDate[1]
    const year = currentDate[2]

    let dynamicChar = ""

    // get the values right of minus and plus types 
    const calc = () => {
      let res;

      if(expenseMode === "minus"){
        console.log(-moneyValue,prevMoneyValue)
        if(-moneyValue > prevMoneyValue){
          console.log("RUNNING HERE")
          res = prevMoneyValue - -moneyValue
          dynamicChar = "+"
        }else{
          res = -moneyValue - prevMoneyValue 
          dynamicChar = "-"
        }
      }else if(expenseMode === "plus"){
        if(moneyValue > prevMoneyValue){
          res = moneyValue - prevMoneyValue
          dynamicChar = "+"
        }else{
          res = prevMoneyValue - moneyValue
          dynamicChar = "-"
        }
      }
      console.log(typeof res, res,"DEBUG")
      return res
    }

    const isExpenseMode = expenseMode === "minus" ? true : false

    const updateTrans = await db.runAsync(
      `
      UPDATE balance 
      SET
      value = ?,
      moneyValue = ?,
      type = ?
      WHERE id = ?
      `,[value, isExpenseMode ? -moneyValue : moneyValue, type, editId]
    )
    if(updateTrans.changes > 0) console.log("Sucessfully Updated Transaction")
    else console.log("Failed to Update Transaction")

    const columntoUpdate = expenseMode === "minus" ? "monthsTotalExpenses" : "monthsIncomeVal"

    const val = calc()

    // Update MonthsProps

    const updateMonthsProps = await db.runAsync(
      `
      UPDATE monthsProps
      SET
      ${columntoUpdate} = ${columntoUpdate} ${dynamicChar} ? ,
      monthsTotalBalance = monthsTotalBalance ${dynamicChar} ?
      WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
      `,[isExpenseMode ? -val : val,isExpenseMode ? -val : val,month,year]
    )

    if(updateMonthsProps.changes > 0) console.log("Update monthsProps",val,dynamicChar)
    else console.log("Failed to update monthsProps")
    // Update totalBalance
    const updateTotalBalance = await db.runAsync(
      `
      UPDATE totalBalance
      SET
      value = value ${dynamicChar} ?
      `,[isExpenseMode ? -val : val]
    )

    if(updateTotalBalance.changes > 0) console.log("Updated totalBalance",val,dynamicChar)
    return val
  } catch (error) {
    console.error(error,"updateTransaction")
  }
}

const deleteSingleEntrie = async(id,moneyAmount,positive) => {
  try {
    console.log(positive)
    const currDate = await createCurrentDate()
    const month = currDate[1]
    const year = currDate[2]

    const method = await db.getFirstAsync(`DELETE FROM balance WHERE id = ?`, id)

    if(positive){
      const balanceIncomeUpdate = await db.runAsync('UPDATE totalBalance SET value =  value - ?', [moneyAmount])
      const updateIncome = await db.runAsync(
        `
        UPDATE monthsProps 
        SET
        monthsTotalTransactions = monthsTotalTransactions - 1,
        monthsTotalBalance = monthsTotalBalance - ?,
        monthsIncomeVal = monthsIncomeVal - ?
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[moneyAmount,moneyAmount,month,year]
      )
      console.log("")
      if(updateIncome.changes > 0) console.log(`Deletion was Sucesfull type: "income"`)
      else console.log("Failed to Delete single Entry")

      if(balanceIncomeUpdate.changes > 0) console.log(`New changed balance at totalBalance: ${moneyAmount}`)
      else console.log("Failed to Update Balance: deleteSingleEntry")
    }else if(!positive){  
      console.log(typeof moneyAmount,moneyAmount,"DEBUG HEREEE")
      const balanceExpenseUpdate = await db.runAsync('UPDATE totalBalance SET value =  value - ?', [moneyAmount])

      const updateExpense = await db.runAsync(
        `
        UPDATE monthsProps 
        SET
        monthsTotalTransactions = monthsTotalTransactions - 1,
        monthsTotalBalance = monthsTotalBalance - ?,
        monthsTotalExpenses = monthsTotalExpenses - ?
        WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?
        `,[moneyAmount,moneyAmount,month,year]
      )

      if(updateExpense.changes > 0) console.log(`Deletion was Sucesfull type: "expense"`)
      else console.log("Failed to Delete single Entry")

      if(balanceExpenseUpdate.changes > 0) console.log(`New changed balance at totalBalance: ${moneyAmount}`)
      else console.log("Failed to Update Balance: deleteSingleEntry")
    }
    if(method) console.log("Failed to drop the column..")
    else console.log("Succesfully dropped column..")

  } catch (error) {
    console.error(error,"deleteSingleEntrie")
  }
}

const getUsername = async() => {
  try {
    const data = await db.getFirstAsync(
      'SELECT username FROM totalBalance'
    )
    return data.username
  } catch (error) {
    console.error(error)
  }
}

const getCurrency = async() => {
  try {
    const data = await db.getFirstAsync(
      'SELECT currency FROM totalbalance'
    )
    return data.currency
  } catch (error) {
    console.error(error,"getCurrency")
  }
}

const checkSavingGoal = async() => {
  try {
    const checkStatus = await db.getFirstAsync('SELECT savingGoalActive FROM totalBalance')
    if(checkStatus.savingGoalActive > 0) return true
    else return false
  } catch (error) {
    console.error(error,"checkSavingGoal")
  }
}
const checkIncome = async() => {
  try {
    const checkStatus = await db.getFirstAsync('SELECT automateIncomeActive FROM totalbalance')
    if(checkStatus.automateIncomeActive > 0) return true
    else return false
  } catch (error) {
    console.error(error,"checkIncome")
  }
}

const updateIncome = async(cond,amount,day,incomeProcess) => {
  try {
    if(amount < 1 || amount === undefined || amount === null) amount = 0

    const currDate = await createCurrentDate()
    const currMonth = currDate[1]
    const currYear = currDate[2]
    const updateIncomeActive = await db.runAsync('UPDATE totalBalance SET automateIncomeActive = ?, incomeVal = ?, automateIncomeDay = ?',[cond,amount,day])
    const updateCurrentMonth = await db.runAsync('UPDATE monthsProps SET monthsIncomeAutomateProcessed = ?, monthsStaticIncomeVal = ? WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[incomeProcess,amount,currMonth,currYear])

    if(updateIncomeActive.changes > 0){
      console.log(`\nSuccesfully Updated\nincome automation: ${cond}\nincomeVal: ${amount}`)
      alertMsg("Income Update","Succesfully Updated")
    }
    else console.log("Something went wrong updating income automation")

    if(updateCurrentMonth.changes > 0){
      console.log("Succesfully update income in 'monthsProps' ")
    }
    else console.log("Failed to Update income 'monthsProps'")

  } catch (error) {
    console.error(error,'updateIncome')
  }
}

const getIncome = async() => {
  try {
    // check if its active and then check the value
    const getValue = await db.getFirstAsync('SELECT incomeVal FROM totalBalance')

    return getValue.incomeVal

  } catch (error) {
    console.error(error,"getIncome")
  }
}

const getSavingGoal = async() => {
  try {
    // check if its active and then check the value
    const getValue = await db.getFirstAsync('SELECT savingGoalVal FROM totalBalance')

    return getValue.savingGoalVal

  } catch (error) {
    console.error(error,"getSavingGoal")
  }
}

const updateSavingGoal = async(cond,amount) => {
  try {
    if(amount === undefined) amount = 0
    const currDate = await createCurrentDate()
    const currMonth = currDate[1]
    const currYear = currDate[2]

    const updateIncomeActive = await db.runAsync('UPDATE totalBalance SET savingGoalActive = ?, savingGoalVal = ?',[cond,amount])
    const updateCurrentMonth = await db.runAsync('UPDATE monthsProps SET monthsSavingGoalVal = ? WHERE monthsIncomeDate = ? AND yearsIncomeDate = ?',[amount,currMonth,currYear])
    
    if(updateIncomeActive.changes > 0){
      console.log(`\nSuccesfully Updated\nSaving goal automation: ${cond}\nsavingVal: ${amount}`)
      alertMsg("Saving Goal","Succesfully Updated")
    }
    else console.log("Something went wrong updating income automation")

    if(updateCurrentMonth.changes > 0) console.log("Sucessfully update 'monthsProps'")
    else console.log("Failed to update saving goal 'monthsProps'")
  } catch (error) {
    console.error(error,'updateIncome')
  }
}

const incomeDay = async() => {
  try {
    const getDay = await db.getFirstAsync('SELECT automateIncomeDay FROM totalBalance')

    return getDay.automateIncomeDay
  } catch (error) {
    console.error(error,"incomeDay")
  }
}

const updateFixedCostsForm = async() => {
  try {
    const update = await db.runAsync(
      ''
    )
  } catch (error) {
    console.error(error,"updateFixedCostsForm")
  }
}


const createCostsColumn = async(title,amount,type="Fixed Cost") => {
  try {
    const createCostsColumn = await db.runAsync(
      'INSERT INTO fixedCosts(value, moneyValue, type) VALUES(?, ?, ?)',[title,amount,type]
    )
    if(createCostsColumn.changes > 0) console.log(`\nCreated Column in fixedCosts\nTitle: ${title}\nAmount: ${amount}\ntype:${type}`)
    else console.log("Failed to create Costs column")

    const updateTotalBalance = await db.runAsync(
      'UPDATE totalBalance SET totalFixedCosts = totalFixedCosts - ?',[amount]
    )
    if(updateTotalBalance.changes > 0) {
      console.log("Updated totalFixedCosts table totalBalance")
      return true
    }
    else {
      console.log("Failed to Update totalFixedCosts table totalBalance")
      return false
    }
  } catch (error) {
    console.error(error,"createCostsColumn")
  }
}

const deleteCostsColumn = async(id,amount) => {
  try {
    const deleteColumn = await db.runAsync(
      'DELETE FROM fixedCosts WHERE id = ?',[id]
    )
    if(deleteColumn.changes > 0) console.log('Deleted column in fixedCosts ID:',id)
    else console.log('Failed to delete fixedCosts column ID:',id)

    const updateTotalBalance = await db.runAsync(
      'UPDATE totalBalance SET totalFixedCosts = totalFixedCosts + ?',[amount]
    )
    if(updateTotalBalance.changes > 0) console.log("Updated totalFixedCosts table totalBalance")
    else console.log("Failed to Update totalFixedCosts table totalBalance")
  } catch (error) {
    console.error(error,"deleteCostsColumn")
  }
}

const updateCostsColumn = async(id,amount,title,type) => {
  try {
    const updateColumn = await db.runAsync(
      `
      UPDATE
      SET
      value = ?,
      moneyValue = ?,
      type = ?
      WHERE id = ?
      `,[title,amount,type,id]
    )
    if(updateColumn.changes > 0) console.log('Succesfully Update fixedCosts Column ID:',id)
    else console.log('Failed to update fixedCosts column ID:',id)
  } catch (error) {
    console.error(error,"updateCostsColumn")
  }
}

const getAllCosts = async() => {
  try {
    const getCosts = await db.getAllAsync(
      'SELECT * FROM fixedCosts'
    )
    console.log(getCosts)
    return getCosts
  } catch (error) {
    console.error(error,"getAllCosts")
  }
}

// DELETE all columns in fixedCosts
const deleteAllCosts = async() => {
  try {
    const delAll = await db.runAsync(
      'DELETE FROM fixedCosts'
    )
    if(delAll.changes > 0) console.log("DELETED all from fixedCosts")
    else console.log("Failed to DELETE ALL in fixedCosts")

    const resetID = await db.runAsync(
      'DELETE FROM sqlite_sequence WHERE name = "fixedCosts"'
    )
    if(resetID.changes > 0) console.log("RESET ID sucessfull")
    else console.log("Failed to reset ID sequence")

    const updateTotalBalance = await db.runAsync(
      'UPDATE totalBalance SET totalFixedCosts = 0'
    )
    if(updateTotalBalance.changes > 0) console.log("RESETED table totalBalance to 0")
    else console.log("Failed to RESET table totalBalance")
  } catch (error) {
    console.error(erro,"deleteAllCosts")
  }
}

const getTotalCosts = async() => {
  try {
    const total = await db.getFirstAsync(
      'SELECT totalFixedCosts FROM totalBalance'
    )
    return total.totalFixedCosts
  } catch (error) {
    console.error(error,"getTotalCosts")
  }
}

const activateCosts = async() => {
  try {
    const updateTotalBalance = await db.runAsync(
      'UPDATE totalBalance SET fixedCostsActive = TRUE'
    )
    if(updateTotalBalance.changes > 0) console.log("fixedCosts is ACTIVE in totalBalance")
    else console.log("Failed to activate fixedCosts in totalBalance")

    const updateMonthsProps = await db.runAsync(
      'UPDATE monthsProps SET monthsFixedCostsActive = TRUE'
    )
    if(updateMonthsProps.changes > 0) console.log("fixedCosts is ACTIVE in monthsProps")
    else console.log("Failed to activate fixedCosts in monthsProps")
  } catch (error) {
    console.error(error,"activateCosts")
  }
}

const deactiveCosts = async() => {
  try {
    const updateTotalBalance = await db.runAsync(
      'UPDATE totalBalance SET fixedCostsActive = FALSE'
    )
    if(updateTotalBalance.changes > 0) console.log("fixedCosts is UNACTIVE in totalBalance")
    else console.log("Failed to activate fixedCosts in totalBalance")

    const updateMonthsProps = await db.runAsync(
      'UPDATE monthsProps SET monthsFixedCostsActive = FALSE'
    )
    if(updateMonthsProps.changes > 0) console.log("fixedCosts is UNACTIVE in monthsProps")
    else console.log("Failed to activate fixedCosts in monthsProps")

  } catch (error) {
    console.error(error,"deactiveCosts")
  }
}

const getDayTrans = async(day,month,year) => {
  try { 
      let daysObj = {}
      const data = await db.getAllAsync(
        `
          SELECT * FROM balance
        `
      )

      for(let i = 0; i < data.length; i++){

        const amount = data[i].moneyValue
        const dayDate = data[i].day
        const monthDate = data[i].month
        const yearDate = data[i].year
        const dateStr = data[i].date
        const balanceType = data[i].balanceType
        const isIncome = balanceType === "plus"
        const income = isIncome ? amount : 0
        const expense = !isIncome ? amount : 0
        let numbersOfTrans = 0



        if(daysObj[dateStr] === undefined){
          daysObj[dateStr] = {
            balance: amount,
            dayDate: dayDate,
            monthDate: monthDate,
            yearDate: yearDate,
            dateStr: dateStr,
            income: isIncome ? amount : 0,
            expense: !isIncome ? amount : 0,
            numbersOfTrans: 1
          }
  
        }else{
          const prevAmount = daysObj[dateStr].balance
          const prevExpense = daysObj[dateStr].expense
          const prevIncome = daysObj[dateStr].income
          const prevNumOfTrans = daysObj[dateStr].numbersOfTrans

          daysObj[dateStr] = {
            balance: 
            prevAmount < 0 && balanceType === "minus" ? prevAmount + amount :
            prevAmount > 0 && balanceType === "minus" ? prevAmount - amount :
            prevAmount < 0 && balanceType === "plus" ? prevAmount + amount :
            prevAmount + amount,
            dayDate: dayDate,
            income: isIncome ? prevIncome + income : prevIncome,
            expense: !isIncome ? prevExpense + expense : prevExpense,
            numbersOfTrans: prevNumOfTrans + 1

          }
        }
      }
    return daysObj
  } catch (error) {
    console.error(error,"getDayTrans")
  }
}

/* const updateTotalCosts = async(amount) =>{
  try {
    const updateCosts = await db.runAsync(
      'UPDATE SET totalFixedCosts = totalFixedCosts - ?',[amount]
    )
  } catch (error) {
    console.error(error)
  }
} */

  const getAllMonths = async() => {
    try {

      const data = await db.getAllAsync(
        'SELECT * FROM monthsProps'
      )
      return data
    } catch (error) {
      console.error(error,"getAllMonths")
    }
  }

  const dynamicQuery = async (month, year, search = "", filterAmount = "", filterBalType = "", type, selectedDay=undefined) => {
  try {

    const isExpense = filterBalType === "minus" && filterAmount;
    const isIncome = filterBalType === "plus" && filterAmount;

    const orderDirection = isExpense ? 'DESC' : isIncome ? 'ASC' : '';

    const searchPattern = `${search}%`;
    const filterBalPattern = `${filterBalType}%`;

    const params = [searchPattern, filterBalPattern];

    
    let whereClause = `
      value LIKE ? AND
      balanceType LIKE ? 
    `;

    if(selectedDay !== undefined){
      console.log(selectedDay)
      whereClause += ` AND day = ?`
      params.push(selectedDay)
    }

    if (month === undefined && year === undefined) {
      /* const date = await createCurrentDate();
      month = date[1];
      year = date[2]; */
    }

     if(month) {
      console.log("month applied")
      whereClause += `AND month = ?`
      params.push(month)
    }

    if(year){
      console.log("year applied")
      whereClause += `AND year = ?`
      params.push(year)
    }

    if (Array.isArray(type) && type.length > 0) {
      const placeholders = type.map(() => '?').join(', ');
      whereClause += ` AND type IN (${placeholders})`;
      params.push(...type);
    }

    let orderByClause = '';
    if (filterAmount !== null && orderDirection) {
      orderByClause = `ORDER BY moneyValue ${orderDirection}`;
      whereClause += `, ORDER BY ID DESC`
    }else{
      whereClause += `ORDER BY ID DESC`
    }

    const query = `
      SELECT * FROM balance
      WHERE ${whereClause}
      ${orderByClause}
    `;

    const getData = await db.getAllAsync(query, params);
    return getData;

  } catch (error) {
    console.error(error, "dynamicQuery");
  }
};

const getProperMonths = async() => {
  
  try {
    let monthsArr = []
    const getAllMonths = await db.getAllAsync(
      `
      SELECT * FROM monthsProps
      `
    )
    for(let i = getAllMonths.length - 1; i >= 0; i--){
      monthsArr.push(getAllMonths[i].monthsIncomeDate)
    }
    return [monthsArr,getAllMonths]
  } catch (error) {
    
  }
}

const getAllYears = async() => {
  try {
    let yearsObj = {}
    const getYears = await db.getAllAsync(
      `
      SELECT * FROM monthsProps
      `
    )

    /* 
    
      balance : true
      totalTransactions : true
      ...
      some missing here
      

    */

    for(let i = 0 ; i < getYears.length; i ++){
      const currYear = getYears[i]?.yearsIncomeDate
      const balance = getYears[i]?.monthsTotalBalance
      const amountTransactions = getYears[i]?.monthsTotalTransactions
      const expense = getYears[i]?.monthsTotalExpenses
      const staticIncome = getYears[i]?.monthsStaticIncomeVal
      const income = getYears[i]?.monthsIncomeVal

      if(yearsObj[currYear] === undefined)
        yearsObj[currYear] = {
          balance: balance,
          monthsTotalTransactions: amountTransactions,
          year: currYear,
          expense: expense,
          staticIncome: staticIncome,
          income: income

        }
      else{
        const prevAmountTrans = yearsObj[currYear].monthsTotalTransactions
        const prevExpense = yearsObj[currYear].expense
        const prevIncome = yearsObj[currYear].income
        yearsObj[currYear] = {
          balance: balance,
          monthsTotalTransactions: prevAmountTrans + amountTransactions,
          year: currYear,
          expense: prevExpense + expense,
          staticIncome: staticIncome,
          income: prevIncome + income
        }
      }
    }

    return yearsObj

  } catch (error) {
    console.error(error)
  }
}

const getCategoryYears = async() => {
  try {

    let obj = {}
    const getData = await db.getAllAsync(
      `
        SELECT * FROM balance 
        
      `
    )
    for(let i = 0; i < getData.length; i++){
      const cate = getData[i].type
      const year = getData[i].year
      const month = getData[i].month
      const day = getData[i].day
      const date = getData[i].date
      const amount = getData[i].moneyValue
      const balanceType = getData[i].balanceType

      /* 
      
          obj = {
            "2025":[
                "drink":{
                  amount: 1250,
                  year: 2026,
                  transactions: 52,
                },
                "food":{
                  amount: 2500,
                  year: 2026,
                  transactions: 80
                }
              ]
          }
      
      */  

          /* nothing exists */
      if(obj[year] === undefined){
        obj[year] = {
          [cate]:{
            amount: amount,
            year: year,
            transactions: 1
          }
        }
        /* if year exists but check category exists aswell*/
      }else if(cate in obj[year]){
        const prevAmount = obj[year][cate].amount
        const prevTrans = obj[year][cate].transactions

        obj[year][cate] = {
          amount: prevAmount + amount,
          year:year,
          transactions: prevTrans + 1
        }

        /* check if cate doesn't exists */
      }else if(!(cate in obj[year])){
        obj[year][cate] = {
          amount: amount,
          year: year,
          transactions: 1
        }
      }
    }

    return obj
  } catch (error) {
    console.error(error)
  }
}

const getCategoryMonths = async() => {
  try {
    const getData = await db.getAllAsync(
      `
      
      `
    )
  } catch (error) {
    
  }
}

const getCategoryDays = async() => {
  try {
    const getData = await db.getAllAsync(
      `
      
      `
    )
  } catch (error) {
    console.error(error)
  }
}



export default {
  deleteTable,
  positiveBalance,
  usersFirstLaunch,
  updateUserVisited,
  updateCurrency,
  updateUsername,
  deleteSingleEntrie,
  saveData,
  getBalance,
  negativeBalance,
  updateBalance,
  getAllData,
  getUsername,
  getCurrency,
  convertCurrency,
  getTransactions,
  getMoneyDay,
  createIncome,
  createSavingGoal,
  createIncomeAutomation,
  checkCurrentDayAutomation,
  disableIncomeAutomation,
  createDefaultMonthsProps,
  updateMonthsIncomeVal,
  InitialiseMonthsProps,
  removeMonthsProps,
  getMonthProps,
  updateMonthsBalance,
  getSpecificMonthsBalance,
  getMonthsTransactions,
  checkIncome,
  updateIncome,
  checkSavingGoal,
  getIncome,
  getSavingGoal,
  updateSavingGoal,
  incomeDay,
  createCurrentDate,
  getSingleEntry,
  updateTransaction,
  createCostsColumn,
  deleteCostsColumn,
  updateCostsColumn,
  getAllCosts,
  deleteAllCosts,
  getTotalCosts,
  activateCosts,
  deactiveCosts,
  getDayTrans,
  newOpening,
  getAllMonths,
  dynamicQuery,
  getProperMonths,
  getAllYears,
  getCategoryYears,
  getCategoryMonths,
  getCategoryDays
}