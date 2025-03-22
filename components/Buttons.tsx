import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React,{useRef, useState} from 'react'
import { Colors } from '@/constants/Colors';
import LottieView from 'lottie-react-native';

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
    const lottieRef = useRef(null)



  return (
    <View style={styles.container}>
            <Pressable style={[styles.btn,{opacity:opacity,borderColor:brdCol,backgroundColor:secBtn ? Colors.primaryBgColor.brown : Colors.primaryBgColor.chillOrange}]} onPress={onPress} onPressIn={
                () => {
                    setOpacity(0.3)
                    lottieRef.current?.reset()
                    lottieRef.current?.play()
                }
            }
            onPressOut={() =>{
                setOpacity(1)
            }}
            >

                <Image style={styles.icon} resizeMode='contain' source={getImageSource(icon)}></Image>
                <Text style={{fontSize:20, color:secBtn && "white",fontFamily: secBtn ? "BoldFont" : "MainReg",minWidth:180}}>{label}</Text>
                <LottieView loop={false} ref={lottieRef} resizeMode='contain' source={require("../assets/lottie/settings_arrow.json")} style={styles.lottieArrow} />
            </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    btn:{
        borderWidth:2,
        padding:15,
        borderRadius:30,
        width:"100%",
        flexDirection:"row",
        alignItems:"center",
        gap:30,
        height:80,
        borderColor: Colors.primaryBgColor.prime,
    },
    container:{
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
        width:30,
        height:30,
        borderRadius:20,
        opacity:0
    },
    lottieArrow:{
      width:40,
      height:50,
    }
})

export default Buttons