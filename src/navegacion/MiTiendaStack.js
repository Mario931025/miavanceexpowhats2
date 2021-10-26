import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import MiTienda from '../pantallas/mitienda/MiTienda'
import EditarProducto  from '../pantallas/mitienda/EditarProducto'
import AddProduct from '../pantallas/mitienda/AddProduct'

const Stack = createStackNavigator();


//aqui vamos a agregarle los estilos globales al stack Navigator
export default function MiTiendaStack() {
    return (
     <Stack.Navigator
     screenOptions={{
         headerStyle:{backgroundColor:"#127C7E"},
         headerTintColor:"#fff"
     }}
     >
         <Stack.Screen component={MiTienda} name="mitienda" options={{ title: "Mi Tienda"}} />
         <Stack.Screen component={EditarProducto} name="edit-product" options={{ title: "Editar Producto"}} />
         <Stack.Screen component= {AddProduct} name="add-product" options={{title:"Agrega Nuevo Producto",headerStyle:{backgroundColor:"#127C7E"},headerTintColor:"#fff"}}/>
     </Stack.Navigator>
        
    )
}
