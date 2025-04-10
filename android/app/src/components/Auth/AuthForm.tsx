import { useContext, useEffect, useState } from "react";
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
import ThemedText from "../../ui/ThemedText";
import ReactNativeBiometrics from "react-native-biometrics";
import { getNewIdToken } from "../getNewIdToken";
import Config from "react-native-config";
import { getFontFamily } from "../../utils/fontFamily";
const rnBiometrics = new ReactNativeBiometrics();


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
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [refreshToken,setRefreshToken] = useState("");
    // Configure Google Sign-In
    GoogleSignin.configure({
        webClientId: Config.API_WEB_CLIENT_ID,
        offlineAccess: true, // Required for Firebase Auth
    });
    useEffect(() => {
        checkBiometricSupport();
        const getRefreshToken = async () => {
            const token = await AsyncStorage.getItem("refreshToken");
            if (token) {
                setRefreshToken(token);
            }
        };
        getRefreshToken();

    }, []);

    const checkBiometricSupport = async () => {
        const { available } = await rnBiometrics.isSensorAvailable();
        setIsBiometricAvailable(available);
    };
    const handleBiometricLogin = async () => {
        const currentUser = auth.currentUser;
        setIsAuthenticating(true);
        const payload = "LoginRequest-" + Date.now(); // Example challenge (timestamp or random from backend)
        const { success } = await rnBiometrics.createSignature({
            promptMessage: "Authenticate with Biometrics",
            payload,

        });
        if (success) {
            const refreshToken = await AsyncStorage.getItem("refreshToken");

            if (refreshToken) {
                // Use refresh token to get a new ID token
                const newIdToken = await getNewIdToken(refreshToken);
                if (newIdToken) {
                    await AsyncStorage.setItem("token", newIdToken);
                    authCtx.authenticate(newIdToken);
                    Alert.alert("Biometric Login Successful!");
                } else {
                    Alert.alert("Session expired. Please log in manually.");
                }
            } else {
                Alert.alert("No stored session found. Please log in manually first.");
            }
            setIsAuthenticating(false);
        } else {
            Alert.alert("Biometric authentication failed.");
            setIsAuthenticating(false);
        }
    };
    
    
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
            const refreshToken = await userCredential.user?.refreshToken;
            const userData = {
                token,
                displayName: userCredential.user?.displayName || "",
                email: userCredential.user?.email || "",
                photoURL: userCredential.user?.photoURL || "",
            };
            // Persist token and user data
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
            await AsyncStorage.setItem("refreshToken", refreshToken || "");
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

    async function submitHandler() {
        setIsAuthenticating(true);
        onSubmit({
            email: enteredEmail,
            password: enteredPassword,
            firstName,
            lastName,
            phoneNumber,
        });
        const existingKey = await AsyncStorage.getItem("biometricKey");
        if (!existingKey) {
            const { publicKey } = await rnBiometrics.createKeys();
            await AsyncStorage.setItem("biometricKey", publicKey);
        }
        setIsAuthenticating(false);
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
                {/* Show only biometric login if biometrics are available and it's login mode */}
                { (
                    <>
                        <Text style={styles.Text}>welcome</Text>
                        {!isLogin && (
                            <View>
                                <Input
                                    label="First Name"
                                    onUpdateValue={updateInputValueHandler.bind(this, "firstName")}
                                    value={firstName}
                                    keyboardType="default"
                                />
                                <Input
                                    label="Last Name"
                                    onUpdateValue={updateInputValueHandler.bind(this, "lastName")}
                                    value={lastName}
                                    keyboardType="default"
                                />
                                <Input
                                    label="Phone Number"
                                    onUpdateValue={updateInputValueHandler.bind(this, "phoneNumber")}
                                    value={phoneNumber}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}
                        <Input
                            label="Email Address"
                            onUpdateValue={updateInputValueHandler.bind(this, "email")}
                            value={enteredEmail}
                            keyboardType="email-address"
                            isInvalid={credentialsInvalid.email}
                        />
                        <Input
                            label="Password"
                            onUpdateValue={updateInputValueHandler.bind(this, "password")}
                            secure={!showPassword}
                            value={enteredPassword}
                            isInvalid={credentialsInvalid.password}
                        />

                        {/* Show Password Checkbox */}
                        <TouchableOpacity
                            onPress={() => setShowPassword((prev) => !prev)}
                            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
                        >
                            <View
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderWidth: 1,
                                    borderColor: "#333",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 8,
                                }}
                            >
                                {showPassword && <Text style={{ fontSize: 16 }}>✔</Text>}
                            </View>
                            <Text style={styles.Text}>Show Password</Text>
                        </TouchableOpacity>

                        <View style={styles.registerButton}>
                            <Button onPress={submitHandler}>{isLogin ? "Log In" : "Sign Up"}</Button>
                        </View>

                        {!isLogin && (
                            <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
                                <ThemedText style={{fontFamily: getFontFamily(true, "bold"),color:"black"}}>Sign in with Google</ThemedText>
                            </TouchableOpacity>
                        )}

                        <View style={styles.button}>
                            <FlatButton onPress={switchAuthModeHandler}>
                                {isLogin ? "Create a new user" : "Log in instead"}
                            </FlatButton>
                        </View>
                    </>
                )}

            </View>
        </View>

    );
};

export default AuthForm;

const styles = StyleSheet.create({
    registerButton: {
        width: "100%",
        marginTop: 13,
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
    Text: {
        fontSize: 14,
        color: "#000",
    },
    button: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#3399ff"
    },
});
