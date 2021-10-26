import React from 'react'

//nos permite crear el stack navigation
//envonvolera los componentes de tienda de la capeta pantallas
import {createStackNavigator} from '@react-navigation/stack'
import Tienda from '../pantallas/tienda/Tienda'
import AddProduct from '../pantallas/mitienda/AddProduct'
import Contacto from '../pantallas/tienda/Contacto'
import MensajesList from '../pantallas/tienda/MensajesList';
import Detalle from '../pantallas/tienda/Detalle'

//nuestra etiqueta de navegación 
const Stack = createStackNavigator();


//options te sirve paraq ue no saque la barra de navegacion arriba del Stack (volver atras, etc)
//puede ser que en elc omponente de detalle la transparencia sea false para ver el boton de regresar (depende el etilo)
export default function TiendaStack() {
    return (
      
          <Stack.Navigator>
              
              <Stack.Screen component= {Tienda} name="tienda" options={{headerShown:false}}/>
              <Stack.Screen component= {AddProduct} name="add-product" options={{title:"Agrega Nuevo Producto",headerStyle:{backgroundColor:"#127C7E"},headerTintColor:"#fff"}}/>
              <Stack.Screen component= {Contacto} name="contacto" options={{title:"Contacto",headerStyle:{backgroundColor:"#127C7E"},headerTintColor:"#fff"}}/>
              <Stack.Screen component= {MensajesList} name="mensajes" options={{title:"Mensajes",headerStyle:{backgroundColor:"#127C7E"},headerTintColor:"#fff"}}/>
              <Stack.Screen component= {Detalle} name="detalle" options={{headerTransparent:true,headerTintColor:"#127C7E",title:""}}/> 
                
          </Stack.Navigator>
    )
}
