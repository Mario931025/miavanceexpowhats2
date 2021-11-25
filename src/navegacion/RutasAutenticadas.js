import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
//va a crear una barra de navegacion abajo
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
//va a crear la navegacion lateral
import {createDrawerNavigator} from '@react-navigation/drawer'
import {Icon} from 'react-native-elements';
import CustomDrawerContent from "../Componentes/CustomDrawerContent";
import TiendaStack from './TiendaStack';
import PerfilStack  from './PerfilStack'
import MiTiendaStack from './MiTiendaStack'
import { createStackNavigator } from '@react-navigation/stack';
import ShopBotton from '../Componentes/ShopBotton';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabBar = () => {
    return (
        <Tab.Navigator
        initialRouteName="tienda"
        tabBarOptions={{
            inactiveTintColor : "#fff", //los iconos estan desactivadod
            activeTintColor : "#fff", //cuando lso iconos esten activados
            style:{
               borderTopLeftRadius: 60,
               borderTopRightRadius:60,
               alignItems:"center",
            backgroundColor:"#128C7E",
            paddingBottom:5,//subir los iconos hacia arriba


            }
        }}
//recibe la variable ruta, contiene la ruta de la pantalla actual 
// para poner icono en el tabbar y lo hacemos dinamico para que recibe el icon que haremos por una funcion
//que devuleva el icono y el color
        screenOptions= {({route}) =>({
            tabBarIcon: ({color}) => motrarIcono(route,color),
        })}

        >
            <Tab.Screen
                component={TiendaStack}
                name="tienda"
                options={{title : "Tienda"}}
            />
            
             <Tab.Screen
                component={MiTiendaStack}
                name="mitienda"
                options={{title : "", 
                tabBarIcon: () => <ShopBotton/>
            }}
            />
            <Tab.Screen
                component={PerfilStack}
                name="cuenta"
                options={{title : "cuenta"}}
            />
        </Tab.Navigator>
    )
}

function motrarIcono(route,color){

    let iconName = "";
    switch(route.name)
    {
        case "tienda":
            iconName ="cart-outline";
            break;
        case "cuenta":
            iconName ="account-circle-outline"
            break;

        case "mitienda":
        iconName="cart-outline";
        break;
    }
    return(
        <Icon type="material-community" name={iconName} size={24} color={color}/>
    )

}

export default function RutasAutenticadas() {
    return(
        <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Tienda"
          component={TabBar}
          options={{
            title: "Tienda",
            drawerIcon: () => {
              <Icon type="material-community" name="store" size={24} />;
            },
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
    )
}