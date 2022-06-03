// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApWp9-MkOaj_Dr6oxYnbOAI1nM2u-sup4",
  authDomain: "ohh-interactive.firebaseapp.com",
  projectId: "ohh-interactive",
  storageBucket: "ohh-interactive.appspot.com",
  messagingSenderId: "123324366485",
  appId: "1:123324366485:web:c59f6959c3641c944be59c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let socket = io();

const createUser = document.getElementById('createUser');

import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

async function addParticipant(db, participant) {
    try {
        await addDoc(collection(db, "participants"),participant);
        console.log("Product added! :)");
    } catch(e) {
        console.log(e);
    }
    
}

let timeplay;
let isWin;
let isRedeem;

socket.on('result', (result) =>{
    timeplay = result.timeplay;
    isWin = result.isWin;
    isRedeem = result.isRedeem;
})


createUser.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = createUser.email.value;
    const age = createUser.age.value;
    const gender = createUser.gender.value;
    const levelSatisfaction = document.querySelector('input[name="levelSatisfaction"]:checked').value;
    const levelAtractive = document.querySelector('input[name="levelAtractive"]:checked').value;

    const newUser = {
        email,
        age,
        gender,
        levelSatisfaction,
        levelAtractive,
        IDCoupon: uuidv4(),
        timeplay: timeplay,
        isWin: isWin,
        isRedeem: isRedeem,
        createAt: {nanoseconds: 0,seconds: Date.now()}
    }

    await addParticipant(db, newUser);
})