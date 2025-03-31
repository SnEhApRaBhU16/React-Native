import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import AuthForm from "./AuthForm";

function AuthContent({ isLogin, onAuthenticate }:{isLogin:boolean,
    onAuthenticate?:(cred:{
        email:string,
        password:string,
        firstName:string,
        lastName:string})=>void}) {
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
    });

   

    function submitHandler(credentials:{email:string,
    password:string,
    firstName:string,
    lastName:string}) {
        let { email, password } = credentials;
        const {firstName,lastName} = credentials;

        email = email.trim();
        password = password.trim();

        const emailIsValid = email.includes("@");
        const passwordIsValid = password.length > 6;

        if (
            !emailIsValid ||
      !passwordIsValid         ) {
            Alert.alert("Invalid input", "Please check your entered credentials.");
            setCredentialsInvalid({
                email: !emailIsValid,
                password: !passwordIsValid,
            });
            return;
        }
        onAuthenticate?.({ email, password,firstName,lastName });
    }

    return (
        <View style={styles.container}>
            <AuthForm
                isLogin={isLogin}
                onSubmit={submitHandler}
                credentialsInvalid={credentialsInvalid}
            />
            
        </View>
    );
}

export default AuthContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
        // fontFamily: getFontFamily(true, "bold")
    },
    button: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#3399ff"
    },
    
});