import firebase  from 'firebase/app'


const firebaseConfig = {
    apiKey: "AIzaSyBnLrGpXIV1BBa7kxTIBrXaBhZFqlmCOY0",
    authDomain: "whatsmiofinal.firebaseapp.com",
    projectId: "whatsmiofinal",
    storageBucket: "whatsmiofinal.appspot.com",
    messagingSenderId: "1053125402493",
    appId: "1:1053125402493:web:7119608843647d8b51f614"
  };

 export const firebaseapp =  firebase.initializeApp(firebaseConfig);