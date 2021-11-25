import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
import { size } from "lodash";

export function validateEmail(email) {
   // console.log(email)
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }


    export const cargarImagenesxAspecto = async (array) => {  
       let imgResponse = { status: false, imagen: "" };  
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);  

         if (status === "denied") {     
           alert("Usted debe permitir el accesos para cargar las imagenes");  
           } else {   
               const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: array,});   
                 if (!result.cancelled) { imgResponse = { status: true, imagen: result.uri };    
                 }   } 
                   return imgResponse; };


//funcion que convierte la imagen a formato blob para subirla al server

export const convertirFicheroBlobl = async (rutafisica)=>{
  const fichero = await fetch(rutafisica);

  //transforma a formato blob
  const blob = await fichero.blob();

  return blob;

}

//nos abrira whatsapp
export const enviarWhatsapp = (numero, text) => {
  //nos quita el simbolo + del telefono
  let link = `whatsapp://send?phone=${numero.substring(
    1,
    size(numero)
  )}&text=${text}`;
  Linking.canOpenURL(link).then((supported) => {
    if (!supported) {
      Alert.alert("Favor instale whatsapp para enviar un mensaje directo");
    } else {
      return Linking.openURL(link);
    }
  });
};
