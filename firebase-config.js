const firebaseConfig = {
  apiKey: "AIzaSyB05QZtH6NwKnALc6nJjItIMvdFh7l2fJI",
  authDomain: "mindsync-cc3c2.firebaseapp.com",
  projectId: "mindsync-cc3c2",
  storageBucket: "mindsync-cc3c2.firebasestorage.app",
  messagingSenderId: "1010342912964",
  appId: "1:1010342912964:web:cafa8698627cd008adba91",
  measurementId: "G-6RCCNX1VRY"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
