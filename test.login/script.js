
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase configuration

    const firebaseConfig = {
        apiKey: "AIzaSyDY4h_HW_hUIsVEk6pBsI1BCxaF2CNQJ4k",
        authDomain: "login-test-6d27a.firebaseapp.com",
        projectId: "login-test-6d27a",
        storageBucket: "login-test-6d27a.appspot.com",
        messagingSenderId: "150460692552",
        appId: "1:150460692552:web:3b34c9318a8e9f9fb1807d"
    
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Handle Registration
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registered as:", userCredential.user.email);
        alert("Account created successfully!");

        // Optionally, store user data in Firestore
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
            email: userCredential.user.email,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error during registration:", error.message);
        alert("Error during registration: " + error.message);
    }
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in as:", userCredential.user.email);
        alert("Logged in successfully!");

        // Store login timestamp in Firestore
        await setDoc(doc(firestore, "user_logins", userCredential.user.uid), {
            email: userCredential.user.email,
            lastLogin: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error during login:", error.message);
        alert("Error during login: " + error.message);
    }
});