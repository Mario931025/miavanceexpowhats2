import React,{useState,useEffect,useCallback} from 'react'
import { View, 
    Text,
    StyleSheet,
    StatusBar,
    FlatList ,
    Dimensions, 
    TouchableOpacity} from 'react-native'
import { Icon,Avatar,Image,Rating,Badge} from 'react-native-elements'
import { useNavigation,useFocusEffect } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { size } from 'lodash'
import { ListarProductos,ObtenerUsuario,listarproductosxcategoria } from '../../utils/Acciones'
import Busqueda from '../../Componentes/Busqueda'


export default function Tienda() {

    const navigation = useNavigation()
    const [productlist, setproductlist] = useState([])
    const [search, setsearch] = useState("")
    const [mensajes, setsetmensajes] = useState("Cargando...")
    const [notificaciones, setnotificaciones] = useState(0)
    const {photoURL} = ObtenerUsuario();
    const [categoria, setcategoria] = useState("")

useEffect(() => {
    (
       async ()=> {
        setproductlist(await ListarProductos())
        console.log("****productos**")
        console.log(productlist)
        }
    )()
}, [])

const cargarfiltroxcategoria = async(categoria)=> {

    const listarproductos = await listarproductosxcategoria(categoria)
    setproductlist(listarproductos)

    if(listarproductos.length === 0) {
        setsetmensajes("No se ecnontrarón datos para la categoria asignada " + categoria)

    }

}

const actualizarProductos = async () => {
    setproductlist(await ListarProductos())
}


    return (
        <View style={styles.frame}>
            <StatusBar backgroundColor="#128c7e"/>
            <View style={styles.header}>
                <KeyboardAwareScrollView>
                    <View style={styles.menu}>
                        <Avatar
                        rounded
                        size={45}
                        source={photoURL ? { uri:photoURL}:require("../../../assets/avatar.jpg") }
                        />

                        <Image
                         source ={require('../../../assets/logo.png')}
                         style={styles.logo}
                        />
                        <View>
                            <Icon
                            type="material-community"
                            name="bell-outline"
                            color="#fff"
                            size={30}
                            />
                            <Badge
                            status="error"
                            containerStyle={{position:"absolute",top:-4,right:-4}}
                            value={2}
                            />
                        </View>   
                    </View>
                <Busqueda />
                </KeyboardAwareScrollView>
            </View>

            <View style={styles.categoriaview}>
                <View style={styles.titulocategoria}>
                    <Text style={styles.categoriatxt}> - CATEGORIAS -</Text>
                    {
                        categoria.length > 0 && (
                            <TouchableOpacity
                                onPress={
                                    ()=> {
                                        setcategoria("")
                                        actualizarProductos()
                                    }
                                }
                            >
                                <Icon
                                    type="material-community"
                                    color="red"
                                    name="close"
                                    reverse
                                    size={10}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
            <View style={styles.categorialist}>
            <BotonCategoria
            categoriaboton = "libros"
            categoria = {categoria}
            icon = "book-open-outline"
            texto = "Libros"
            setcategoria={setcategoria}
            cargarfiltroxcategoria={cargarfiltroxcategoria}
            />
             <BotonCategoria
            categoriaboton = "ideas"
            categoria = {categoria}
            icon = "lightbulb-on-outline"
            texto = "ideas"
            setcategoria={setcategoria}
            cargarfiltroxcategoria={cargarfiltroxcategoria}
            />
             <BotonCategoria
            categoriaboton = "articulos"
            categoria = {categoria}
            icon = "cart-arrow-down"
            texto = "Articulos"
            setcategoria={setcategoria}
            cargarfiltroxcategoria={cargarfiltroxcategoria}
            />
             <BotonCategoria
            categoriaboton = "servicios"
            categoria = {categoria}
            icon = "account-outline"
            texto = "Servicios"
            setcategoria={setcategoria}
            cargarfiltroxcategoria={cargarfiltroxcategoria}
            />
            </View>
            </View>

            

           {size(productlist) > 0 ? (
               <FlatList
               data={productlist}
               renderItem={(producto)=> (
                 <Producto
                    producto={producto}
                    navigation ={navigation}
                 />  
               )}  //permite poner un id por cada producto
               keyExtractor={ (item,index)=>
                index.toString()
                }
               />
           ) :(

            <Text>{mensajes}</Text>
           )}
            
        </View>
    )
}

function Producto (props) {

    const {producto,navigation} = props

    const {titulo,descripcion,precio,imagenes,rating,id,usuario} = producto.item
    
    const {displayName,photoURL} = usuario;
    
    


    return (
        <TouchableOpacity style={styles.card}
        onPress={()=>{
            navigation.navigate("detalle",{
                id,titulo
            })
        }}
        >
           <Image
           source={{uri:imagenes[0]}}
           style={styles.imgproducto}
           />
           <View style={styles.infobox}>

               <Text style={styles.titulo}>{titulo}</Text>
            <Text>{descripcion.substring(0,50)}</Text>
           <Text style={styles.vendidopor}>Vendido por</Text>
           <View style={styles.avatarbox}>
               <Avatar
               source={photoURL ? {uri : photoURL} : require("../../../assets/avatar.jpg")} 
               rounded
               size="large"
               style={styles.avatar}
               />
               <Text 
               style={styles.displayname}
               > {displayName}</Text>
           </View>
            <Rating
            imageSize={15}
            startingValue={rating}
            style={{paddingLeft:40}}
            readonly
            />
            <Text style={styles.precio}> {precio.toFixed(2)}</Text>
           </View>
        </TouchableOpacity>
    )
}

function BotonCategoria(props) 
{
    const {categoriaboton,categoria,icon,texto,setcategoria, cargarfiltroxcategoria} = props;
    return(
        <TouchableOpacity
        style={categoria === categoriaboton ? styles.categoriahover :styles.categoriabtn }
        onPress={() => {
            setcategoria(categoriaboton)
            cargarfiltroxcategoria(categoriaboton)
        }}
        >
            <Icon
            type="material-community"
            name={icon}
            size={30}
            color={categoria === categoriaboton ? "#fff" : "#128c7e"}
            />
            <Text style={categoria === categoriaboton ? styles.cattexthover : styles.cattxt }>{texto}</Text>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
   frame:{
       flex:1,
       color:"#fff",
   },
   header:{
       height:"20%",
       width:"100%",
       backgroundColor:"#128c7e"
   },menu:{
       marginTop:20,
       flexDirection:"row",
       justifyContent:"space-around",
       alignItems:"center"
   },logo:{
       width:45,
       height:45
   },card:{
       width:"100%",
       paddingVertical:20,
       flex:1,
       paddingHorizontal: 10,
       marginHorizontal:5,
       borderBottomColor:"#128c7e",
      borderBottomWidth:1,
     alignItems:"center",
      justifyContent:"center",
      flexDirection:"row"

   },imgproducto:{
       width:150 ,
       height:200 ,
       borderRadius: 10
       
   },infobox:{
       paddingLeft:10,
       alignItems:"center",
       flex:1
   },titulo:{
       marginTop:10,
       fontSize:18,
       fontWeight:"700",
       textAlign:"center",
       color:"#075e54"
   },
   vendidopor:{
       fontSize :16,
       marginTop:5,
       color:"#075e54",
       fontWeight:"700"
   },avatarbox:{
       flexDirection:"row",
       alignItems:"center",
       marginTop:5
   },avatar:{
       width:30,
       height:30,

   },displayname:{

   },precio:{
       marginTop:10,
       fontSize:24,
       fontWeight:"bold",
       color:"#128c7e",
       alignSelf:"center"
   },categoriahover:{
       width:80,
       height:80,
       alignItems:"center",
       justifyContent:"center",
       shadowOffset:{
        width:7,
        height:-8.0
       },
       shadowOpacity:0.5,
       shadowColor:"#000",
       backgroundColor:"#25d366",
       borderRadius:40,
       elevation:1
   },
   categoriabtn:{
    width:80,
    height:80,
    alignItems:"center",
    justifyContent:"center",
    shadowOffset:{
     width:7,
     height:-8.0
    },
    shadowOpacity:0.5,
    shadowColor:"#000",
    backgroundColor:"#fff",
    borderRadius:40,
    elevation:1
   },
   cattexthover:{
       fontSize:12,
       fontStyle:"italic",
       color:"#fff"
   },
   cattxt:{
    fontSize:12,
    fontStyle:"italic",
    color:"#128c7e"
   },
   categoriaview:{
       marginTop: 10
   },
   titulocategoria:{
       flexDirection:"row",
       justifyContent:"center",
       alignItems:"center"
   },
   categoriatxt:{
       color:"#128c7e",
       fontSize:14,
       fontWeight:"bold"
   },
   categorialist:{
     flexDirection:"row",
     justifyContent:"space-around",
     width: "100%",
     paddingTop:5 
   }
  });
  