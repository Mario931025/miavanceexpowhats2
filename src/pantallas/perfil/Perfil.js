import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Icon, Avatar, Input } from "react-native-elements";
import { cargarImagenesxAspecto,validateEmail } from "../../utils/Uitl";
import {
  subirImagenesBatch,
  ObtenerUsuario,
  addRegistroEspecifico,
  actualizarPerfil,
  enviarAutentificacionphone,
  reautenticar,
  actualizaremailfirebase,
  actualizarTelefono,
} from "../../utils/Acciones";
import Loading from "../../Componentes/Loading";
import InputEditable from "../../Componentes/InputEditable";
import Modal from "../../Componentes/Modal";
import CodeInput from "react-native-code-input";
import FirebaseRecapcha from "../../utils/FirebaseRecapcha";


export default function Perfil() {
  const [imagenperfil, setimagenperfil] = useState("");
  const [loading, setloading] = useState(false);
  const usuario = ObtenerUsuario();
  const [displayName, setdisplayName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [email, setemail] = useState("");

  const [editablename, seteditablename] = useState(false);
  const [editableemail, seteditableemail] = useState(false);
  const [editablephone, seteditablephone] = useState(false);

  const [verificationid, setverificationid] = useState("");
  const [isVisible, setisVisible] = useState(false);
  const [updatephone, setupdatephone] = useState(false);

  const recapcha = useRef();

  useEffect(() => {
    setimagenperfil(usuario.photoURL);
    const { displayName, phoneNumber, email } = usuario;
    setdisplayName(displayName);
    setphoneNumber(phoneNumber);
    setemail(email);
  }, []);

  const onChangeInput = (input, valor) => {
    switch (input) {
      case "displayName":
        setdisplayName(valor);
        break;
      case "email":
        setemail(valor);
        break;
      case "phoneNumber":
        setphoneNumber(valor);
        break;
    }
  };

  const obtenerValor = (input) => {
    switch (input) {
      case "displayName":
        return displayName;
      case "email":
        return email;
      case "phoneNumber":
        return phoneNumber;
    }
  };

  const actualizarValor = async (input, valor) => {
    switch (input) {
      case "displayName":
        addRegistroEspecifico("Usuarios", usuario.uid, { displayName: valor });

        break;
      case "email":
        if (valor !== usuario.email) {
          if (validateEmail(valor)) {
            const verification = await  enviarAutentificacionphone(
              phoneNumber,
              recapcha
            );
            if (verification) {
              setverificationid(verification);
              setisVisible(true);
            } else {
              alert("Ha ocurrido un error en la verificaci??n");
              setemail(usuario.email);
            }
          }
        }
        break;
      case "phoneNumber":
        if (valor !== usuario.phoneNumber) {
          const verification = await enviarAutentificacionphone(
            phoneNumber,
            recapcha
          );

          if (verification) {
            setverificationid(verification);
            setupdatephone(true);
            setisVisible(true);
          } else {
            alert("Ha ocurrido un error en la verificaci??n");
            setphoneNumber(usuario.phoneNumber);
          }
        }
        break;
    }
  };

  const ConfirmarCodigo = async (verificationid, code) => {
    setloading(true);
    if (updatephone) {
      const telefono = await actualizarTelefono(verificationid, code);
      const updateregistro = await addRegistroEspecifico(
        "Usuarios",
        usuario.uid,
        { phoneNumber: phoneNumber }
      );
      setupdatephone(false);
     // console.log(telefono);
     // console.log(updateregistro);
    } else {
      const resultado = await reautenticar(verificationid, code);
      console.log(resultado);

      if (resultado.statusresponse) {
        const emailresponse = await actualizaremailfirebase(email);
        const updateregistro = await addRegistroEspecifico(
          "Usuarios",
          usuario.uid,
          { email: email }
        );
       // console.log(emailresponse);
       // console.log(updateregistro);
      } else {
        alert("Ha ocurrido un error al actualizar el correo");
        setloading(false);
        setisVisible(false);
      }
    }
    setloading(false);
    setisVisible(false);
  };
  ObtenerUsuario();
  return (
    <View>
      <StatusBar backgroundColor="#128c7e" />
      <CabeceraBG nombre={displayName} />
      <HeaderAvatar
        usuario={usuario}
        imagenperfil={imagenperfil}
        setimagenperfil={setimagenperfil}
        setloading={setloading}
      />
      <FormDatos
        onChangeInput={onChangeInput}
        obtenerValor={obtenerValor}
        editableemail={editableemail}
        editablephone={editablephone}
        editablename={editablename}
        seteditableemail={seteditableemail}
        seteditablephone={seteditablephone}
        seteditablename={seteditablename}
        actualizarValor={actualizarValor}
      />

      <ModalVerification
        isVisibleModal={isVisible}
        setisVisibleModal={setisVisible}
        verificationid={verificationid}
        ConfirmarCodigo={ConfirmarCodigo}
      />
      <FirebaseRecapcha referencia={recapcha} />
      <Loading isVisible={loading} text="Favor espere" />
    </View>
  );
}

function CabeceraBG(props) {
  const { nombre } = props;
  return (
    <View>
      <View style={styles.bg}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {nombre}
        </Text>
      </View>
    </View>
  );
}

function HeaderAvatar(props) {
  const { usuario, setimagenperfil, imagenperfil, setloading } = props;
  const { uid } = usuario;

  const cambiarfoto = async () => {
    const resultado = await cargarImagenesxAspecto([1, 1]);

    if (resultado.status) {
      setloading(true);
      const url = await subirImagenesBatch([resultado.imagen], "Perfil");
      const update = await actualizarPerfil({ photoURL: url[0] });
      const response = await addRegistroEspecifico("Usuarios", uid, {
        photoURL: url[0],
      });

      if (response.statusresponse) {
        setimagenperfil(url[0]);
        setloading(false);
      } else {
        setloading(false);
        alert("Ha ocurrido un error al actualizar la foto de perfil");
      }
    }
  };
  return (
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
  );
}

function FormDatos(props) {
  const {
    onChangeInput,
    obtenerValor,
    editableemail,
    editablename,
    editablephone,
    seteditableemail,
    seteditablename,
    seteditablephone,
    actualizarValor,
  } = props;
  return (
    <View>
      <InputEditable
        id="displayName"
        label="Nombre"
        obtenerValor={obtenerValor}
        placeholder="Nombre"
        onChangeInput={onChangeInput}
        editable={editablename}
        seteditable={seteditablename}
        actualizarValor={actualizarValor}
      />
      <InputEditable
        id="email"
        label="Correo"
        obtenerValor={obtenerValor}
        placeholder="ejemplo@ejemplo.com"
        onChangeInput={onChangeInput}
        editable={editableemail}
        seteditable={seteditableemail}
        actualizarValor={actualizarValor}
      />
      <InputEditable
        id="phoneNumber"
        label="Tel??fono"
        obtenerValor={obtenerValor}
        placeholder="+00000000"
        onChangeInput={onChangeInput}
        editable={editablephone}
        seteditable={seteditablephone}
        actualizarValor={actualizarValor}
      />
    </View>
  );
}

function ModalVerification(props) {
  const {
    isVisibleModal,
    setisVisibleModal,
    ConfirmarCodigo,
    verificationid,
  } = props;

  return (
    <Modal isVisible={isVisibleModal} setIsVisible={setisVisibleModal}>
      <View style={styles.confirmacion}>
        <Text style={styles.titulomodal}>Confirmar C??digo</Text>
        <Text style={styles.detalle}>
          Se ha enviado un c??digo de verificaci??n a su n??mero de tel??fono
        </Text>

        <CodeInput
          secureTextEntry
          activeColor="#128c7e"
          inactiveColor="#128c7e"
          autoFocus={false}
          inputPosition="center"
          size={40}
          containerStyle={{ marginTop: 30 }}
          codeInputStyle={{ borderWidth: 1.5 }}
          codeLength={6}
          onFulfill={(code) => {
            ConfirmarCodigo(verificationid, code);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    backgroundColor: "#128C7E",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarinline: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -70,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  confirmacion: {
    height: 200,
    width: "100%",
    alignItems: "center",
  },
  titulomodal: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  detalle: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
});
