import React, { useState, useRef, useContext, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Text } from "react-native";
import { AuthContext } from "../store/slices/auth-context";
import { login } from "../utils/auth";
import LoadingOverlay from "../ui/LoadingOverlay";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/MainStackNavigator";
import ThemedText from "../ui/ThemedText";

const RESEND_OTP_TIME = 30; // 30 seconds cooldown

type OtpScreenRouteProp = RouteProp<AuthStackParamList, "OTP">;

function OtpScreen() {
    const route = useRoute<OtpScreenRouteProp>();
    const { email, password } = route.params;
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [timer, setTimer] = useState(RESEND_OTP_TIME);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const authCtx = useContext(AuthContext);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];
    const correctOtp = "1234"; // Dummy OTP for now

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isResendDisabled) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResendDisabled]);

    const handleChange = (text: string, index: number) => {
        console.log("textt",text);
        if (text.length > 1) {
            const chars = text.split("").slice(0, 4);

            chars.forEach((char, i) => {
                inputRefs[i]?.current?.setNativeProps({ text: char });

            });

            setOtp((prev) => {
                const updated = [...prev];
                chars.forEach((char, i) => {
                    updated[i] = char;
                });
                return updated;
            });

            // Blur the last input
            setTimeout(() => {
                inputRefs.forEach(ref => ref.current?.blur());
            }, 100);            
            return;
        }

        const updatedOtp = [...otp];
        updatedOtp[index] = text;
        setOtp(updatedOtp);
        // ✅ Always move to next input if text is entered
        if (text && index < 3) {
            console.log("innn");
            inputRefs[index + 1]?.current?.focus();
        }
    };

    const handleVerify = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Missing authentication details.");
            return;
        }
        if (otp.join("") === correctOtp) {
            Alert.alert("Success", "OTP Verified!");
            setIsAuthenticating(true);
            try {
                const token = await login(email, password);
                authCtx.authenticate(token);
                
            } catch (error) {
                Alert.alert(
                    "Authentication failed!",
                    "Could not log you in. Please check your credentials or try again later!"
                );
                console.error(error);
            } finally {
                setIsAuthenticating(false);
            }
        } else {
            Alert.alert("Error", "Invalid OTP. Try again.");
        }
    };

    const handleResendOtp = () => {
        if (isResendDisabled) return;
        Alert.alert("OTP Resent", "A new OTP has been sent.");
        setIsResendDisabled(true);
        setTimer(RESEND_OTP_TIME);
    };

    if (isAuthenticating) {
        return <LoadingOverlay message="Logging in ..." />;
    }



    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs[index - 1]?.current?.focus();
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../assets/images/6325251.jpg")} style={styles.image}/>
            
            <Text style={styles.title}>Enter OTP</Text>
            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        ref={inputRefs[index]}
                        style={styles.otpBox}
                        keyboardType="numeric"
                        onFocus={() => {
                            const updatedOtp = [...otp];
                            updatedOtp[index] = "";
                            setOtp(updatedOtp);
                        }}
                        contextMenuHidden={false}
                        value={value}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}

                    />
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <ThemedText style={styles.buttonText}>Verify OTP</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResendOtp} disabled={isResendDisabled}>
                <ThemedText style={[styles.resendText, isResendDisabled && styles.resendDisabled]}>
                    {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color:"black",
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "60%",
    },
    otpBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "#333",
        textAlign: "center",
        fontSize: 24,
        color:"black",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    image: {
        width: 250,
        height: 200,
        resizeMode: "contain",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#6200ea",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
    },
    resendText: {
        marginTop: 15,
        color: "#007bff",
        fontSize: 16,
    },
    resendDisabled: {
        color: "gray",
    },
});

export default OtpScreen;
