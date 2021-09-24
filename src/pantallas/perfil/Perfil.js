import React,{useState,useEffect,useRef} from 'react'
import { View, Text,StyleSheet,StatusBar } from 'react-native'
import { Icon,Avatar,Input } from 'react-native-elements'
import {cargarImagenesxAspect} from '../../utils/Uitl'

export default function Perfil() {
    return (
        <View>
            <StatusBar backgroundColor="#128c7e"/>
            <CabeceraBG/>
            <HeaderAvatar/>
        </View>
    )
}

function CabeceraBG(){
    return(
        <View>
            <View style={styles.bg}>
            <Text style={{ color:"#fff",fontSize:18,fontWeight:"bold"}}>
                Nombre
            </Text>
            </View>
        </View>
    )
}

//el padre envia los datos
function HeaderAvatar(props){

    const cambiarfoto = () =>{
     const cambiarfoto = async() =>{
        //se pasna los valores 1 y 1 por que se trata de una imagen cuadrada
        const resultado = await cargarImagenesxAspect([1,1])
     }
    }

    return(
        <View style={styles.avatarinline}>
           <Avatar
            size={64}
            rounded
            source={{ uri: 'https://randomuser.me/api/portraits/women/57.jpg' }}
            title="Bj"
            containerStyle={{ backgroundColor: 'grey' }}
            onPress={cambiarfoto}
          >
            <Avatar.Accessory size={23} />
          </Avatar>
        </View>
    )
}


const styles = StyleSheet.create({
    bg:{
        width:"100%",
        height:200,
        borderBottomLeftRadius:200,
        borderBottomRightRadius:200,
        backgroundColor:"#128c7e",
        justifyContent:"center",
        alignItems:"center"
    }, //si deseamos poer unos bonotes a un lado con esto se puede
    avatarinline:{
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop:-70,
    },
    avatar:{
        width:80,
        height:80,
    }
})