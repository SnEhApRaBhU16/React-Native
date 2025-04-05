import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_KEY = "AIzaSyAN9G143Zg0FcekZjXmNYaLEVTaDfRmFxA";


async function authenticate(mode:"signUp"|"signInWithPassword",email:string,password:string){
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
    const response = await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true
    });
    const token  = response.data.idToken;
    const refreshToken = await response.data?.refreshToken;
    await AsyncStorage.setItem("refreshToken", refreshToken || "");
    console.log("refresss",refreshToken);
    return token;
}
export async function createUser (email:string,password:string) {
    return authenticate("signUp", email, password);
}

export async function login (email:string, password:string) {
    return authenticate("signInWithPassword", email, password);
}   
