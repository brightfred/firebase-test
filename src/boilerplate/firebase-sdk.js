//TODO - import the function from the Firebase SDKs.
import{ initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"
//TODO - Add SDKs for firebase products that you want to use

//NOTE - Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAVqOoZcAK7pB-kTOD6lZ0YXrp4V0PLtyw",
    authDomain: "fir-test-59b32.firebaseapp.com",
    projectId: "fir-test-59b32",
    storageBucket: "fir-test-59b32.appspot.com",
    messagingSenderId: "264938078471",
    appId: "1:264938078471:web:041087579f123b07a7c5a2"
    // measurementId:""
  };


//TODO - Initialize Firebase

const app = initializeApp(firebaseConfig);