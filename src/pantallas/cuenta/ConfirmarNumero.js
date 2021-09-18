
import React,{useState,useRef} from 'react'
import { View, Text,StyleSheet,Image } from 'react-native'
import CodeInput from 'react-native-code-input'
import {useNavigation} from '@react-navigation/native'
import Loading from '../../Componentes/Loading'
import {confirmarcodigo,
    obtenerToken,ObtenerUsuario,addRegistroEspecifico
} from '../../utils/Acciones'


export default function ConfirmarNumero(props) {

    const { route } = props;
    const { verificationid } = route.params;

    //console.log(verificationid)

    const [loading, setloading] = useState(false);

    const confirmarCodigoSMS = async (code) => {
         const token =  await obtenerToken()

        const {uid,displayName, photoURL, email, phoneNumber } = ObtenerUsuario()
  
        const registro = await addRegistroEspecifico("Usuarios",uid,{

            token,
            displayName,
            photoURL,
            email,
            phoneNumber,
            fechacreacion : new Date()
        })
  
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')}
            style={styles.imglogo}
            />
            <Text style={styles.titulo} >Favor revise su SMS e introduzca los codigos de confirmación</Text>
            <CodeInput
        activeColor="#fff"
        inactiveColor="#fff"
        autoFocus={true}
        inputPosition="center"
        size={50}
        codeLength={6}
        containerStyle={{ marginTop: 30 }}
        codeInputStyle={{ borderWidth: 1.5 }}
        onFulfill={(code) => {
          confirmarCodigoSMS(code);
        }}
        secureTextEntry
      />

<Loading isVisible={loading} text="Favor espere" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#128C7E",
        paddingHorizontal: 20,
      },
      imglogo: {
        width: 106,
        height: 106,
        alignSelf: "center",
        marginTop: 20,
      },
      titulo: {
        fontSize: 20,
        textAlign: "center",
        color: "#fff",
        marginVertical: 20,
      },
})
