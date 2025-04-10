
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";




export const createUser = async (email: string, password: string): Promise<string> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    if (user) {
        await saveUserToFirestore(user.uid, user.email ?? "");
    }
    const token = await user.getIdToken();
    await AsyncStorage.setItem("refreshToken", user.refreshToken);
    await AsyncStorage.setItem("token", token);
    return token;
};

export const login = async (email: string, password: string): Promise<string> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    console.log("✅ Logged in user:", user.email, user.uid);
    const token = await user.getIdToken();
    await AsyncStorage.setItem("refreshToken", user.refreshToken);
    await AsyncStorage.setItem("token", token);

    return token;
};



export const saveUserToFirestore = async (uid: string, email: string) => {
    try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
  
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                uid,
                email,
                createdAt: new Date(),
            });
            console.log("✅ User saved to Firestore");
        } else {
            console.log("👤 User already exists in Firestore");
        }
    } catch (err) {
        console.error("🔥 Error saving user:", err);
        throw err;
    }
};

