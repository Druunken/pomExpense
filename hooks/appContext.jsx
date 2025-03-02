import React, { createContext, useState, useEffect } from "react";

import db from '../services/serverSide.js'

export const AppInitializationContext = createContext()

export function AppInitializationProvider({children}){
    const [firstLaunch,setFirstLaunch] = useState(true)
    const [isInitialized,setIsInitialized] = useState(false)

    useEffect(() => {
        const intializeApp = async() => {
            try {
                const firstLaunch = await db.usersFirstLaunch()
                setFirstLaunch(firstLaunch > 0)
            } catch (error) {
                console.error("Error during app initialziation: ",error)
            } finally{
                setIsInitialized(true)
            }
        }
        intializeApp()
    },[])

    if(!isInitialized){
        return null
    }

    return (
        <AppInitializationContext.Provider value={{
            firstLaunch,
            setFirstLaunch,
        }}>
            {children}
        </AppInitializationContext.Provider>
    )
}