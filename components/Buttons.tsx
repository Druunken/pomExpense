import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React,{useState} from 'react'
import { Colors } from '@/constants/Colors';

const getImageSource = (description: string) => {
    switch(description.toLowerCase()){
      case "drink":
        return require("../assets/imagesMain/categories/drink.jpg");
      case "food":
        return require("../assets/imagesMain/categories/food.png");
      case "education":
        return require("../assets/imagesMain/categories/education.jpg");
      case "" :
        return require("../assets/imagesMain/categories/pomDefault.webp")
    }
  }


const Buttons = ({icon,label,onPress,brdCol,secBtn}) => {

    const [opacity,setOpacity] = useState(1);

  return (
    <View style={styles.container}>
            <Pressable style={[styles.btn,{opacity:opacity,borderColor:brdCol,backgroundColor:secBtn ? Colors.primaryBgColor.brown : Colors.primaryBgColor.prime}]} onPress={onPress} onPressIn={
                () => {
                    setOpacity(0.3)
                }
            }
            onPressOut={() =>{
                setOpacity(1)
            }}
            >

                <Image style={styles.icon} resizeMode='contain' source={getImageSource(icon)}></Image>
                <Text style={{fontSize:20, color:secBtn && "white",fontFamily: secBtn ? "BoldFont" : "MainReg"}}>{label}</Text>
            </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    btn:{
        borderWidth:2,
        padding:13,
        borderRadius:9,
        width:"100%",
        flexDirection:"row",
        alignItems:"center",
        gap:30,
        height:80,
        borderColor: Colors.primaryBgColor.prime,
        

    },
    container:{
        paddingHorizontal:25,
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        paddingVertical:10,
        shadowColor: "#000000",
        shadowOffset: {
          width: 2,
          height: 3,
        },
        shadowOpacity:  0.18,
        shadowRadius: 4.59,
        elevation: 5
    },
    layout:{
        flexDirection:"column",

    },
    icon:{
        width:50,
        height:50,
        borderRadius:9,
        borderWidth:1
    }
})

export default Buttons