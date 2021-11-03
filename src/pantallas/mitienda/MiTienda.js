import React,{useState,useEffect,useCallback} from 'react'
import { View, Text,StyleSheet,FlatList,Image, Alert } from 'react-native'
import { Icon } from 'react-native-elements/dist/icons/Icon'
import { useNavigation,useFocusEffect } from '@react-navigation/core'
import { ListarMisProductos,actualizarRegistro,eliminarProducto } from '../../utils/Acciones'

export default function MiTienda() {

    const navigation = useNavigation()
    const [productos, setproductos] = useState({})




    useEffect(() => {

        (
            async () =>{
                setproductos( await ListarMisProductos()) //guardan los productos en un arreglo
            }
        )()
       
    }, [ ])


    useFocusEffect(
      useCallback(
        () => {
          (
            async () =>{
                setproductos( await ListarMisProductos()) //guardan los productos en un arreglo
            }
        )()
        },
        [],
      )
    )

    //flatlist elemento suq enos permite dibujar listas
    //recibe la data
    //render es como for del flatlist
    return (
        <View style={{flex:1,justifyContent:"center"}}>
            {productos.length > 0 ? (
        <FlatList
          data={productos}
          renderItem={(item) => (
            <Producto
              producto={item}
              setproductos={setproductos}
              navigation={navigation}
            />
          )}
        />
      ) : (
        <View style={{ alignSelf: "center" }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderColor: "#25d366",
              borderWidth: 1,
              borderRadius: 60,
              alignSelf: "center",
            }}
          >
            <Icon
              type="material-community"
              name="cart-plus"
              size={100}
              color="#25d366"
              style={{ margin: 10 }}
            />
          </View>
        </View>
      )}

            <Icon
            name="plus"
            type="material-community"
            color="#128c7e"
            containerStyle={styles.btncontainer}
            onPress={()=>{navigation.navigate("add-product")}}
            reverse={false}
            />
            
        </View>
    )
}

//funcion que hace destructuring de los elementos que necesitamos de productos

function Producto (props){
    const {producto,setproductos,navigation} = props;
    const {descripcion,precio,id,imagenes,titulo} = producto.item

    return(
        <View style={styles.container}>
            <Image
                source={{uri: imagenes[0]}}
                style={{width:150,height:150,borderRadius:10,marginLeft:10}}
                resizeMethod="resize"
            />
            <View style={styles.viewmedio}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.descripcion}>
          {descripcion.length > 20 ? descripcion.substring(0, 20) : descripcion}
          ...
        </Text>
        <Text style={styles.precio}> $ {parseFloat(precio).toFixed(2)}</Text>
            
            <View style={styles.iconbar}>
              <View style={styles.icon}>
                <Icon 
                type="material-community"
                name="check-outline"
                color="#25d366"
                onPress={()=> {

                 
                    Alert.alert("Dar de alta el producto" , "¿Estas seguro de que deseas dar de alta el producto?",
                    [{
                      style : "default",
                      text:"Confirmar",
                      onPress: async() => {
                         await actualizarRegistro("Productos",id,{status: 0})
                        setproductos(await ListarMisProductos())
                      }
                    },{
                      style:"default",
                      text:"Salir"
                    }])

                }}
                style={styles.icon}
                />
              </View>

              <View style={styles.iconedit}>
                <Icon 
                type="material-community"
                name="pencil-outline"
                color="#25d366"
                onPress={()=> {

                  navigation.navigate("edit-product",{id})
                }}
                style={styles.iconedit}
                />
              </View>

              <View style={styles.icondelete}>
                <Icon 
                type="material-community"
                name="trash-can-outline"
                color="#D32F2F"
                onPress={async()=> {
                  
                  Alert.alert("Eliminar el producto" , "¿Estas seguro de eliminar el producto?",
                    [{
                      style : "default",
                      text:"Confirmar",
                      onPress: async() => {
                        await eliminarProducto("Productos",id)
                        setproductos(await ListarMisProductos())
      
                      }
                    },{
                      style:"default",
                      text:"Salir"
                    }])

                 
                }}
                style={styles.icondelete}
                />
              </View>


            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btncontainer:{
        
        position:"absolute",  //se agrupa segun el usuario le indique
       bottom:10,
       right:10,
       shadowColor:"#000000",
       shadowOffset:{width:5,height:5},
       shadowOpacity:0.2,
        borderColor:"#128c7e",
        borderWidth:3,
        borderRadius:30,
        height:60,
        width:60,
        alignContent:"center",
        justifyContent:"center",
        backgroundColor:"#aae0e3"

    },container:{
        flexDirection: "row",
        flex: 1,
        paddingVertical: 10,
        borderBottomColor: 0.5,
        borderBottomColor: "#128C7E",
        shadowColor: "#128C7E",
        shadowOffset: { height: 10 }, 
        shadowOpacity: 0.9,
    },
    viewmedio: {
      flex: 1,
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    titulo: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        color: "#075e54",
      },
  descripcion: {
    fontSize: 16,
    color: "#757575",
  },
  precio: {
    fontSize: 16,
    color: "#128c7e",
  },
  iconbar:{
    marginTop:20,
    flexDirection:"row",

  },
  icon:{
    borderWidth:1,
    borderColor:"#25d366",
    padding:5,
    borderRadius:60,
    marginLeft:20
  },iconedit:{
    borderWidth:1,
    borderColor:"#FFA000",
    padding:5,
    borderRadius:50,
    marginLeft:20
  },icondelete:{
    borderWidth:1,
    borderColor:"#D32F2F",
    padding:5,
    borderRadius:50,
    marginLeft:20
  }
})