import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  enableNetwork,
  disableNetwork
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

let isInitialized = false;
let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;
const googleProvider = new GoogleAuthProvider();

export async function setupFirebase() {
  if (isInitialized) {
    return { auth: firebaseAuth, db: firebaseDb };
  }

  try {
    const config = firebaseConfig;
    
    if (getApps().length === 0) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }

    firebaseAuth = getAuth(firebaseApp);
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)") {
      firebaseDb = getFirestore(firebaseApp, config.firestoreDatabaseId);
    } else {
      firebaseDb = getFirestore(firebaseApp);
    }
    isInitialized = true;
    
    console.log("Firebase successfully initialized on client (statically compiled config).");
    return { auth: firebaseAuth, db: firebaseDb };
  } catch (error) {
    console.error("Firebase initialization failed statically:", error);
    throw error;
  }
}

export function getFirebaseAuth() {
  if (!firebaseAuth) {
    throw new Error("Firebase Auth has not been initialized. Call setupFirebase() first.");
  }
  return firebaseAuth;
}

export function getFirebaseDb() {
  if (!firebaseDb) {
    throw new Error("Firebase Firestore has not been initialized. Call setupFirebase() first.");
  }
  return firebaseDb;
}

export { googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
export type { FirebaseUser };
