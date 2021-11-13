import React,{useState,useEffect} from 'react'
import { View, Text,StyleSheet,Dimensions,ScrollView } from 'react-native'
import {Avatar,Icon,Input,Button,Rating} from 'react-native-elements'
import { obternerRegistroxID,ObtenerUsuario,sendPushNotification } from '../../utils/Acciones'
import { size } from 'lodash'
import Loading from '../../Componentes/Loading'
import CarouselImages from '../../Componentes/CarouselImages'

export default function Detalle(props) {

    //id y titulo vienen de route
    const {route} = props
    const {id,titulo} = route.params;

    const [producto, setproducto] = useState({})
    const [expopushtoken, setexpopushtoken] = useState("")
    const [nombrevendedor, setnombrevendedor] = useState("Nombre")
    const [photovendedor, setphotovendedor] = useState("")
    const [mensaje, setmensaje] = useState("")
    const [activeslide, setactiveslide] = useState(0)
    const [loading, setloading] = useState(false)
    const [isVisible, setisVisible] = useState(false)
    const usuarioactual = ObtenerUsuario()
    const [phonenumber, setphonenumber] = useState("")


    useEffect(() => {
        (async()=> {
            setproducto((await obternerRegistroxID("Productos",id)).data)
            console.log("************")
            console.log(producto)
        })()
    }, [])

    useEffect(() => {
        
        (async()=> {
            if(size(producto)>0) {
                const resultado = (
                    await obternerRegistroxID("Usuarios",producto.usuario)
                ).data

                setexpopushtoken(resultado.token)
                setnombrevendedor(resultado.displayName)
                setphotovendedor(resultado.photoURL)
                setphonenumber(resultado.phoneNumber)

                console.log("************")
                console.log(resultado)

            }
        })()
    }, [producto])

    //se muestre una vez se haya cargado las imagenes


    if(producto.lenght !==0) {

        return (
            <ScrollView style={styles.container}>
                <CarouselImages
                 imagenes={producto.imagenes}
                 height={400}
                 width={Dimensions.get("window").width}
                 activeslide={activeslide}
                 setactiveslide={setactiveslide}
                />
                <View style={styles.boxsuperior}>
                    <View
                        style={{borderBottomColor:"#25d366",borderBottomWidth:2,width:100,alignSelf:"center"}}
                    />
                    <Text style={styles.titulos}>{producto.titulo}</Text>
                    <Text style={styles.precio}>$ {parseFloat( producto.precio).toFixed(2)}</Text>

                    <View>
                        <Text style={styles.descripcion}>{producto.descripcion}</Text>
                        <Rating
                            imageSize={20}
                            startingValue={producto.rating}
                            readonly
                        />
                    </View>

                <Text style={styles.titulos}> Contactar al anunciante</Text>
                <View style={styles.avatarbox}>
                    <Avatar
                        source={photovendedor ? {uri:photovendedor} : require("../../../assets/avatar.jpg") }
                        style={styles.avatar}
                        rounded
                        size="large"
                    />
                    <View>
                        <Text style={styles.displayName}>
                            {nombrevendedor? nombrevendedor :"Anónimo"}
                        </Text>
                        <View style={styles.boxinternoavatar}>
                            <Icon
                                type="material-community"
                                name="message-text-outline"
                                color="#25d366"
                                size={40}
                                onPress={() =>{
                                    sendPushNotification("ExponentPushToken[2h_xBRAfwL9INeXgU_EGSV]")
                                    console.log("presionado")
                                    
                                }}
                            />

                             <Icon
                                type="material-community"
                                name="whatsapp"
                                color="#25d366"
                                size={40}
                                onPress={() =>{
                                    console.log("Mensaje")
                                }}
                            />
                        </View>

                    </View>
                </View>

                </View>
            </ScrollView>
        )
    }
   
}

const styles = StyleSheet.create({
    boxsuperior:{
        backgroundColor:"#fff",
        marginTop:-50,
        paddingTop:20,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        alignItems:"center"
    },
    container:{
        backgroundColor:"#fff",
        flex:1
    },titulos:{
        color:"#075E54",
        fontSize:24,
        fontWeight:"bold",
        marginTop:10
    },precio:{
        fontSize:18,
        color:"#128c7e",
        fontWeight:"bold",
        paddingLeft:5
    },descripcion:{
        fontWeight:"300",
        fontSize:16,
        alignSelf:"center",
        paddingHorizontal:10,
        marginVertical:10,
        color:"#757575",
        textAlign:"center"
    },avatarbox:{
        flexDirection:"row",
        alignSelf:"center",
        marginBottom:40,
        flex:1
    },avatar:{
        width:60,
        height:60
    },boxinternoavatar:{
        justifyContent:"center",
        flexDirection:"row"
    },displayName:{
        fontSize:20,
        fontWeight:"bold",
        color:"#075e54"
    }
})