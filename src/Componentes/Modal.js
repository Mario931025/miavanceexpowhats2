import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'


export default function Modal(props) {

    const {isVisible,setIsVisible,children}= props;

    //funcion para cerrar el modal
    const closeModal = ()=> setIsVisible(false)

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
