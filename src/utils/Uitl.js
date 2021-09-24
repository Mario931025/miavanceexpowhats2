import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export function validateEmail(email) {
    console.log(email)
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    export const cargarImagenesxAspecto = async (array) => {
      //objeto de resultado
      let imgResponse = { status: false, imagen: "" };
      
      const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const cameraPermissions = resultPermissions.permissions.cameraRoll.status;
    
      if (cameraPermissions === "denied") {
        alert("Usted debe permitir el accesos para cargar las imagenes");
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: array,
        });
    
        if (!result.cancelled) {
          imgResponse = { status: true, imagen: result.uri };
        }
      }
      return imgResponse;
    };
