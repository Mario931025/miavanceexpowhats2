//este componente tendra los componentes de confirmar numero y enviar confirmacion

import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator, HeaderStyleInterpolators} from '@react-navigation/stack'
import ConfirmarNumero from '../pantallas/cuenta/ConfirmarNumero';
import EnviarConfirmacion from '../pantallas/cuenta/Enviarconfirmacion'

const Stack = createStackNavigator();
export default function CuentaStack() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
            component={EnviarConfirmacion}
            name="enviar- confirmacion"
            options={{
                title : "Confirma tu numero de teléfono",
                headerStyle : {backgroundColor: "#127C7E"},
                headerTintColor:"#fff",

            }}
            />

<Stack.Screen
            component={ConfirmarNumero}
            name="confirmar-movil"
            options={{
                title : "Confirma numero",
                headerStyle : {backgroundColor: "#127C7E"},
                headerTintColor:"#fff",
                
            }}
            />
        </Stack.Navigator>
    </NavigationContainer>
    )
}
