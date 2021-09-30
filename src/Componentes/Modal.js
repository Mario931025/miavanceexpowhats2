import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'


export default function Modal(props) {

    const {isVisible,setisVisible,children}= props;

    //funcion para cerrar el modal
    const closeModal = ()=> setisVisible(false)

    return (
       <Overlay
       isVisible={isVisible}
       overlayStyle={styles.overlay}
       onBackdropPress={closeModal}
       >
           {children}
       </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay:{
        height:"auto",
        width:"90%",
        backgroundColor:"#fff"
    }
})
