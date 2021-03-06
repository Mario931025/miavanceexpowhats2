import React,{useState,useRef} from 'react'
import { View, Text,StyleSheet,Alert,TouchableOpacity,ScrollView } from 'react-native'
import { Input,Image,Button,Icon,Avatar,AirbnbRating } from 'react-native-elements'
import {map,size,filter,isEmpty} from'lodash';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../Componentes/Loading'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//para cargar imganes del producto
import { cargarImagenesxAspecto} from '../../utils/Uitl'
import {subirImagenesBatch,addRegistroEspecifico,addRegistro,ObtenerUsuario} from '../../utils/Acciones'
export default function AddProduct() {

    //guarda los valores de los campos
    const [titulo, settitulo] = useState("")
    const [descripcion, setdescripcion] = useState("")
    const [precio, setprecio] = useState(0.0)
    const [imagenes, setimagenes] = useState([])
    const [categoria, setcategoria] = useState("")
    const [errores, seterrores] = useState({})
    const [rating, setrating] = useState(5)
    const [loading, setloading] = useState(false)
    const btnref = useRef()
    const navigation = useNavigation()

    //se ba a subir a firebas el producto
    const addProduct = async() => {
        seterrores({})

        if(isEmpty(titulo)) {
            seterrores({titulo:"El campo titulo es obligatorio"})
           
        }else if(isEmpty(descripcion)){
            seterrores({descripcion : "El campo descripción es obligatorio"})

        }else if (!parseFloat(precio) > 0) {
            seterrores({precio : "Introduzca un precio para el producto"})
        }else if(isEmpty(categoria)){
            Alert.alert("Seleccione una categoria","Favor seleccione una categoria para el producto o servicio",[
                { 
                    style:"cancel",
                    text:"Entendido"
                }
            ])
        }else if( isEmpty(imagenes)){
            Alert.alert("Seleccione una imagen","Favor seleccione una imagen para el producto o servicio",[
                { 
                    style:"cancel",
                    text:"Entendido"
                }
            ])
        }else{
            setloading(true)
            const urlimagenes = await subirImagenesBatch(imagenes,"ImagenesProductos")
            

            const producto = {
              titulo,
              descripcion,
              precio,
              usuario: ObtenerUsuario().uid,
              imagenes : urlimagenes,
              status:1,
              fechacreacion : new Date(),
              rating,
              categoria
            }

            const registarproducto = await addRegistro("Productos", producto);

     
            if(registarproducto.statusresponse){
               setloading(false);
              Alert.alert(
                "Registro Exitoso",
                "El producto se ha registrado correctamente",
                [
                  {
                    style: "cancel",
                    text: "Aceptar",
                    onPress: () => navigation.navigate("mitienda"),
                  },
                ]
              );
            }else{
              setloading(false);

        Alert.alert(
          "Registro Fallido",
          "Ha ocurrido un error al registrar producto",
          [
            {
              style: "cancel",
              text: "Aceptar",
            },
          ]
        );
            }
        }
    }


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
                <SubirImagenes imagenes={imagenes} setimagenes={setimagenes}/>

            <Text style={styles.textlabel}>
                Asignar categoria
            </Text>
            <Botonera categoria={categoria} setcategoria={setcategoria}/>
            <Button
            title="Agregar nuevo producto"
            buttonStyle={styles.btnaddnew}
            ref={btnref}
            onPress={addProduct}
            />
            <Loading isVisible={loading} text="Favor espere"/>
            
        </KeyboardAwareScrollView>
    )
}


//funcion que sube imagenes
function SubirImagenes(props) {
    const { imagenes, setimagenes } = props;
  
    const removerimagen = (imagen) => {
      Alert.alert(
        "Eliminar Imagen",
        "¿Estás Seguro de que quieres eliminar la imagen ?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: () => {
              setimagenes(filter(imagenes, (imagenURL) => imagenURL !== imagen));
            },
          },
        ]
      );
    };

    

    return(
        <ScrollView style={styles.viewimagenes} horizontal={true} showsHorizontalScrollIndicator={false}>
            {
                size(imagenes) < 5 && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={async() => {
                            const resultado = await cargarImagenesxAspecto([1,1])
                            if(resultado.status){
                                setimagenes([...imagenes,resultado.imagen])
                            }
                        }}
                    />
                )
            }

            {map(imagenes,(imagen,index)=> ( 
                <Avatar
                    key={index}
                    style={styles.miniatura}
                    source={{uri: imagen}}
                    onPress={() => {removerimagen(imagen)}}
                />
            ))}

        </ScrollView>
    )
}

//componente para poder elegir la categoria del producto

function Botonera(props) {
    const { categoria, setcategoria } = props;
    return (
      <View style={styles.botonera}>
        <TouchableOpacity
          style={styles.btncategoria}
          onPress={() => {
            setcategoria("libros");
          }}
        >
          <Icon
            type="material-community"
            name="book-open"
            size={24}
            color={categoria === "libros" ? "#128c7e" : "#757575"}
            reverse
          />
          <Text>Libros</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btncategoria}
          onPress={() => {
            setcategoria("ideas");
          }}
        >
          <Icon
            type="material-community"
            name="lightbulb-on-outline"
            size={24}
            color={categoria === "ideas" ? "#128c7e" : "#757575"}
            reverse
          />
          <Text>Ideas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btncategoria}
          onPress={() => {
            setcategoria("articulos");
          }}
        >
          <Icon
            type="material-community"
            name="cart-arrow-down"
            size={24}
            color={categoria === "articulos" ? "#128c7e" : "#757575"}
            reverse
          />
          <Text>Artículos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btncategoria}
          onPress={() => {
            setcategoria("servicios");
          }}
        >
          <Icon
            type="material-community"
            name="account"
            size={24}
            color={categoria === "servicios" ? "#128c7e" : "#757575"}
            reverse
          />
          <Text>Servicios</Text>
        </TouchableOpacity>
      </View>
    );
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
        fontFamily:"Roboto",
        textAlign:"center",
        fontWeight:"bold",
        color:"#075e54"

    },
    btnaddnew:{
        backgroundColor:"#128c7e",
        marginTop:20,
        marginBottom:40,
        marginHorizontal:20
    },
    viewimagenes:{
        flexDirection:"row",
        marginHorizontal:20,
        marginTop:30,
        marginBottom:10
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:150,
        width:100,
        backgroundColor:"#e3e3e3",
        padding:10,
    },
    miniatura:{
        width:100,
        height:150,
        marginRight:10,

    },
    botonera:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around"
    },
    btncategoria:{
        justifyContent:"center",
        alignItems:"center",

    }
})