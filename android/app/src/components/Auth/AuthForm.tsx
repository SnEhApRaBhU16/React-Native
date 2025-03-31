import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Button from "../../ui/Button";
import Input from "./Input";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import {app} from "../../config/firebaseConfig";
import { AuthContext } from "../../store/slices/auth-context";
import LoadingOverlay from "../../ui/LoadingOverlay";
import FlatButton from "../../ui/FlatButton";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";



const AuthForm = ({ isLogin, onSubmit, credentialsInvalid }:{isLogin:boolean,
    onSubmit:(params:{
        email: string,
        password: string,
        firstName:string,
        lastName:string,
        phoneNumber:string,
})=>void,
    credentialsInvalid:{email:boolean,password:boolean}}) => {
    const [enteredEmail, setEnteredEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [enteredPassword, setEnteredPassword] = useState<string>("");
    const authCtx = useContext(AuthContext);
    const [isAuthenticating,setIsAuthenticating] = useState(false);

    // Configure Google Sign-In
    GoogleSignin.configure({
        webClientId: "200900970119-139o5oojr3p268oevdhtb07qt88pi5mr.apps.googleusercontent.com",
        offlineAccess: true, // Required for Firebase Auth
    });

    const auth = getAuth(app);
    const navigation = useNavigation();

    async function googleSignIn() {
        setIsAuthenticating(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const result = userInfo;

            const googleCredential = GoogleAuthProvider.credential(result.data?.idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const token = await userCredential.user?.getIdToken();
            const userData = {
                token,
                displayName: userCredential.user?.displayName || "",
                email: userCredential.user?.email || "",
                photoURL: userCredential.user?.photoURL || "",
            };
            // Persist token and user data
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
            // Update context
            authCtx.authenticate(token);
            authCtx.setUserData(userData.displayName, userData.email, userData.photoURL);

        } catch (error) {
            Alert.alert(
                "Authentication failed!",
                "Could not sign you up. Please check your input or try again later!" 
            );
            console.error("error",error);
        }finally{
            setIsAuthenticating(false);
        }
    }

    function updateInputValueHandler(inputType: string, enteredValue: string) {
        switch (inputType) {
        case "email":
            setEnteredEmail(enteredValue);
            break;
        case "firstName":
            setFirstName(enteredValue);
            break;
        case "password":
            setEnteredPassword(enteredValue);
            break;
        case "lastName":
            setLastName(enteredValue);
            break;
        case "phoneNumber":
            setPhoneNumber(enteredValue);
            break;
        }
    }

    function submitHandler() {
        onSubmit({
            email: enteredEmail,
            password: enteredPassword,
            firstName,
            lastName,
            phoneNumber,
        });
    }
    function switchAuthModeHandler() {
        if(isLogin){
            navigation.navigate("Signup" as never);
        }else{
            navigation.navigate("Login" as never);
        }
    }
    if(isAuthenticating) {
        return <LoadingOverlay message="Logging in..."/>;
    }
    return (
        <View>
            <View>
                {!isLogin && (
                    <View>
                        <Input label="First Name" onUpdateValue={updateInputValueHandler.bind(this, "firstName")} value={firstName} keyboardType="default" />
                        <Input label="Last Name" onUpdateValue={updateInputValueHandler.bind(this, "lastName")} value={lastName} keyboardType="default" />
                        <Input label="Phone Number" onUpdateValue={updateInputValueHandler.bind(this, "phoneNumber")} value={phoneNumber} keyboardType="numeric" />
                    </View>
                )}
                <Input label="Email Address" onUpdateValue={updateInputValueHandler.bind(this, "email")} value={enteredEmail} keyboardType="email-address" isInvalid={credentialsInvalid.email} />
                <Input label="Password" onUpdateValue={updateInputValueHandler.bind(this, "password")} secure value={enteredPassword} isInvalid={credentialsInvalid.password} />
        
                <View style={styles.registerButton}>
                    <Button onPress={submitHandler}>{isLogin ? "Log In" : "Sign Up"}</Button>
                </View>

                {!isLogin && (
                    <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
                        <Text style={styles.googleText}>Sign in with Google</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.button}>
                    <FlatButton onPress={switchAuthModeHandler}>
                        {isLogin ? "Create a new user" : "Log in instead"}
                    </FlatButton>
                </View>
            </View>
        </View>
    );
};

export default AuthForm;

const styles = StyleSheet.create({
    registerButton: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#6200ea",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        justifyContent: "center",
    },
    googleText: {
        fontSize: 16,
        color: "#000",
    },
    button: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#3399ff"
    },
});
