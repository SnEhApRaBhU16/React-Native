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
import ReactNativeBiometrics from "react-native-biometrics";
import { getNewIdToken } from "../getNewIdToken";
import { getFontFamily } from "../../utils/fontFamily";
import RNPickerSelect from "react-native-picker-select";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { saveUserToFirestore } from "../../utils/auth";
  
const rnBiometrics = new ReactNativeBiometrics();


const AuthForm = ({ isLogin, onSubmit, credentialsInvalid }:{isLogin:boolean,
    onSubmit:(params:{
        email: string,
        password: string,
        firstName?:string,
        lastName?:string,
        phoneNumber?:string,
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
    const [selectedCode, setSelectedCode] = useState("+91");

    const countryCodes = [
        { label: "🇮🇳\t\t\t\t+91", value: "+91" },
        { label: "🇺🇸\t\t\t\t+1", value: "+1" },
        { label: "🇬🇧\t\t\t\t+44", value: "+44" },
        { label: "🇦🇺\t\t\t\t+61", value: "+61" },
        { label: "🇨🇦\t\t\t\t+1 ", value: "+1_CA" },
        { label: "🇩🇪\t\t\t\t+49", value: "+49" },
        { label: "🇫🇷\t\t\t\t+33", value: "+33" },
        { label: "🇧🇷\t\t\t\t+55", value: "+55" },
        { label: "🇯🇵\t\t\t\t+81", value: "+81" },
        { label: "🇸🇬\t\t\t\t+65", value: "+65" },
    ];
    // Configure Google Sign-In
    GoogleSignin.configure({
        webClientId: "200900970119-139o5oojr3p268oevdhtb07qt88pi5mr.apps.googleusercontent.com",
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
        setIsAuthenticating(true);
        const payload = "LoginRequest-" + Date.now();
    
        try {
            const { success } = await rnBiometrics.createSignature({
                promptMessage: "Authenticate with Biometrics",
                payload,
            });
    
            console.log("Biometric success:", success);
    
            if (success) {
    
                const refreshToken = await AsyncStorage.getItem("refreshToken");
    
                if (refreshToken) {
                    const newIdToken = await getNewIdToken(refreshToken);
                    if (newIdToken) {
                        await AsyncStorage.setItem("token", newIdToken);
                        authCtx.authenticate(newIdToken);
                        Alert.alert("Biometric Login Successful!");
                    } else {
                        Alert.alert("Session expired. Please log in manually.");
                        setRefreshToken("");
                    } 
                } else {
                    Alert.alert("No stored session found. Please log in manually.");
                    setRefreshToken("");
                }
            } else {
                Alert.alert("Biometric authentication failed.");
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("refreshToken");
                setRefreshToken("");
                
            }
        } catch (err) {
            console.error("Biometric error:", err);
            Alert.alert("Biometric authentication error.");
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("refreshToken");
            setRefreshToken("");
        }
    
        setIsAuthenticating(false);
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
            await saveUserToFirestore(userCredential.user.uid, userCredential.user.email??"", userCredential.user.displayName??"", lastName??"", userCredential.user.phoneNumber??"");
            
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
        case "phoneNumber":{
            setPhoneNumber(enteredValue);
            break;
        }
        }
    }

    async function submitHandler() {
        setIsAuthenticating(true);
        onSubmit({
            email: enteredEmail,
            password: enteredPassword,
            firstName,
            lastName,
            phoneNumber:selectedCode+" "+phoneNumber,
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
    console.log("getFontFamil:",getFontFamily(true, "bold"));
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >
                    <View>

                        <View>
                            {/* Show only biometric login if biometrics are available and it's login mode */}
                            { isLogin && refreshToken &&isBiometricAvailable? (
                                <Button disabled={!isBiometricAvailable} onPress={handleBiometricLogin}>Login with Biometrics</Button>
                            ):(
                                <>
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
                                            <View style={styles.inputRow}>
                                                <View style={styles.dropdown}>
                                                    <Text style={{color:"black",marginBottom:3}}>Country Code</Text>
                                                    <RNPickerSelect
                                                        onValueChange={(value) => setSelectedCode(value)}
                                                        items={countryCodes}
                                                        value={selectedCode}
                                                        placeholder={{}}
                                                        style={pickerSelectStyles}
                                                        useNativeAndroidPickerStyle={false}
                                                    />
                                                </View>
                                                <View style={styles.input}>
                                                    <Input
                                                        label="Phone Number"
                                                        onUpdateValue={updateInputValueHandler.bind(this, "phoneNumber")}
                                                        value={phoneNumber}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            </View>
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
                                            <Text style={{fontFamily: getFontFamily(true, "medium"),color:"black"}}>Sign in with Google</Text>
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
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },

    textInput: {
        flex: 1,
        fontSize: 16,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        margin: 0,
        padding: 0,
    },
    dropdown: {
        flex: 1,
        marginTop:-10,
        marginRight: 8,
    },
    input: {
        flex: 2,
    },
});

const pickerSelectStyles = {
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        color: "black",
        backgroundColor: "#fff",
    },
};