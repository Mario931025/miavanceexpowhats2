import React,{useState,useRef} from 'react'
import { View, Text,StyleSheet,Alert,TouchableOpacity } from 'react-native'
import { Input,Image,Button,Icon,Avatar,AirbnbRating } from 'react-native-elements'
import {map,size,filter,isEmpty} from'lodash';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../Componentes/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AddProduct() {

    //guarda los valores de los campos
    const [titulo, settitulo] = useState("")
    const [descripcion, setdescripcion] = useState("")
    const [precio, setprecio] = useState(0.0)
    const [imagenes, setimagenes] = useState([])
    const [categoria, setcategoria] = useState("")
    const [errores, seterrores] = useState({})
    const [rating, setrating] = useState(5)
    const btnref = useRef()
    const navigation = useNavigation()



    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View
                style={{
                    borderBottomColor:"#25D366",
                    borderBottomWidth:2,
                    width:100,
                    marginTop:20,
                    alignSelf:"center"
                }}
            />
            
            <Input
                placeholder="titulo"
                onChangeText={(text)=>settitulo(text)}
                inputStyle={styles.input}
                errorMessage={errores.titulo}
            />
              
              <Input
                placeholder="Descripción"
                onChangeText={(text)=>setdescripcion(text)}
                inputStyle={styles.textarea}
                errorMessage={errores.descripcion}
                multiline={true}

            />
              
              <Input
                placeholder="Precio"
                onChangeText={(text)=>setprecio(parseFloat( text))}
                inputStyle={styles.input}
                errorMessage={errores.precio}
                keyboardType="number-pad"

            />
              
            
            <Text style={styles.textlabel}>
                Calidad del producto o servicio
            </Text>
                <AirbnbRating
                    count={5}
                    reviews={["Baja","Deficiente","Normal","Muy bueno","Excelente"]}
                    defaultRating={5}
                    size={25}
                    onFinishRating={(value) => {setrating(value)} }

                />

            <Text style={styles.textlabel}>
                Cargar imagenes
            </Text>
            <Text style={styles.textlabel}>
                Asignar categoria
            </Text>
            <Button
            title="Agregar nuevo producto"
            buttonStyle={styles.btnaddnew}
            ref={btnref}
            />
            
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        borderRadius:50,
        margin:5,
        padding:5,
        elevation:3
    },
    input:{
        width:"90%",
        borderRadius:10,
        borderColor:"#707070",
        marginTop:20,
        paddingHorizontal:20,
        height:50
    },
    textarea:{
        height:150
    },
    textlabel:{
        fontSize:20,
        fontFamily:"arial",
        textAlign:"center",
        fontWeight:"bold",
        color:"#075e54"

    },
    btnaddnew:{
        backgroundColor:"#128c7e",
        marginTop:20,
        marginBottom:40,
        marginHorizontal:20
    }
})