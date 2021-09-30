import React,{useState,useEffect,useRef} from 'react'
import { View, Text,StyleSheet,StatusBar } from 'react-native'
import { Icon,Avatar,Input } from 'react-native-elements'
import {cargarImagenesxAspecto} from '../../utils/Uitl'
import { ObtenerUsuario, subirImagenesBatch } from '../../utils/Acciones'
import { addRegistroEspecifico,actualizarPerfil } from '../../utils/Acciones'
import Loading from '../../Componentes/Loading'
import InputEditable from '../../Componentes/InputEditable'
import Modal from '../../Componentes/Modal'
import CodeInput from 'react-native-code-input'
import FirebaseRecapcha from '../../utils/FirebaseRecapcha';


export default function Perfil() {

    const [imagenperfil, setimagenperfil] = useState("")
    const [loading, setloading] = useState(false)
    const usuario = ObtenerUsuario()
    const [displayName, setdisplayName] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [email, setemail] = useState("")

    const [editablename, seteditablename] = useState(false)
    const [editableemail, seteditableemail] = useState(false)
    const [editablephone, seteditablephone] = useState(false)

    const [verificationid, setverificationid] = useState("")
    const [isVisible, setisVisible] = useState(true)

    useEffect(() => {
       
        setimagenperfil(usuario.photoURL)
        //para impromir los datos del usuario en el estack
        const { displayName,phoneNumber,email} = usuario;

        setdisplayName(displayName)
        setphoneNumber(phoneNumber)
        setemail(email)

    }, [])

    //funcion que cambia los valoresa de las variables que se 
    //de los inpus dependiento del tiepo 
    const onChangeInput = (input,valor) => {
        switch(input){
            case "displayName":
            setdisplayName(valor)
            break;

            case "email":
            setemail(valor)
            break;

            case "phoneNumber":
            setphoneNumber(valor)
            break
        }
    }
    
    const obtenerValor = (input,valor) => {
        switch(input){
            case "displayName":
            return displayName
            break;

            case "email":
            return email
            break;

            case "phoneNumber":
            return phoneNumber
            break;
        }
    }

//METODO PARA ACTUALIZAR EL INPUT DE PERFIL
const actualizarValor =  async (input,valor) =>{
    switch(input){
        case "displayName":
      console.log(await actualizarPerfil({displayName: valor}))      
            addRegistroEspecifico("Usuarios",usuario.uid,{
                displayName:valor
            })
        console.log(usuario)
        break;
        case "email":
            break;
        case "phoneNumber":
            break;
    }
}

const ConfirmarCodigo = async()=>{
    console.log("Confirmar Código")

}



    return (
        <View>
            <StatusBar backgroundColor="#128c7e"/>
            <CabeceraBG/>
            <HeaderAvatar usuario={usuario}
            imagenperfil={imagenperfil}
            setimagenperfil={setimagenperfil}
            setloading={setloading}
            />
            <FormDatos
            onChangeInput={onChangeInput}
            obtenerValor={obtenerValor}
            seteditableemail={seteditableemail}
            seteditablename={seteditablename}
            seteditablephone={seteditablephone}

            editableemail={editableemail}
            editablename={editablename}
            editablephone={editablephone}

            actualizarValor={actualizarValor}
            />
            <Loading isVisible={loading} text="Cragando foto de perfil" />

            <ModalVerification
            isvisibleModal={isVisible}
            setvisibleModal={setisVisible}
            verificationid={verificationid}
            ConfirmarCodigo={ConfirmarCodigo}
            />
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

    const {usuario,setimagenperfil,imagenperfil,setloading} = props;
    const {uid} = usuario

    
     const cambiarfoto = async() =>{
        //se pasna los valores 1 y 1 por que se trata de una imagen cuadrada
        const resultado = await cargarImagenesxAspecto([1,1])

        if(resultado.status){

            setloading(true)
        const url = await subirImagenesBatch([resultado.imagen], "Perfil")
        //// variable que sube la nueva foto de perfil el el campo de photourl del usuario
        const update = await actualizarPerfil({photoURL : url[0]})
        const response = await addRegistroEspecifico("Usuarios",uid,{photoURL: url[0]})

        if(response.statusreponse){
            setimagenperfil(url[0])
            setloading(false)
        }else{
            console.log("error al acrgar imagen")
            setloading(false)
            alert("Ha ocurrido un error inesperado")
        }
      }
     }
    

    return(
        <View style={styles.avatarinline}>
           <Avatar
            size={64}
            rounded
            source={imagenperfil 
                ? {uri:imagenperfil} 
                : require("../../../assets/avatar.jpg")}
            title="Bj"
            containerStyle={{ backgroundColor: 'grey' }}
            onPress={cambiarfoto}
          >
            <Avatar.Accessory size={23} />
          </Avatar>
        </View>
    )
}

//funcion que va a retornar los inputs de la app

function FormDatos (props){
    const {onChangeInput, obtenerValor,editableemail,editablename,editablephone,
        seteditableemail, seteditablename,seteditablephone, actualizarValor
    } = props;


    return(
        <View>
            <InputEditable
            id = "displayName"
            label="Nombre"
            obtenerValor={obtenerValor}
            placeholder = "Nombre"
            onChangeInput = {onChangeInput}
            editable={editablename}
            seteditable={seteditablename}
            actualizarValor={actualizarValor}
            />
             <InputEditable
            id = "email"
            label="Correo"
            obtenerValor={obtenerValor}
            placeholder = "ejemplo@ejemeplo.com"
            onChangeInput = {onChangeInput}
            editable={editableemail}
            seteditable={seteditableemail}
            actualizarValor={actualizarValor}
            />
             <InputEditable
            id = "phoneNumber"
            label="Télefono"
            obtenerValor={obtenerValor}
            placeholder = "+00000000"
            onChangeInput = {onChangeInput}
            editable={editablephone}
            seteditable={seteditablephone}
            actualizarValor={actualizarValor}
            />
        </View>
    )
}

function ModalVerification (props) {
    const {isvisibleModal,setisVisibleModal, ConfirmarCodigo, verificationid} = props;

    return(

        <Modal isVisible={isvisibleModal}
    setisVisible={setisVisibleModal}
    >
        <View style={styles.confirmacion}>
            <Text style={styles.titulomodal}>Confirmar Codigo</Text>
            <Text style={styles.detalle}>Se ha enviado un código de verificación a su número de télefono</Text>
            <CodeInput
             secureTextEntry
             activeColor="#128c7e"
             inactiveColor="#128c7e"
             autoFocus={false}
             inputPosition="center"
             size={40}
             containerStyle={{marginTop:30}}
             codeInputStyle={{borderWidth:1.5}}
             codeLength={6}
            />
        </View>
    </Modal>

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
    },confirmacion:{
        height:200,
        width:"100%",
        alignItems:"center"

    },titulomodal:{
        fontWeight:"bold",
        fontSize:18,
        marginTop:20
    },detalle:{
        marginTop:20,
        fontSize:14,
        textAlign:"center"
    }
})