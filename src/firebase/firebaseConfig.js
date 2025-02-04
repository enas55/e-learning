// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqZPgD51VXfB9JPrQhGL6bYZo4smYgig4",
    authDomain: "e-learning-83415.firebaseapp.com",
    projectId: "e-learning-83415",
    storageBucket: "e-learning-83415.firebasestorage.app",
    messagingSenderId: "314653804228",
    appId: "1:314653804228:web:316edc526c64a2ae59eb91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);




// useEffect(() => {
//         const auth = getAuth();
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUserId(user.uid);
//                 loadFavorites(user.uid);
//             } else {
//                 setUserId(null);
//             }
//         });

//         return () => unsubscribe();
//     });

