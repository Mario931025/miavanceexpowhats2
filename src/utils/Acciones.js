//para interacciones

import { firebaseapp } from "./Firebase";
import { Platform } from "react-native";
import * as firebase from 'firebase'
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import 'firebase/firestore';


//para que se conecte a la BD

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

  export const addRegistroEspecifico = async (coleccion, doc, data) => {
    const resultado = { error: "", statusreponse: false,data: null };
  
    await db
      .collection(coleccion)
      .doc(doc)
      .set(data)
      .then((response) => {
        resultado.statusreponse = true;
      })
      .catch((err) => {
          resultado.error = err
      });
  
    return resultado;
  };
