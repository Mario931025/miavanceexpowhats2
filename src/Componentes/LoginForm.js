import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon, Input, Button, Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { validateEmail } from "../utils/Uitl";
import {cerrarsesion} from '../utils/Acciones'
import { isEmpty } from "lodash";
import Loading from "../Componentes/Loading";
import * as firebase from "firebase";
import * as GoogleSignIn from "expo-google-sign-in";
import * as Facebook from "expo-facebook";

export default function LoginForm(props) {
  const { toastRef } = props;
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [show, setshow] = useState(true);
  const [loading, setloading] = useState(false);
  const navigation = useNavigation();



  const iniciarsesion = () => {
    if (isEmpty(email) || isEmpty(password)) {
      toastRef.current.show("Debe ingresar los valores de email y password");
    } else if (!validateEmail(email)) {
      toastRef.current.show("Ingrese un correo válido");
    } else {
      setloading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          setloading(false);
          toastRef.current.show("Ha iniciado sesión exitosamente");
          console.log(firebase.auth().currentUser);
        })
        .catch((err) => {
          setloading(false);
          toastRef.current.show(
            "Ha ocurrido un error al intentar iniciar sesión"
          );
        });
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          borderBottomColor: "#25D366",
          borderBottomWidth: 2,
          width: 100,
        }}
      />
      <Input
        placeholder="Correo"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#128c7e",
        }}
        leftIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#128c7e",
        }}
        onChangeText={(text) => {
          setemail(text);
        }}
        value={email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        leftIcon={{
          type: "material-community",
          name: "security",
          color: "#128c7e",
        }}
        rightIcon={{
          type: "material-community",
          name: show ? "eye-outline" : "eye-off-outline",
          color: "#128c7e",
          onPress: () => setshow(!show),
        }}
        onChangeText={(text) => {
          setpassword(text);
        }}
        secureTextEntry={show}
        value={password}
      />
      <Button
        title="ENTRAR"
        containerStyle={styles.btnentrar}
        buttonStyle={{ backgroundColor: "#25d366" }}
        onPress={() => iniciarsesion()}
      />
      <Text style={styles.txtcrearcuenta}>
        ¿No Tienes Cuenta ?
        <Text
          style={styles.cuenta}
          onPress={() => navigation.navigate("register")}
        >
          {" "}
          Crear Cuenta
        </Text>
      </Text>

      <Divider
        style={{
          backgroundColor: "#128C7E",
          height: 1,
          width: "90%",
          marginTop: 20,
        }}
      />
      <Text style={styles.txto}>O</Text>

      <View style={styles.btnlogin}>
        <TouchableOpacity style={styles.btnloginsocial}>
          <Icon
            size={24}
            type="material-community"
            name="google"
            color="#fff"
            backgroundColor="transparent"
            onPress={() => signInAsync()}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnloginsocial} onPress={() => logIn()}>
          <Icon
            size={24}
            type="material-community"
            name="facebook"
            color="#fff"
            backgroundColor="transparent"
          />
        </TouchableOpacity>
      </View>
      <Loading isVisible={loading} text="Favor Espere" />
    </View>
  );
  /*********LOGICA DE GOOGLE***********************************/

  async function signInAsync() {
    try {
      await GoogleSignIn.initAsync();
      //const usuario = await GoogleSignIn.signInSilentlyAsync();
      await GoogleSignIn.askForPlayServicesAsync(); //usar solo en android
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        onSignIn(user);
        setloading(false);
        return true;
      } else {
        setloading(false);
        alert(JSON.stringify(result));
        return { cancelled: true };
      }
    } catch (e) {
      setloading(false);

      alert(e.message);

      return { error: true };
    }
  }

  function onSignIn(googleUser) {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.auth.idToken,
            googleUser.auth.accessToken
          );
          // Sign in with credential from the Google user.
          setloading(true);
          firebase
            .auth()
            .signInWithCredential(credential)
            .then((response) => {
              setloading(false);
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              alert(errorMessage);
              setloading(false);
              // ...
            });
        } else {
          alert("Usuario ya está logueado");
        }
      });
  }

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }
  /**************************** FINAL GOOGLE **************************************** */

  /****************************FACEBOOK ********************************************** */
  async function logIn() {
    try {
      await Facebook.initializeAsync({
        appId: "1560987580775767",
        appName: "omarcito",
        domain: "connect.facebook.net",
      });
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch((error) => {
            console.log(JSON.stringify(error));
            alert(error.message);
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F6F8",
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
    paddingTop: 20,
  },
  input: {
    width: "90%",
    marginTop: 20,
    height: 50,
  },
  btnentrar: {
    width: "90%",
    marginTop: 20,
  },
  txtcrearcuenta: {
    marginTop: 20,
  },
  cuenta: {
    color: "#128c7e",
    fontFamily: "Roboto",
    fontSize: 15,
  },
  txto: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    color: "#128c7e",
  },
  btnlogin: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  btnloginsocial: {
    backgroundColor: "#25d366",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
