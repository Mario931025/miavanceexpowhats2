import React,{useRef} from 'react'

//use ref nos sirve para poner una referencia
//para acceder a las propiedaddes de nuestro componente que le asigenmos la referencia
//mediante una variable

import { View, Text,StyleSheet,Image,StatusBar } from 'react-native'
import Toast from 'react-native-easy-toast'
import RegisterForm from '../../Componentes/RegisterForm';

export default function Registrar() {
    const toastRef = useRef();
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#128c7e"/>
            <Image source={require('../../../assets/logo.png')}
            style={styles.imglogo}
            />
            <Text style={styles.textobanner}>!Unete!</Text>
            <RegisterForm toastRef= {toastRef} />
            <Toast ref= {toastRef} position="center" opacity={0.9} />
        </View>
      
    )
}

const styles = StyleSheet.create({

        container:{
            flex:1,
            backgroundColor:"#128c7e"
        },
        imglogo:{
            width:106,
            height:106,
            marginTop:40,
            alignSelf:"center" //se va a liniar asi misma en el centro
        },
        textobanner:{
            fontFamily:"Roboto",    //esta fuente no la reconoce Apple tenemos que cambiar por una que si
            fontWeight:"bold",
            fontSize:30,
            color:"#fff",
            alignSelf:"center"
        }
})