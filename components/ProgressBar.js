import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const ProgressBar = ({ savingVisible, spendedWidth, savingWidth, fixedWidth, width, spendedClr }) => {

    const fixedWidthVal = useSharedValue(0)
    const spendedWidthVal = useSharedValue(0)
    const fixedOp = useSharedValue(0)
    const spendedOp = useSharedValue(0)



    const animatedFixed = useAnimatedStyle(() => {
        return {
            opacity: fixedOp.value,
            width: fixedWidthVal.value
        }
    })
    const animatedSpended = useAnimatedStyle(() => {
        return {
            opacity: spendedOp.value,
            width: spendedWidthVal.value
        }
    })

    useEffect(() => {
        console.log(spendedWidth,"here")
        
        if(savingVisible){
            fixedWidthVal.value = withSpring(fixedWidth)
            fixedOp.value = withTiming(1,{ duration: 250 })
            if(spendedWidth !== 0) {
                setTimeout(() => {
                    spendedWidthVal.value = withSpring(spendedWidth + fixedWidth, { damping:15})
                    spendedOp.value = withTiming(1, { duration: 250})
                }, 400);
            }else {
                spendedWidthVal.value = withSpring(0)
                spendedOp.value = withTiming(0, { duration: 100})
            }
        }else { 
            fixedWidthVal.value = withSpring(0)
            fixedOp.value = withTiming(0,{ duration: 100 })

            spendedWidthVal.value = withSpring(0)
            spendedOp.value = withTiming(0, { duration: 100})
        }
    },[savingVisible])

    useEffect(() => {

    },[spendedWidth])
  return (
    <View style={[styles.container,{width:"100%",marginTop:22,borderBottomWidth:0}]}>
        <View style={{width:width,flexDirection:"row",marginBottom:5,height:"100%"}}>
            {savingWidth !== 0 && (
                <>
                    <View style={[{justifyContent:"center",alignItems:"center",height:"100%",width:savingWidth}]}>
                    </View>
                    <View style={{backgroundColor:Colors.primaryBgColor.white,justifyContent:"center",alignItems:"center",borderRadius:10,height:"100%",width:55}}>
                        <Text style={styles.infoLabel}>Goal</Text>
                    </View>
                </>
            )}
        </View>
      <View style={[styles.progressDiv,{width:width,flexDirection:"row"}]}>
            <Animated.View style={[styles.fixedDiv,animatedFixed,{width:fixedWidth,minWidth:0,zIndex:3}]}/>
            <Animated.View style={[styles.spendedDiv,animatedSpended,{width:spendedWidth + fixedWidth,minWidth: spendedWidth > 0 ? 5 : 0,backgroundColor:spendedClr}]}/>
            <View style={[styles.savingDiv,{marginLeft:savingWidth}]}/>
      </View>
      <View style={[styles.progressDiv,{width:width,flexDirection:"row",backgroundColor:"none",marginTop:5,maxWidth:width}]}> 
            <View style={[{width:fixedWidth,minWidth:5,marginRight:5}]}>
                <View style={{height:"100%",backgroundColor:Colors.primaryBgColor.gray,width:55,padding:0,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
                    <Text style={styles.infoLabel}>Fixed Cost</Text>
                </View>
            </View>
            <View style={[{width:spendedWidth,minWidth:60,maxWidth:width}]}>
                <View style={{height:"100%",backgroundColor:spendedClr,width:55,paddingHorizontal:0,borderRadius:10,justifyContent:"center",alignItems:"center",opacity:spendedWidth !== 0 ? 1 : 0}}>
                    <Text style={styles.infoLabel}>Spended</Text>
                </View>
            </View>
            {/* <View style={[styles.savingDiv,{marginLeft:savingWidth + 50,minWidth:80}]}>
                <View style={[{justifyContent:"center",alignItems:"center",height:"100%"}]}>
                    <Text style={styles.infoLabel}>Saving</Text>
                </View>
            </View> */}
      </View>
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
    container:{
        justifyContent:"center",
        alignItems:"center",
        height:25,
    },
    infoLabel:{
        fontFamily:"MainFont",
        color:Colors.primaryBgColor.black,
        fontSize:10
    },
    progressDiv:{
        backgroundColor:Colors.primaryBgColor.black,
        height:"100%",
        borderRadius:10,
    },
    fixedDiv:{
        backgroundColor:Colors.primaryBgColor.gray,
        height:"100%",
        /* borderTopLeftRadius:10,
        borderBottomLeftRadius:10 */
        borderRadius:10
    },
    spendedDiv:{
        backgroundColor:Colors.primaryBgColor.prime,
        height:"100%",
        /* borderTopRightRadius:10,
        borderBottomRightRadius:10, */
        position:"absolute",
        left:0,
        borderRadius:10
    },
    savingDiv:{
        backgroundColor:Colors.primaryBgColor.white,
        height:"100%",
        borderRadius:10,
        position:"absolute",
        width:6,

    },

})