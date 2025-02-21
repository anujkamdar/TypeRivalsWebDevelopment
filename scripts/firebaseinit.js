import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { getDatabase, ref, set, get, push, onValue } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';
import { getVertexAI, getGenerativeModel } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-vertexai.js'





const firebaseConfig = {
  apiKey: "AIzaSyDsTHcC-JXEP_D7filkBMc-WWChXvfZmIg",
  authDomain: "typerivals-f78e6.firebaseapp.com",
  projectId: "typerivals-f78e6",
  storageBucket: "typerivals-f78e6.firebasestorage.app",
  messagingSenderId: "579460545509",
  appId: "1:579460545509:web:02084e0b7dccc072160d0c"
};
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const vertexAI = getVertexAI(app);
const model = getGenerativeModel(vertexAI, {model: "gemini-1.5-flash"});




export{
    app,
    auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,signOut,
    db,getDatabase,ref,set,get,push,onValue,
    vertexAI,getVertexAI,getGenerativeModel,model
}

