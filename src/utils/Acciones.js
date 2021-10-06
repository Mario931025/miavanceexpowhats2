//para interacciones

import { firebaseapp } from "./Firebase";
import { Platform } from "react-native";
import * as firebase from 'firebase'
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import 'firebase/firestore';
import uuid from 'random-uuid-v4'
//permite hacer iteracion de cada imagen
import {map, result} from 'lodash'
//para que se conecte a la BD
//para que se conecte a la BD
import { convertirFicheroBlobl } from "./Uitl";

const db = firebase.firestore(firebaseapp);

//codigo para manejar las notificaciones y personalizarlas

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export const validarsesion = (setvalidarsesion) => {

    firebase.auth().onAuthStateChanged((user)=>{

        if(user)
        {
           setvalidarsesion(true)
        }else{
            setvalidarsesion(false)
        }
    })
}


export const cerrarsesion = () => {
    firebase.auth().signOut();
    console.log("cerro sesión")
}


export const validarPhone = (setphoneauth) => {

  db.collection("Usuarios")  //solo se aplica cuando el usuario mete # correctamente
  .doc(ObtenerUsuario().uid)
  .onSnapshot(snapshot => {

    //metodo que ocupamos si la ruta existe o no
    setphoneauth(snapshot.exists)

  })  ///metodo que cuando detecta un cambio en la BD
  
}


export const enviarAutentificacionphone = async (numero,recapcha)=> {

    let verificationid = "";

   await firebase
        .auth()
        .currentUser.reauthenticateWithPhoneNumber(numero,recapcha.current)
        .then((response) => {
            verificationid = response.verificationId
        })
        .catch((err) => {
            console.log(`Tenemos error en la
            verificaicon del numero ${err}
            `)
        })

        return verificationid
}


export const confirmarcodigo = async(verificationid,codigo) => {
    let resultado = false;

    const credenciales = firebase.auth.PhoneAuthProvider.credential(verificationid,codigo)

   await firebase
    .auth()
    .currentUser
    .linkWithCredential(credenciales)
    .then(response => resultado = true)
    .catch(err =>{
        console.log(`error en metodo confirmarcodigo ${err}`)
    })

    return resultado

}



export const obtenerToken = async () => {
    let token = "";
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      //aqui asigna el valor al token 
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }
  
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  };

  export const ObtenerUsuario = () => {
    return firebase.auth().currentUser;
  };
  

  //metodo para agregar registro a la DB
  //recibe el nombre de la coleccion, el documento , y los datos 
  //merge coloca los nuevos datos en firestore en un documento
  export const addRegistroEspecifico = async (coleccion, doc, data) => {
    const resultado = { error: "", statusreponse: false,data: null };
  
    await db
      .collection(coleccion)
      .doc(doc)
      .set(data ,{
        merge: true
      }) 
      .then((response) => {
        resultado.statusreponse = true;
      })
      .catch((err) => {
          resultado.error = err
      });
  
    return resultado;
  };


  //FUNCION QUE SUBIR LA IMAGEN AL STORAGE DE FIREBASE
//va a recibir un array de imagenes y la ruta que es en storage en carpeta de fotos de perfil
  export const subirImagenesBatch = async (imagenes,ruta)=>{

    //para subir imagenes a firebase necesitamos subirlas a formato blob (datos inmutables)
    const imagenesurl = [];

    //para que fluya el resto de la informacion en la aplicacion, sube una imagen y continua la aplicaicon 
    await Promise.all(

    map(imagenes, async(image)=> {
      //convierte ka imagen en formato blob
      const blob = await convertirFicheroBlobl(image);

      //ruta para guardar la imagen en el storage en un lugar unico
      const ref = firebase.storage().ref(ruta).child(uuid())

      //sube la imagena  firebase 
      //y obtenemos la ruta y el nombre uuid unico
      await ref.put(blob)
      .then(async(result)=>{
        await firebase.storage()
        .ref( `${ruta}/${result.metadata.name}`)
        .getDownloadURL()  //metodo que obtiene url de firebase y ponerla en la ruta unica en el array de imagenes
        .then((imagenurl)=>{
          imagenesurl.push(imagenurl)
        })
      })

    }));

    return imagenesurl;

  }

export const actualizarPerfil = async (data)=>{
  let respuesta = false;

  await firebase.auth()
  .currentUser.updateProfile(data)
  .then((response)=>{
    respuesta = true;
  })

  return respuesta
}

export const reautenticar = async (verificationId, code) => {
  let response = { statusresponse: false };

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.reauthenticateWithCredential(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const actualizaremailfirebase = async (email)=>{
  let response = { statusreponse: false}
  await firebase
  .auth()
  .currentUser.updateEmail(email)
  .then((respuesta) => {
    response.statusreponse = true
  })
  .catch((err)=> {
    response.statusreponse = false
  })

  return response;
}

export const actualizarTelefono = async (verificationId, code) => {
  let response = { statusresponse: false };
  console.log(verificationId);
  console.log(code);

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.updatePhoneNumber(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};


