import React,{useState,useEffect,useCallback} from 'react'
import { View, Text,StyleSheet,FlatList,Image } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { useNavigation } from '@react-navigation/core'


export default function MiTienda() {

    const navigation = useNavigation()

    return (
        <View style={{flex:1,justifyContent:"center"}}>
            <Text>Mi tienda</Text>
            <Icon
            name="plus"
            type="material-community"
            color="#128c7e"
            containerStyle={styles.btncontainer}
            onPress={()=>{navigation.navigate("add-product")}}
            reverse={false}
            />
            
        </View>
    )
}


const styles = StyleSheet.create({
    btncontainer:{
        
        position:"absolute",  //se agrupa segun el usuario le indique
       bottom:10,
       right:10,
       shadowColor:"#000000",
       shadowOffset:{width:5,height:5},
       shadowOpacity:0.2,
        borderColor:"#128c7e",
        borderWidth:3,
        borderRadius:30,
        height:60,
        width:60,
        alignContent:"center",
        justifyContent:"center",
        backgroundColor:"#aae0e3"

    }
})