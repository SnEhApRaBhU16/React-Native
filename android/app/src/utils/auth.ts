
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";




export const createUser = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
): Promise<string> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    if (user) {
        await saveUserToFirestore(user.uid, email, firstName??"", lastName??"", phoneNumber??"");
    }
  
    const token = await user.getIdToken();
    await AsyncStorage.setItem("refreshToken", user.refreshToken);
    await AsyncStorage.setItem("token", token);
    return token;
};
  

export const login = async (email: string, password: string): Promise<string> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    const token = await user.getIdToken();
    await AsyncStorage.setItem("refreshToken", user.refreshToken);
    await AsyncStorage.setItem("token", token);

    return token;
};



export const saveUserToFirestore = async (
    uid: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        uid,
        email,
        firstName,
        lastName,
        phoneNumber,
        createdAt: new Date(),
    });
};

